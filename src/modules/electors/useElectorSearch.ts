import { useState, useRef, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import { isValidUUID } from '../../utils/uuid';

export interface ElectorLookupResult {
  nombres: string;
  apellidos: string;
  edad: string;
  municipio?: string;
  departamento?: string;
  puesto_votacion?: string;
  mesa?: string;
  duplicado?: boolean;
  encontrado?: boolean;
  mensaje?: string;
  origen?: string;
}

const lookupCache = new Map<string, { result: ElectorLookupResult; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de caché para consultas repetidas

export function useElectorSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buscarDocumento = useCallback(
    async (documento: string, tenantId?: string | null): Promise<ElectorLookupResult | null> => {
      const docLimpio = String(documento || '').replace(/\D/g, '').trim();
      if (docLimpio.length < 5) return null;

      // Verificación rápida en caché en memoria (0ms latency para consultas recientes)
      const cacheKey = `${docLimpio}_${tenantId || 'global'}`;
      const cached = lookupCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.result;
      }

      // 1. Limpiar cualquier temporizador previo para evitar fugas y abortos accidentales
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // 2. Cancelar cualquier petición en vuelo para evitar condiciones de carrera (Race Conditions)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      // 3. Timeout tolerante de 10 segundos para dar margen al servicio externo DNP / Sisbén
      timeoutRef.current = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 10000);

      try {
        // 3. Petición estándar compatible con todos los navegadores (Firefox, Safari, Chrome, Edge)
        let res: any = null;
        try {
          const response = await fetch('/api/search-elector', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
            },
            body: JSON.stringify({
              cedula: docLimpio,
              tenantId: tenantId || null,
            }),
            signal: abortControllerRef.current.signal,
          });

          if (response.ok) {
            const ct = response.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
              res = await response.json();
            }
          }
        } catch {
          // Evaluar fallback de red
        }

        // 4. Fallback de alta resiliencia directo a Supabase
        if (!res || (!res.encontrado && !res.duplicado)) {
          try {
            // Anti-duplicado en campaña activa
            if (tenantId && isValidUUID(tenantId)) {
              const { data: existente } = await (supabase as any)
                .from('electores')
                .select('id, nombres, apellidos, puesto_votacion')
                .eq('tenant_id', tenantId)
                .eq('cedula', docLimpio)
                .maybeSingle();

              if (existente) {
                res = {
                  ok: true,
                  duplicado: true,
                  encontrado: false,
                  mensaje: `Elector ya registrado (${existente.nombres} ${existente.apellidos}).`,
                  data: {
                    nombres: existente.nombres,
                    apellidos: existente.apellidos,
                    puesto_votacion: existente.puesto_votacion || '',
                  },
                };
              }
            }

            if (!res?.duplicado) {
              const { data: persona } = await (supabase as any)
                .from('censo_electoral')
                .select('nombres, apellidos, edad, anio_nacimiento, puesto_votacion, mesa, municipio, departamento')
                .eq('cedula', docLimpio)
                .maybeSingle();

              if (persona) {
                let edadFinal = persona.edad ? String(persona.edad) : '';
                if (!edadFinal && persona.anio_nacimiento) {
                  const anio = parseInt(String(persona.anio_nacimiento), 10);
                  if (!isNaN(anio) && anio > 1900) {
                    edadFinal = String(new Date().getFullYear() - anio);
                  }
                }

                res = {
                  ok: true,
                  duplicado: false,
                  encontrado: true,
                  nombres: persona.nombres || '',
                  apellidos: persona.apellidos || '',
                  edad: edadFinal,
                  puesto_votacion: persona.puesto_votacion || '',
                  mesa: persona.mesa ? String(persona.mesa) : '',
                  municipio: persona.municipio || '',
                  departamento: persona.departamento || '',
                };
              } else {
                const { data: maestro } = await (supabase as any)
                  .from('censo_maestro')
                  .select('nombres, apellidos, edad, puesto_sugerido, mesa_sugerida, municipio, departamento')
                  .eq('cedula', docLimpio)
                  .maybeSingle();

                if (maestro) {
                  res = {
                    ok: true,
                    duplicado: false,
                    encontrado: true,
                    origen: 'censo_maestro',
                    nombres: maestro.nombres || '',
                    apellidos: maestro.apellidos || '',
                    edad: maestro.edad ? String(maestro.edad) : '',
                    puesto_votacion: maestro.puesto_sugerido || '',
                    mesa: maestro.mesa_sugerida ? String(maestro.mesa_sugerida) : '',
                    municipio: maestro.municipio || '',
                    departamento: maestro.departamento || '',
                  };
                } else {
                  res = {
                    ok: true,
                    duplicado: false,
                    encontrado: false,
                    mensaje: 'Persona no registrada o número de documento no encontrado en el censo oficial ni en RUI.',
                  };
                }
              }
            }
          } catch (dbErr) {
            console.warn('Error en fallback directo Supabase:', dbErr);
            res = {
              ok: true,
              duplicado: false,
              encontrado: false,
              mensaje: 'Persona no registrada o número de documento no encontrado.',
            };
          }
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Caso A: Duplicado en la campaña activa
        if (res && res.duplicado) {
          const dupRes: ElectorLookupResult = {
            nombres: res.data?.nombres || res.nombres || '',
            apellidos: res.data?.apellidos || res.apellidos || '',
            edad: '',
            duplicado: true,
            mensaje: res.mensaje || 'Elector ya registrado en esta campaña.',
          };
          lookupCache.set(cacheKey, { result: dupRes, timestamp: Date.now() });
          return dupRes;
        }

        // Caso B: Si no se encontró el documento en las fuentes oficiales
        if (!res || res.encontrado === false || res.ok === false) {
          const notFoundRes: ElectorLookupResult = {
            nombres: '',
            apellidos: '',
            edad: '',
            duplicado: false,
            encontrado: false,
            mensaje: res?.mensaje || 'Persona no registrada o número de documento no encontrado en el censo oficial ni en RUI.',
          };
          lookupCache.set(cacheKey, { result: notFoundRes, timestamp: Date.now() });
          return notFoundRes;
        }

        const payloadData = res.data || res;
        const nombresVal = payloadData?.nombres || res?.nombres || '';
        const apellidosVal = payloadData?.apellidos || res?.apellidos || '';

        if (!nombresVal && !apellidosVal) {
          return {
            nombres: '',
            apellidos: '',
            edad: '',
            duplicado: false,
            encontrado: false,
            mensaje: 'Persona no registrada o número de documento no encontrado.',
          };
        }

        // Caso C: Documento verificado
        const okRes: ElectorLookupResult = {
          nombres: nombresVal,
          apellidos: apellidosVal,
          edad:
            payloadData?.edad !== undefined && payloadData?.edad !== null
              ? String(payloadData.edad)
              : (res.edad ? String(res.edad) : ''),
          municipio: payloadData?.municipio || res.municipio || '',
          departamento: payloadData?.departamento || res.departamento || '',
          puesto_votacion: payloadData?.puesto_votacion || payloadData?.puesto_sugerido || res.puesto_votacion || '',
          mesa:
            payloadData?.mesa || payloadData?.mesa_sugerida || res.mesa
              ? String(payloadData?.mesa || payloadData?.mesa_sugerida || res.mesa)
              : '',
          duplicado: false,
          encontrado: true,
          origen: res.origen || payloadData?.origen || 'censo_nacional',
          mensaje: res.mensaje || '',
        };
        lookupCache.set(cacheKey, { result: okRes, timestamp: Date.now() });
        return okRes;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.warn('[QA-Lookup] Petición cancelada o excedió el tiempo límite (Timeout).');
        } else {
          console.error('[QA-Lookup Error]:', err);
          setError(err.message || 'Error de comunicación.');
        }
        return null;
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setLoading(false);
      }
    },
    []
  );

  return { buscarDocumento, loading, error };
}
