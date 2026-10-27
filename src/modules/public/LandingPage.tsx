import Lenis from 'lenis';
import React, { useState, useEffect } from 'react';
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

// Keynote Stagger Container & Items
const keynoteContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const keynoteItem: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

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
    bgLight: 'bg-amber-500/10 border-amber-500/25',
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
    bgLight: 'bg-emerald-500/10 border-emerald-500/25',
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
    bgLight: 'bg-rose-500/10 border-rose-500/25',
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
    bgLight: 'bg-blue-500/10 border-blue-500/25',
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
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
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
      <header
        className={`fixed top-0 inset-x-0 z-50 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'bg-[#060913]/75 backdrop-blur-2xl backdrop-saturate-[180%] border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Logo Institucional con Tap Magnético */}
          <motion.a
            href="#inicio"
            whileTap={{ scale: 0.96 }}
            transition={appleSpring}
            onClick={() => setActiveNav('inicio')}
            className="flex items-center gap-3 min-w-0 group cursor-pointer focus-visible:outline-none"
          >
            <div className="h-10 w-10 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] flex items-center justify-center text-blue-400 shrink-0 group-hover:border-blue-500/40 transition-colors">
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

          {/* Navegación Desktop con indicador deslizante Apple Spring (layoutId="apple-nav-pill") */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeNav === link.id;
              return (
                <motion.a
                  key={link.id}
                  href={link.href} onClick={(e) => { e.preventDefault(); setActiveNav(link.id); const target = document.querySelector(link.href); if (target) target.scrollIntoView({ behavior: 'smooth' }); }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-150 select-none ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="apple-nav-pill"
                      transition={appleSpring}
                      className="absolute inset-0 rounded-full bg-blue-600 shadow-[0_0_16px_rgba(37,99,235,0.5)] -z-10"
                    />
                  )}
                  {link.label}
                </motion.a>
              );
            })}
          </nav>

          {/* CTA Desktop con Física Háptica Apple */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              type="button"
              onClick={onNavigateToLogin}
              whileHover="hover"
              whileTap={{ scale: 0.96 }}
              transition={appleSpring}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer focus-visible:outline-none will-change-transform"
            >
              <span>Acceder a la plataforma</span>
              <motion.span
                variants={{
                  hover: { x: 4 },
                }}
                transition={appleSpring}
                className="inline-block"
              >
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </motion.span>
            </motion.button>
          </div>

          {/* Botón de Menú Móvil / Tablet */}
          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToLogin}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold sm:hidden active:scale-[0.98]"
            >
              Acceder
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-xl text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Drawer Móvil y Tablet */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={appleSpring}
              className="lg:hidden border-t border-white/[0.08] bg-[#0A0F1D]/95 backdrop-blur-2xl px-4 py-4 overflow-hidden"
            >
              <nav className="flex flex-col gap-1.5 text-sm font-semibold">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => {
                      setActiveNav(link.id);
                      setMobileMenuOpen(false);
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
                    onNavigateToLogin();
                  }}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30"
                >
                  <span>Acceder a la plataforma</span>
                  <ArrowRight className="w-4 h-4" />
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
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 will-change-transform"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Columna Izquierda: Información Principal con Blur-Fade Stagger */}
            <motion.div
              variants={keynoteContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
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
          {/* Encabezado Keynote */}
          <motion.div
            variants={keynoteContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
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
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold tabular-nums shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                32 Departamentos Activos
              </span>
            </motion.div>
          </motion.div>

          {/* Bento Grid Principal Asimétrico con Shared Layout Animations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda (5/12): 4 Selectores Bento con Micro-Zoom Apple */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {CORPORATIONS.map((corp) => {
                const isSelected = selectedCorpId === corp.id;
                const IconComponent = corp.icon;

                return (
                  <motion.button
                    key={corp.id}
                    layoutId={`corp-button-${corp.id}`}
                    type="button"
                    onClick={() => setSelectedCorpId(corp.id)}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    transition={appleSpring}
                    className={`group w-full p-4 rounded-2xl text-left cursor-pointer border relative backdrop-blur-2xl will-change-transform ${
                      isSelected
                        ? 'bg-white/[0.08] border-blue-500/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_32px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/40'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover:scale-105 ${corp.bgLight} ${corp.color}`}
                        >
                          <IconComponent className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                            <span>{corp.name}</span>
                            {isSelected && (
                              <motion.span
                                layoutId="active-dot"
                                transition={appleSpring}
                                className="w-1.5 h-1.5 rounded-full bg-blue-400"
                              />
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                            {corp.scope}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/[0.05] text-zinc-300 border border-white/[0.08] tabular-nums">
                          {corp.tag}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-zinc-500 transition-transform duration-150 ease-out ${
                            isSelected ? 'text-blue-400 translate-x-1' : 'group-hover:translate-x-1 group-hover:text-zinc-300'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Columna Derecha (7/12): Visor Detallado con Transición de Resorte Apple */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCorp.id}
                  initial={{ opacity: 0, scale: 0.96, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                  transition={appleSpring}
                  className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_16px_40px_rgba(0,0,0,0.4)] text-left will-change-transform"
                >
                  {/* Cabecera del Panel */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${selectedCorp.bgLight} ${selectedCorp.color}`}>
                        <selectedCorp.icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                          {selectedCorp.scope}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {selectedCorp.name}
                        </h3>
                      </div>
                    </div>

                    <span className="self-start sm:self-center px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-semibold tabular-nums shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                      {selectedCorp.tag}
                    </span>
                  </div>

                  {/* Resumen */}
                  <p className="text-sm text-zinc-300 leading-relaxed mt-5">
                    {selectedCorp.summary}
                  </p>

                  {/* Grid de 4 Métricas Técnicas con Animación Suave */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                    {selectedCorp.metrics.map((m) => (
                      <motion.div
                        key={m.label}
                        whileHover={{ scale: 1.02 }}
                        transition={appleSoftSpring}
                        className="p-3.5 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] cursor-default will-change-transform"
                      >
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block tracking-wider">
                          {m.label}
                        </span>
                        <span className="text-base sm:text-lg font-bold font-mono text-white tabular-nums mt-1 block">
                          {m.numValue ? (
                            <AnimatedCounter value={m.numValue} />
                          ) : (
                            m.value
                          )}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Competencias Electorales */}
                  <div className="mt-6 pt-5 border-t border-white/[0.08]">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-3">
                      Competencias y Alcance Operativo:
                    </span>
                    <ul className="space-y-2">
                      {selectedCorp.responsibilities.map((r, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, ...appleSpring }}
                          className="flex items-start gap-2.5 text-xs text-zinc-300"
                        >
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Botón de Acción Directa con Flecha Magnética */}
                  <div className="mt-7 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-zinc-400">
                      Gestione votantes, testigos y padrón para esta corporación:
                    </span>
                    <motion.button
                      type="button"
                      whileHover="hover"
                      whileTap={{ scale: 0.96 }}
                      transition={appleSpring}
                      onClick={onNavigateToLogin}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/35 cursor-pointer border border-blue-400/30 will-change-transform"
                    >
                      <span>Ingresar con esta corporación</span>
                      <motion.span
                        variants={{
                          hover: { x: 4 },
                        }}
                        transition={appleSpring}
                        className="inline-block"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. SECCIÓN DE ACCESO RESTRINGIDO
            ========================================================================= */}
        <section id="seguridad" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-white/[0.08]">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={appleSpring}
            className="p-8 sm:p-12 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_50px_rgba(0,0,0,0.45)] will-change-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center mb-5">
              <Shield className="w-6 h-6" strokeWidth={2} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Acceso Institucional Restringido
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto mt-3">
              Esta plataforma es de uso exclusivo para equipos electorales registrados. Ingrese con sus credenciales autorizadas para acceder a los módulos de su corporación.
            </p>
            <div className="mt-6 flex justify-center">
              <motion.button
                type="button"
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                transition={appleSpring}
                onClick={onNavigateToLogin}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-wide transition-colors shadow-xl shadow-blue-600/35 cursor-pointer flex items-center gap-2 border border-blue-400/30 will-change-transform"
              >
                <span>Acceder a la plataforma</span>
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
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            6. SECCIÓN PREGUNTAS FRECUENTES
            ========================================================================= */}
        <section id="contacto" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08] text-left">
          <div className="text-center mb-8 space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              RESOLUCIÓN DE DUDAS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Preguntas Frecuentes
            </h3>
          </div>

          <div className="space-y-3">
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
                className="rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
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
          </div>
        </section>
      </main>

      {/* =========================================================================
          7. FOOTER TÉCNICO SOBRIO
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
