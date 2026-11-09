import Lenis from 'lenis';
import React, { useState, useEffect, startTransition } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from 'motion/react';
import {
  Shield,
  Menu,
  X,
  ArrowRight,
  Check,
  Cloud,
  Headphones,
  Users,
  BarChart3,
  Building2,
  Map,
  ShieldCheck,
  ChevronRight,
  Landmark,
} from 'lucide-react';
import { ArchitecturalBackground } from '../../components/ui/ArchitecturalBackground';
import { AnimatedCounter } from '../../components/ui/AppleAnimatedCounter';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

// ----------------------------------------------------------------------------
// CURVAS Y FÍSICAS DE RESORTE APPLE PRO-MOTION
// ----------------------------------------------------------------------------
const appleSpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 32,
  mass: 0.85,
};

const appleSoftSpring = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 24,
  mass: 0.8,
};

// ----------------------------------------------------------------------------
// SISTEMA DE ANIMACIÓN CIRREL: ESCALONADO, ELEVACIÓN SUAVE Y CURVA CUBIC-BEZIER
// ----------------------------------------------------------------------------
const isMobile =
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches));

// Viewport predictivo para desktop; en móvil desactivado para evitar esperar al IntersectionObserver
export const cirrelViewport = isMobile
  ? undefined
  : {
      once: true,
      amount: 0.05,
      margin: '0px 0px 180px 0px',
    };

export const cirrelEase = [0.16, 1, 0.3, 1] as const;

// En celular: 100% visible sin retraso ni opacidad cero inicial
export const cirrelStaggerContainer: Variants = isMobile
  ? {
      hidden: { opacity: 1 },
      visible: { opacity: 1, transition: { duration: 0 } },
    }
  : {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.06,
          delayChildren: 0.02,
        },
      },
    };

export const cirrelFadeUpItem: Variants = isMobile
  ? {
      hidden: { opacity: 1, y: 0, scale: 1 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
    }
  : {
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.97,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.55,
          ease: cirrelEase,
        },
      },
    };

const keynoteContainer = cirrelStaggerContainer;
const keynoteItem = cirrelFadeUpItem;

// ----------------------------------------------------------------------------
// DATOS REALES DE LAS CORPORACIONES Y NIVELES ELECTORALES
// ----------------------------------------------------------------------------
interface CorporationData {
  id: 'gobernacion' | 'asamblea' | 'alcaldia' | 'concejo';
  name: string;
  scope: string;
  tag: string;
  color: string;
  bgLight: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  summary: string;
  metrics: {
    label: string;
    numValue?: number;
    value: string;
  }[];
  responsibilities: string[];
}

