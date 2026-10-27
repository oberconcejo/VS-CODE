import React from 'react';
import { motion } from 'motion/react';

/**
 * ArchitecturalBackground — Sistema de Fondo Multicapa Ultra-Optimizado (GPU Accelerated)
 *
 * Optimizaciones aplicadas:
 * - translate3d(0,0,0) y will-change: transform en capas de aura lumínica.
 * - Reducción del radio de blur a 80px (reduce el fill-rate cost en GPU x3).
 * - Grano analógico optimizado estático para 0 overhead por frame.
 */
export const ArchitecturalBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none transform-gpu"
    >
      {/* =======================================================================
          CAPA 1: BASE DE OBSIDIANA PROFUNDA CON DEGRADADO RADIAL CENITAL
          ======================================================================= */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: '#060913',
          backgroundImage:
            'radial-gradient(120% 85% at 50% 0%, #111A2E 0%, #070B14 55%, #04060B 100%)',
        }}
      />

      {/* =======================================================================
          CAPA 2: RETÍCULA TÉCNICA CARTOGRÁFICA CON CRUCES (+) Y MÁSCARA RADIAL
          ======================================================================= */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 20%, #000 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 20%, #000 40%, transparent 100%)',
        }}
      >
        {/* Cruces técnicos (+) de referencia cartográfica e intersecciones clave */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.25]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="geo-crosses"
              width="192"
              height="192"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M -4,0 L 4,0 M 0,-4 L 0,4"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo-crosses)" />
        </svg>

        {/* Haces de datos dinámicos con aceleración por hardware */}
        <motion.div
          animate={{
            x: ['-20%', '120%'],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-[144px] left-0 w-48 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent will-change-transform"
        />
        <motion.div
          animate={{
            y: ['-20%', '120%'],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute top-0 left-[384px] w-[1px] h-48 bg-gradient-to-b from-transparent via-blue-400/80 to-transparent will-change-transform"
        />
      </div>

      {/* =======================================================================
          CAPA 3: ILUMINACIÓN VOLUMÉTRICA DIRECCIONAL OPTIMIZADA (GPU-FRIENDLY)
          ======================================================================= */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.88, 0.7],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[800px] h-[480px] rounded-full blur-[80px] mix-blend-screen pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(37, 99, 235, 0.20) 0%, rgba(30, 64, 175, 0.10) 45%, transparent 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.68, 0.5],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute top-[80px] left-[15%] w-[480px] h-[350px] rounded-full blur-[85px] mix-blend-screen pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.10) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 75%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.45, 0.6, 0.45],
          x: [0, -18, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-[160px] right-[10%] w-[440px] h-[360px] rounded-full blur-[90px] mix-blend-screen pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.07) 0%, rgba(217, 119, 6, 0.03) 45%, transparent 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* =======================================================================
          CAPA 4: TEXTURA DE GRANO ANALÓGICO ANTI-IA (SVG FRACTAL NOISE)
          ======================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.024] mix-blend-overlay pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="architectural-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#architectural-noise)" />
      </svg>
    </div>
  );
};