const CORPORATIONS: CorporationData[] = [
  {
    id: 'gobernacion',
    name: 'Gobernaciones',
    scope: 'Nivel Departamental Ejecutivo',
    tag: '32 Departamentos',
    color: 'text-amber-400',
    bgLight: 'bg-amber-500/10 border-amber-500/20',
    icon: Map,
    summary:
      'Órgano ejecutivo departamental responsable de la administración de recursos regionales, seguridad y planes de desarrollo territorial.',
    metrics: [
      { label: 'Cargos ejecutivos', numValue: 32, value: '32' },
      { label: 'Departamentos', numValue: 32, value: '32' },
      { label: 'Censo electoral', value: '39.0M+' },
      { label: 'Período constitucional', value: '4 Años' },
    ],
    responsibilities: [
      'Coordinación de infraestructura vial y salud departamental',
      'Dirección de políticas públicas territoriales',
      'Articulación institucional con el Gobierno Nacional',
    ],
  },
  {
    id: 'asamblea',
    name: 'Asambleas Departamentales',
    scope: 'Nivel Departamental Coadministrador',
    tag: '418 Curules Nacionales',
    color: 'text-emerald-400',
    bgLight: 'bg-emerald-500/10 border-emerald-500/20',
    icon: Landmark,
    summary:
      'Corporaciones públicas de elección popular que ejercen control político sobre las gobernaciones y expiden ordenanzas.',
    metrics: [
      { label: 'Asambleas', numValue: 32, value: '32' },
      { label: 'Curules totales', numValue: 418, value: '418' },
      { label: 'Circunscripciones', value: 'Departamental' },
      { label: 'Umbral promedio', value: '50% Cifra Repartidora' },
    ],
    responsibilities: [
      'Control político a secretarías departamentales',
      'Debate y aprobación de presupuestos regionales',
      'Reglamentación de tributos y estampillas',
    ],
  },
  {
    id: 'alcaldia',
    name: 'Alcaldías Municipales',
    scope: 'Nivel Local Ejecutivo',
    tag: '1.102 Municipios y Distritos',
    color: 'text-rose-400',
    bgLight: 'bg-rose-500/10 border-rose-500/20',
    icon: Building2,
    summary:
      'Máxima autoridad política y administrativa en el municipio, encargada del orden público local y desarrollo social.',
    metrics: [
      { label: 'Municipios', numValue: 1102, value: '1.102' },
      { label: 'Distritos especiales', numValue: 6, value: '6' },
      { label: 'Puestos de votación', numValue: 12000, value: '+12.000' },
      { label: 'Mesas instaladas', numValue: 106000, value: '+106.000' },
    ],
    responsibilities: [
      'Gestión del Plan de Ordenamiento Territorial (POT)',
      'Administración de educación, salud y servicios públicos',
      'Preservación de la convivencia y orden público local',
    ],
  },
  {
    id: 'concejo',
    name: 'Concejos Municipales',
    scope: 'Nivel Local Coadministrador',
    tag: '12.000+ Curules Edilicias',
    color: 'text-blue-400',
    bgLight: 'bg-blue-500/10 border-blue-500/20',
    icon: Users,
    summary:
      'Corporaciones político-administrativas que ejercen control sobre la administración municipal y expiden acuerdos.',
    metrics: [
      { label: 'Corporaciones', numValue: 1102, value: '1.102' },
      { label: 'Curules edilicias', numValue: 12000, value: '+12.000' },
      { label: 'Rango de curules', value: '7 a 45 por municipio' },
      { label: 'Sistema de elección', value: 'Voto preferente / Cerrado' },
    ],
    responsibilities: [
      'Aprobación de planes de desarrollo municipal',
      'Autorización de endeudamiento y facultades al alcalde',
      'Vigilancia directa de la inversión comunitaria',
    ],
  },
];

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', href: '#inicio' },
  { id: 'caracteristicas', label: 'Características', href: '#caracteristicas' },
  { id: 'cobertura', label: 'Cobertura', href: '#cobertura' },
  { id: 'seguridad', label: 'Seguridad', href: '#seguridad' },
  { id: 'contacto', label: 'Contacto', href: '#contacto' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  const [activeNav, setActiveNav] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCorpId, setSelectedCorpId] = useState<'gobernacion' | 'asamblea' | 'alcaldia' | 'concejo'>('gobernacion');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // --------------------------------------------------------------------------
  // SCROLL CHOREOGRAPHY & PARALLAX CON INERCIA (APPLE-LIKE PHYSICS)
  // --------------------------------------------------------------------------
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax suave en hero & escala cinemática
  const heroScale = useTransform(smoothProgress, [0, 0.25], [1, 0.96]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0.65]);
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 40]);

  // --------------------------------------------------------------------------
  // INICIALIZACIÓN LENIS (60/120 FPS FLUID SCROLLING)
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Si es dispositivo táctil o pantalla pequeña, usar scroll nativo del SO sin overhead de JS
    const isTouchOrMobile =
      typeof window !== 'undefined' &&
      ((typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches) || window.innerWidth < 1024);

    if (isTouchOrMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Listener nativo ultra-eficiente para el estado de scroll del Navbar
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 24);
    });
  }, [scrollY]);

  const selectedCorp = CORPORATIONS.find((c) => c.id === selectedCorpId) || CORPORATIONS[0];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen text-zinc-100 selection:bg-blue-600/30 selection:text-white relative overflow-x-hidden flex flex-col justify-between font-sans antialiased">
      {/* Fondo Arquitectónico Multicapa */}
      <ArchitecturalBackground />

      {/* =========================================================================
          1. NAVBAR ESTILO macOS / iOS (APPLE VIBRANCY & SPRING PHYSICS)
          ========================================================================= */}
      <header className="fixed top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none flex flex-col items-center">
        <div className={`w-full max-w-6xl cirrel-glass-nav rounded-full px-4 sm:px-6 h-16 flex items-center justify-between pointer-events-auto transition-[box-shadow,border-color] duration-300 ${
          isScrolled
            ? 'shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_24px_rgba(59,130,246,0.15)] border-white/[0.14]'
            : 'shadow-2xl border-white/[0.08]'
        }`}>
          {/* Logo Institucional con Tap Magnético */}
          <motion.a
            href="#inicio"
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => setActiveNav('inicio')}
            className="flex items-center gap-3 min-w-0 group cursor-pointer focus-visible:outline-none"
          >
            <div className="h-10 w-10 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] flex items-center justify-center text-blue-400 shrink-0 group-hover:border-blue-500/40 transition-colors">
              <Shield className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase leading-none font-bold">
                PLATAFORMA
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none mt-1">
                ELECTORAL
              </span>
            </div>
          </motion.a>

          {/* Navegación Desktop con píldora flotante Cirrel Spring (layoutId="cirrel-nav-pill") */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeNav === link.id;
              return (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav(link.id);
                    const target = document.querySelector(link.href);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                  }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-150 select-none ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="cirrel-nav-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_0_16px_rgba(59,130,246,0.25)] -z-10"
                    />
                  )}
                  {link.label}
                </motion.a>
              );
            })}
          </nav>

          {/* CTA Desktop con Física Háptica Cirrel Glass Pill */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              type="button"
              onClick={() => startTransition(() => onNavigateToLogin())}
              whileHover="hover"
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="cirrel-glass-pill group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-semibold tracking-wide transition-all cursor-pointer focus-visible:outline-none will-change-transform"
            >
              <span>Acceder a la plataforma</span>
              <motion.span
                variants={{
                  hover: { x: 4 },
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="inline-block"
              >
                <ArrowRight className="w-4 h-4 ml-0.5 text-blue-400" />
              </motion.span>
            </motion.button>
          </div>

          {/* Botón de Menú Móvil / Tablet */}
          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => startTransition(() => onNavigateToLogin())}
              className="cirrel-glass-pill px-3.5 py-1.5 rounded-full text-white text-xs font-bold sm:hidden active:scale-[0.98]"
            >
              Acceder
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="cirrel-glass-pill inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Drawer Móvil y Tablet Flotante */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-6xl mt-2 lg:hidden cirrel-glass-card rounded-3xl p-4 overflow-hidden pointer-events-auto border border-white/[0.1] shadow-2xl"
            >
              <nav className="flex flex-col gap-1.5 text-sm font-semibold">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => {
                      setActiveNav(link.id);
                      setMobileMenuOpen(false);
                      const target = document.querySelector(link.href);
                      if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`rounded-xl px-4 py-2.5 transition-colors ${
                      activeNav === link.id
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                        : 'text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    startTransition(() => onNavigateToLogin());
                  }}
                  className="cirrel-glass-pill mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30"
                >
                  <span>Acceder a la plataforma</span>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =========================================================================
          CONTENEDOR MAESTRO
          ========================================================================= */}
      <main className="flex-1 z-10 pt-24 sm:pt-28 lg:pt-32 pb-16" id="inicio">
        {/* =========================================================================
            2. HERO SECTION CON REVELADO CINEMATOGRÁFICO DE KEYNOTE
            ========================================================================= */}
        <motion.section
          style={isMobile ? undefined : { scale: heroScale, opacity: heroOpacity, y: heroY }}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 ${isMobile ? '' : 'will-change-transform'}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Columna Izquierda: Información Principal con Blur-Fade Stagger */}
            <motion.div
              variants={keynoteContainer}
              initial={isMobile ? false : "hidden"}
              whileInView={isMobile ? undefined : "visible"}
              viewport={cirrelViewport}
              className="lg:col-span-7 text-left space-y-6"
            >
              <motion.div variants={keynoteItem}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-blue-400/30 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_20px_rgba(37,99,235,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>Sistema de gestión electoral — Colombia 2026</span>
                </div>
              </motion.div>

              <motion.h1
                variants={keynoteItem}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] text-balance"
              >
                Gestión integral del{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  proceso electoral
                </span>
              </motion.h1>

              <motion.p
                variants={keynoteItem}
                className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl"
              >
                Plataforma tecnológica diseñada para estructurar, auditar y dar seguimiento a todas las etapas de la campaña en Colombia. Integración con censo oficial de la Registraduría y DIVIPOLE nacional.
              </motion.p>

              {/* Botones de Acción con respuesta magnética ProMotion */}
              <motion.div
                variants={keynoteItem}
                className="flex flex-col sm:flex-row items-center gap-3.5 pt-2"
              >
                <motion.button
                  type="button"
                  whileHover="hover"
                  whileTap={{ scale: 0.96 }}
                  transition={appleSpring}
                  onClick={onNavigateToLogin}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-wide transition-colors shadow-xl shadow-blue-600/35 cursor-pointer flex items-center justify-center gap-2 border border-blue-400/40 will-change-transform"
                >
                  <span>Acceder al sistema</span>
                  <motion.span
                    variants={{
                      hover: { x: 4 },
                    }}
                    transition={appleSpring}
                    className="inline-block"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>

                <motion.a
                  href="#cobertura"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.96 }}
                  transition={appleSpring}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] text-zinc-200 text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] will-change-transform"
                >
                  <span>Explorar corporaciones</span>
                </motion.a>
              </motion.div>

              <motion.div
                variants={keynoteItem}
                className="pt-4 flex flex-wrap items-center gap-5 text-xs text-zinc-400 font-medium"
              >
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Seguridad y trazabilidad criptográfica</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Cloud className="w-4 h-4 text-blue-400" />
                  <span>Despliegue distribuido de alta disponibilidad</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Tarjeta HUD Métrica Lateral con Conteo Progresivo Apple */}
            <motion.div
              variants={keynoteContainer}
              initial={isMobile ? false : "hidden"}
              whileInView={isMobile ? undefined : "visible"}
              viewport={cirrelViewport}
              className="lg:col-span-5 grid grid-cols-2 gap-3.5 w-full"
            >
              {[
                { rawNumber: 32, label: 'Departamentos', sub: 'Cobertura 100% oficial' },
                { rawNumber: 1102, label: 'Municipios', sub: 'Concejos y alcaldías' },
                { rawNumber: 12000, prefix: '+', label: 'Puestos Votación', sub: 'DIVIPOLE 2026' },
                { rawNumber: 39, suffix: 'M+', prefix: '+', label: 'Censo Habilitado', sub: 'Registraduría Nacional' },
              ].map((metric) => (
                <motion.div
                  key={metric.label}
                  variants={keynoteItem}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={appleSoftSpring}
                  className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.35)] transition-[border-color,background-color] flex flex-col justify-between cursor-default will-change-transform"
                >
                  <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white tracking-tight">
                    <AnimatedCounter
                      value={metric.rawNumber}
                      prefix={metric.prefix || ''}
                      suffix={metric.suffix || ''}
                    />
                  </span>
                  <div className="mt-2">
                    <span className="text-xs font-bold text-zinc-200 block">{metric.label}</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">{metric.sub}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* =========================================================================
            3. FUNCIONALIDADES DEL SISTEMA CON STAGGER KEYNOTE
            ========================================================================= */}
        <section id="caracteristicas" className="scroll-mt-24 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <motion.div
              variants={keynoteContainer}
              initial={isMobile ? false : "hidden"}
              whileInView={isMobile ? undefined : "visible"}
              viewport={cirrelViewport}
              className="lg:col-span-4 text-left space-y-4"
            >
              <motion.span variants={keynoteItem} className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block">
                MÓDULOS DE CONTROL
              </motion.span>
              <motion.h2 variants={keynoteItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Funcionalidades del sistema
              </motion.h2>
              <motion.p variants={keynoteItem} className="text-sm text-zinc-300 leading-relaxed">
                Módulos integrados para la gestión rigurosa del proceso electoral: registro de electores, georreferenciación territorial, asignación de coordinadores y auditoría en tiempo real.
              </motion.p>
              <motion.div variants={keynoteItem} className="pt-2">
                <motion.button
                  type="button"
                  whileHover="hover"
                  whileTap={{ scale: 0.96 }}
                  transition={appleSpring}
                  onClick={onNavigateToLogin}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-blue-600/30 cursor-pointer border border-blue-400/30 will-change-transform"
                >
                  <span>Ver todas las funciones</span>
                  <motion.span
                    variants={{
                      hover: { x: 4 },
                    }}
                    transition={appleSpring}
                    className="inline-block"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Grid 6 Módulos con Parallax Hover & Micro-Física */}
            <motion.div
              variants={keynoteContainer}
              initial={isMobile ? false : "hidden"}
              whileInView={isMobile ? undefined : "visible"}
              viewport={cirrelViewport}
              className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left"
            >
              {[
                {
                  icon: Users,
                  title: 'Gestión de Campañas',
                  desc: 'Administra y estructura campañas con roles operativos de alta fidelidad: Administradores, Coordinadores y Líderes.',
                },
                {
                  icon: Building2,
                  title: 'Padrón Electoral',
                  desc: 'Control y auditoría unificada de simpatizantes con validación automática contra el censo nacional.',
                },
                {
                  icon: BarChart3,
                  title: 'Información Oficial',
                  desc: 'Mapeo geoespacial de puestos y mesas con datos oficiales actualizados de la Registraduría.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Seguridad y RBAC',
                  desc: 'Aislamiento estricto por campaña (Multi-tenant), cifrado en tránsito y registros de auditoría inmutables.',
                },
                {
                  icon: Cloud,
                  title: 'Sincronización Cloud',
                  desc: 'Capacidad operativa ininterrumpida y sincronización en tiempo real desde cualquier dispositivo.',
                },
                {
                  icon: Headphones,
                  title: 'Soporte y Auditoría',
                  desc: 'Acompañamiento especializado en jornadas electorales con exportación técnica de reportes.',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={keynoteItem}
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={appleSoftSpring}
                  className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.3)] transition-[background-color,border-color] group cursor-default will-change-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            4. SECCIÓN COBERTURA: BENTO GRID INTERACTIVO CON EXPANSIÓN FÍSICA APPLE
            ========================================================================= */}
        <section
          id="cobertura"
          className="scroll-mt-24 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]"
        >
          {/* Encabezado */}
          <motion.div
            variants={keynoteContainer}
            initial={isMobile ? false : "hidden"}
            whileInView={isMobile ? undefined : "visible"}
            viewport={cirrelViewport}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-left"
          >
            <div>
              <motion.span variants={keynoteItem} className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block">
                ARQUITECTURA INSTITUCIONAL
              </motion.span>
              <motion.h2 variants={keynoteItem} className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
                Estructura y Niveles Electorales
              </motion.h2>
              <motion.p variants={keynoteItem} className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Selecciona una corporación para inspeccionar su alcance territorial, distribución de curules y parámetros técnicos del censo 2026.
              </motion.p>
            </div>
            <motion.div variants={keynoteItem} className="flex items-center gap-2">
              <span className="cirrel-glass-pill px-3.5 py-1.5 text-emerald-400 text-xs font-mono font-semibold tabular-nums border border-emerald-500/25">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
                32 Departamentos Activos
              </span>
            </motion.div>
          </motion.div>

          {/* Grid 4 Corporaciones Responsive: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 con Cirrel Glass & Spotlight Glare */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {CORPORATIONS.map((corp) => {
              const isSelected = selectedCorpId === corp.id;
              const IconComponent = corp.icon;

              return (
                <motion.button
                  key={corp.id}
                  layoutId={`corp-card-${corp.id}`}
                  type="button"
                  onClick={() => setSelectedCorpId(corp.id)}
                  onMouseMove={(e) => {
                    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={`cirrel-glass-card cirrel-spotlight group p-5 rounded-2xl text-left cursor-pointer relative overflow-hidden transition-all duration-300 will-change-transform ${
                    isSelected
                      ? 'border-blue-500/60 shadow-[0_12px_36px_rgba(37,99,235,0.25),inset_0_1px_0_0_rgba(255,255,255,0.2)] ring-1 ring-blue-500/40'
                      : 'hover:border-white/[0.14]'
                  }`}
                >
                  {/* Glow interno activo */}
                  {isSelected && (
                    <motion.div
                      layoutId="corp-active-glow"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-2xl bg-blue-500/[0.06] -z-10"
                    />
                  )}

                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Contenedor de cristal translúcido tintado (ámbar, esmeralda, rubí, cobalto) */}
                    <div
                      className={`w-12 h-12 rounded-xl backdrop-blur-xl flex items-center justify-center border shadow-inner transition-transform duration-300 group-hover:scale-105 ${corp.bgLight} ${corp.color}`}
                    >
                      <IconComponent className="w-5 h-5" strokeWidth={2.2} />
                    </div>

                    <span className="cirrel-glass-pill px-2.5 py-0.5 text-[10px] font-mono font-medium text-zinc-300 border border-white/[0.08] tabular-nums">
                      {corp.tag}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                        {corp.name}
                      </h3>
                      {isSelected && (
                        <motion.span
                          layoutId="active-dot-corp"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="w-1.5 h-1.5 rounded-full bg-blue-400"
                        />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-medium line-clamp-1">
                      {corp.scope}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Módulo de Niveles Territoriales: Visor Detallado en Cirrel Glass Card con Spotlight Glare */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCorp.id}
                initial={{ opacity: 0, scale: 0.98, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }}
                className="cirrel-glass-card cirrel-spotlight p-6 sm:p-8 md:p-10 rounded-3xl text-left relative overflow-hidden will-change-transform shadow-2xl border border-white/[0.1]"
              >
                {/* Cabecera del Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl backdrop-blur-xl flex items-center justify-center border shadow-inner ${selectedCorp.bgLight} ${selectedCorp.color}`}
                    >
                      <selectedCorp.icon className="w-7 h-7" strokeWidth={2.2} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                        {selectedCorp.scope}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                        {selectedCorp.name}
                      </h3>
                    </div>
                  </div>

                  <span className="self-start sm:self-center cirrel-glass-pill px-4 py-1.5 text-xs font-mono font-semibold text-blue-300 border border-blue-400/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                    {selectedCorp.tag}
                  </span>
                </div>

                {/* Resumen */}
                <p className="text-sm text-zinc-300 leading-relaxed mt-5 max-w-3xl">
                  {selectedCorp.summary}
                </p>

                {/* Grid de 4 Métricas Técnicas en Cristales Concéntricos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
                  {selectedCorp.metrics.map((m) => (
                    <motion.div
                      key={m.label}
                      whileHover={{ scale: 1.02 }}
                      transition={appleSoftSpring}
                      className="cirrel-glass-card p-4 rounded-2xl border border-white/[0.07] shadow-inner cursor-default will-change-transform"
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block tracking-wider">
                        {m.label}
                      </span>
                      <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums mt-1 block">
                        {m.numValue ? (
                          <AnimatedCounter value={m.numValue} />
                        ) : (
                          m.value
                        )}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Competencias Electorales y Alcance Operativo Territorial */}
                <div className="mt-7 pt-6 border-t border-white/[0.08]">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-3.5">
                    Competencias y Alcance Operativo Territorial:
                  </span>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedCorp.responsibilities.map((r, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, ...appleSpring }}
                        className="cirrel-glass-card p-3 rounded-xl border border-white/[0.06] flex items-start gap-2.5 text-xs text-zinc-300"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span className="leading-relaxed">{r}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Botón de Acción Directa con Flecha */}
                <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-zinc-400">
                    Gestione votantes, testigos y padrón para esta corporación:
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    onClick={() => startTransition(() => onNavigateToLogin())}
                    className="cirrel-glass-pill w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-600/30 cursor-pointer border border-blue-400/40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 will-change-transform"
                  >
                    <span>Ingresar con {selectedCorp.name}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* =========================================================================
            5. SECCIÓN DE ACCESO RESTRINGIDO (SEGURIDAD CIRREL GLASS)
            ========================================================================= */}
        <section id="seguridad" className="scroll-mt-28 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-white/[0.08]">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={cirrelViewport}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="cirrel-glass-card p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-400 mx-auto flex items-center justify-center mb-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
              <Shield className="w-6 h-6" strokeWidth={2} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Acceso Institucional Restringido
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto mt-3">
              Esta plataforma es de uso exclusivo para equipos electorales registrados. Ingrese con sus credenciales autorizadas para acceder a los módulos de su corporación.
            </p>
            <div className="mt-7 flex justify-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={() => startTransition(() => onNavigateToLogin())}
                className="cirrel-glass-pill px-8 py-3.5 rounded-full text-white text-sm font-bold tracking-wide transition-all shadow-xl shadow-blue-600/30 cursor-pointer flex items-center gap-2 border border-blue-400/40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 will-change-transform"
              >
                <span>Acceder a la plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            6. SECCIÓN PREGUNTAS FRECUENTES (CONTACTO)
            ========================================================================= */}
        <motion.section
          id="contacto"
          initial={isMobile ? false : "hidden"}
          whileInView={isMobile ? undefined : "visible"}
          viewport={cirrelViewport}
          variants={cirrelStaggerContainer}
          className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08] text-left"
        >
          <motion.div variants={cirrelFadeUpItem} className="text-center mb-8 space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              RESOLUCIÓN DE DUDAS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Preguntas Frecuentes
            </h3>
          </motion.div>

          <motion.div variants={cirrelStaggerContainer} initial={isMobile ? false : "hidden"} whileInView={isMobile ? undefined : "visible"} viewport={cirrelViewport} className="space-y-3">
            {[
              {
                q: '¿Cómo garantiza la plataforma la transparencia electoral?',
                a: 'El sistema integra los datos oficiales de censo y puestos DIVIPOLE con auditoría criptográfica, eliminando discrepancias y blindando el registro de simpatizantes con trazabilidad completa de cada modificación.',
              },
              {
                q: '¿Es compatible con cualquier tipo de campaña (Gobernación, Asamblea, Alcaldía, Concejo)?',
                a: 'Sí. La arquitectura modular permite configurar cualquier contienda municipal o departamental con asignación de metas automáticas, georreferenciación de votantes y control de testigos.',
              },
              {
                q: '¿Quién puede acceder al sistema?',
                a: 'El acceso está restringido a personal acreditado por el director de campaña: Administradores Generales, Coordinadores de Zona y Líderes de Puesto.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={faq.q}
                layout
                transition={appleSpring}
                variants={cirrelFadeUpItem} className="cirrel-glass-card rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
              >
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.995 }}
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-sm text-white hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 90 : 0 }}
                    transition={appleSpring}
                  >
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </motion.div>
                </motion.button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={appleSpring}
                      className="px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.05] pt-3 overflow-hidden"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>

      {/* =========================================================================
          6. FOOTER TÉCNICO SOBRIO
          ========================================================================= */}
      <footer className="border-t border-white/[0.08] bg-[#05070D]/85 backdrop-blur-xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold leading-none">
                  PLATAFORMA
                </span>
                <span className="text-base font-extrabold text-white leading-none mt-0.5">
                  ELECTORAL
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-medium">
              {NAV_LINKS.map((link) => (
                <a key={link.id} href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </div>

            <span className="text-[11px] text-zinc-500 font-mono">
              Control Electoral — Versión Institucional 2026
            </span>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
            <p>© 2026 Plataforma Electoral. Todos los derechos reservados.</p>
            <p className="tabular-nums">Seguridad basada en roles (RBAC) • Cero rastros comerciales</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
