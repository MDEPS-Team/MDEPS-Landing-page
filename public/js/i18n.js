/**
 * Internacionalización EN/ES de Vantage PMO.
 *
 * Diccionarios en línea (sin fetch: funciona igual en file:// y en GitHub Pages).
 * Atributos soportados:
 *   data-i18n             → textContent (o content en <meta>)
 *   data-i18n-placeholder → placeholder
 *   data-i18n-aria        → aria-label
 *   data-i18n-alt         → alt
 * Emite el evento `i18n:change` en document para los textos dinámicos.
 *
 * @module i18n
 */
(function () {
  'use strict';

  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'es'];
  var STORAGE_KEY = 'vantage-pmo-lang';
  var current = DEFAULT_LANG;

  var DICT = {
    en: {
      meta: {
        title: 'Vantage PMO – Centralize your projects',
        description: 'Vantage PMO brings clarity to every project. Real-time visibility, standardized processes, and the intelligence you need to lead.'
      },
      nav: {
        skip: 'Skip to content', platform: 'Platform', assistant: 'AI assistant', pricing: 'Pricing', team: 'Team',
        login: 'Log in', cta: 'Start now', langLabel: 'Cambiar a español', langNext: 'ES',
        themeToLight: 'Switch to light theme', themeToDark: 'Switch to dark theme',
        menuOpen: 'Open menu', menuClose: 'Close menu'
      },
      hero: {
        heading: 'Centralize your projects, control your future.',
        subheading: 'Vantage PMO brings clarity to every project. Real-time visibility, standardized processes, and the intelligence you need to lead.',
        cta_primary: 'Start now', cta_secondary: 'See the platform',
        orreryLabel: 'Sample portfolio in 3D. Drag or use the arrow keys to rotate it.',
        legendIntro: 'Choose a project to inspect it:', keyLabel: 'Status key',
        note: 'Sample portfolio. Each orbit is a project: the bright arc is its progress, the light is its health.',
        readout: {
          title: 'Portfolio', projects: '{n} projects',
          summary: '{ok} on track · {warn} at risk · {bad} delayed',
          detail: '{progress}% complete · due {due}'
        }
      },
      state: { ok: 'On track', warn: 'At risk', bad: 'Delayed', high: 'High', medium: 'Medium', low: 'Low' },
      pillars: {
        heading: 'Three pillars of management',
        subheading: 'Everything you need to run projects well',
        card1: { label: 'Control', title: 'One place for all', text: 'Stop chasing project data across systems.', cta: 'Explore the platform' },
        card2: { label: 'Visibility', title: 'See what matters now', text: 'Know your status in real time.', cta: 'See the portfolio view' },
        card3: { label: 'Clarity', title: 'Make decisions that move projects forward', text: 'Replace daily guesswork with answers you can trust.', cta: 'Meet the assistant' }
      },
      products: {
        heading: 'One platform, every need',
        subheading: 'Each module solves a specific challenge, and together they power seamless project operations.',
        turn: 'How it works', turnBack: 'Back to overview', cta: 'Get started',
        prev: 'Previous module', next: 'Next module', count: '{i} of {n}',
        card1: { tag: 'Projects', heading: 'AI-driven planning, execution & delivery', text: 'Drive projects and processes forward at scale, with intelligence that executes, builds, and automates for you.' },
        card2: { tag: 'Portfolio', heading: 'Portfolio visibility that gives you control', text: 'See every project at once. Track health, risk, and progress from a single command center.' },
        card3: { tag: 'Analytics', heading: 'Data-first decisions that deliver results', text: 'Turn raw project data into leadership intelligence. Forecast better, act faster.' },
        card4: { tag: 'Automation', heading: 'Automate the work no one wants to do', text: 'From reminders to reports, let smart automation handle the repetitive tasks so your team can focus on what matters.' },
        card5: { tag: 'Resources', heading: 'Right people on the right projects', text: 'Track capacity, allocate resources intelligently, and prevent burnout before it starts.' },
        card6: { tag: 'Reporting', heading: 'Reports that actually get read', text: 'Auto-generated stakeholder reports with the metrics that matter, delivered on your schedule.' },
        card7: { tag: 'Integrations', heading: 'Connect every tool your team already uses', text: 'Native integrations with Jira, Slack, Teams, and 40+ tools. One source of truth, zero friction.' }
      },
      features: {
        sectionTitle: 'What changes with Vantage PMO',
        f1: { title: 'What changes when you take control', text: 'Projects move faster. Teams understand what matters. Leaders make better calls.' },
        f2: { title: 'Projects finish on time, teams stay aligned', text: 'Delays disappear when everyone sees the same picture. Vantage PMO cuts through the noise so your teams move together, not in circles.' },
        f3: { title: 'Communication that actually works', text: "No more waiting for status updates or hunting down information. Your teams know what's expected, and leaders know what's happening, right now." },
        f4: { title: 'Decisions built on facts, not feelings', text: 'Real data replaces guesswork. Your leadership team makes smarter calls, backed by the numbers, not just experience.' }
      },
      ai: {
        heading: 'Your smart project assistant',
        subheading: 'Ask anything. Get answers backed by your real project data.',
        promptsLabel: 'Example questions',
        prompt1: 'Create a project plan', prompt2: 'Summarize project status', prompt3: 'Identify at-risk tasks',
        prompt4: 'Generate a stakeholder report', prompt5: 'Forecast delivery date',
        pause: 'Pause the tour', play: 'Resume the tour',
        input: 'Ask Vantage AI…', inputLabel: 'Ask Vantage AI', send: 'Send',
        th: { project: 'Project', progress: 'Progress', health: 'Health', task: 'Task', due: 'Due', risk: 'Risk' },
        p0: {
          title: 'New project plan', objective: 'Objective', objectiveValue: 'Launch the client portal by Q3',
          milestones: 'Milestones', w1: 'Week 1', w3: 'Week 3', w6: 'Week 6',
          m1: 'Scope & kickoff', m2: 'Design approved', m3: 'Release to clients', team: 'Team',
          answer: "I've drafted a 6-week project plan with 3 milestones, assigned to 6 team members. Review and adjust before publishing."
        },
        p1: { title: 'Project portfolio', answer: '2 of 4 projects are on track. Beta Rollout is delayed at 42% progress and CRM Update is at risk. I recommend reviewing Beta Rollout first.' },
        p2: { title: 'At-risk tasks', answer: 'Found 2 high-risk tasks: API Integration (Apr 28) and QA Testing (May 5). Both are behind their planned progress.' },
        p3: { title: 'Stakeholder report · Q2', k1: 'Active projects', k2: 'On schedule', k3: 'At risk', answer: 'Q2 report generated: 12 active projects, 87% on schedule, 3 flagged at risk. Ready to export as PDF.' },
        p4: { title: 'Delivery forecast', answer: 'Beta Rollout is likely to miss its target. Based on current velocity, delivery is projected for Jun 3, 12 days late.' }
      },
      about: {
        heading: 'Built by engineers who understand projects',
        text: 'Vantage PMO started with software engineers who saw the same problem everywhere: projects failed not from lack of skills, but from lack of clarity. We built Vantage PMO to fix that.',
        cta: 'Meet the team', imgAlt: 'The Vantage PMO team working together'
      },
      onboarding: {
        heading: 'Getting started takes minutes, not months',
        subheading: 'Set up your workspace and bring your projects in. Vantage PMO handles the rest.',
        step1: { title: 'Connect your projects to the platform', text: 'Import anything or start fresh. Onboard your teams with standardized templates.' },
        step2: { title: 'Watch your portfolio come into focus', text: 'See the status everywhere you need it: projects, tasks, plans.' },
        step3: { title: 'Lead with confidence and data', text: 'Make decisions backed by intelligence, not habit.' },
        cta: 'Create your workspace'
      },
      testimonials: {
        heading: 'Real voices', subheading: 'What project leaders say about Vantage PMO',
        t1: { quote: 'We stopped losing track of deadlines the moment we switched. Now I sleep better.', name: 'Maria Rodriguez', role: 'Team Lead' },
        t2: { quote: 'Visibility across all our projects went from chaotic to crystal clear in one week.', name: 'James Carter', role: 'PMO Director' }
      },
      pricing: {
        heading: 'Choose your plan', subheading: 'No long-term contracts. Upgrade or cancel anytime.',
        period: 'per month', cta: 'Get started', notIncluded: 'Not included:',
        basic: {
          name: 'Basic', description: 'For small teams that want to standardize how they run projects.',
          f1: 'Up to 10 active projects', f2: 'Real-time project dashboards', f3: 'Standardized project templates',
          f4: 'Status reports', f5: 'Email support', x1: 'AI assistant', x2: 'Integrations'
        },
        business: {
          name: 'Business', badge: 'Built for multi-team PMOs', description: 'For PMOs running a portfolio of projects across several teams.',
          f1: 'Everything in Basic', f2: 'Unlimited projects', f3: 'Portfolio health and risk view',
          f4: 'AI project assistant', f5: 'Automated stakeholder reports', f6: 'Jira, Slack and Teams integrations'
        },
        enterprise: {
          name: 'Enterprise', cta: 'Contact sales', description: 'For organizations with several PMOs and large portfolios.',
          f1: 'Everything in Business', f2: 'Resource capacity planning', f3: 'Delivery forecasting',
          f4: 'Single sign-on and roles', f5: 'Guaranteed SLA', f6: 'Dedicated account manager'
        }
      },
      blog: {
        heading: "Stay ahead of what's next",
        subheading: 'Get insights on project management, leadership, and building better teams.',
        cta: 'Subscribe',
        post1: { category: 'Leadership', title: 'Why your PMO framework is slowing you down', excerpt: 'Most project offices were built for compliance, not speed.' },
        post2: { category: 'Teams', title: 'The real cost of misaligned teams', excerpt: "Misalignment isn't just frustrating: it shows up in your timelines." },
        post3: { category: 'Data', title: 'Data-driven decisions in project management', excerpt: 'Moving from gut feelings to intelligence-backed choices changes everything.' }
      },
      team: {
        heading: 'Meet the team', subheading: 'Software engineers building Vantage PMO.',
        member1: { role: 'CTO', bio: 'Backend developer with a passion for building scalable and efficient systems.' },
        member2: { role: 'Head of Product', bio: 'Designer passionate about creating intuitive and engaging user experiences.' },
        member3: { role: 'Engineering Manager', bio: 'Frontend developer with experience designing architecture diagrams.' },
        member4: { role: 'Engineering Manager', bio: 'Full-stack developer who solves problems and designs intuitive interfaces.' },
        member5: { role: 'Engineering Manager', bio: 'Expert backend developer in building robust and scalable systems.' }
      },
      cta: {
        heading: 'See your whole portfolio from one vantage point.',
        text: 'Create your workspace, bring your projects in, and know where every one of them stands today.',
        login: 'I already have an account'
      },
      footer: {
        tagline: 'Clarity for every project, from one vantage point.',
        col1: 'Product', col2: 'Company', col3: 'Account',
        insights: 'Insights', about: 'Our story', signup: 'Create an account',
        copyright: '© 2026 Vantage PMO. All rights reserved.'
      },
      register: {
        title: 'Vantage PMO – Create your account',
        back: 'Back to home', heading: 'Create your account',
        lead: 'Start organizing your portfolio in minutes. No credit card required to try it.',
        name: 'Full name', email: 'Work email', password: 'Password',
        passwordHint: 'At least 8 characters.', submit: 'Create account',
        haveAccount: 'Already have an account?', login: 'Log in',
        planLabel: 'Selected plan:',
        errName: 'Enter your full name.', errEmail: 'Enter a valid email, like name@company.com.',
        errPassword: 'Use at least 8 characters.',
      }
    },

    es: {
      meta: {
        title: 'Vantage PMO – Centraliza tus proyectos',
        description: 'Vantage PMO aporta claridad a cada proyecto. Visibilidad en tiempo real, procesos estandarizados y la inteligencia que necesitas para liderar.'
      },
      nav: {
        skip: 'Saltar al contenido', platform: 'Plataforma', assistant: 'Asistente IA', pricing: 'Precios', team: 'Equipo',
        login: 'Iniciar sesión', cta: 'Empieza ahora', langLabel: 'Switch to English', langNext: 'EN',
        themeToLight: 'Cambiar a tema claro', themeToDark: 'Cambiar a tema oscuro',
        menuOpen: 'Abrir menú', menuClose: 'Cerrar menú'
      },
      hero: {
        heading: 'Centraliza tus proyectos, controla tu futuro.',
        subheading: 'Vantage PMO aporta claridad a cada proyecto. Visibilidad en tiempo real, procesos estandarizados y la inteligencia que necesitas para liderar.',
        cta_primary: 'Empieza ahora', cta_secondary: 'Ver la plataforma',
        orreryLabel: 'Portafolio de ejemplo en 3D. Arrástralo o usa las flechas del teclado para girarlo.',
        legendIntro: 'Elige un proyecto para inspeccionarlo:', keyLabel: 'Leyenda de estados',
        note: 'Portafolio de ejemplo. Cada órbita es un proyecto: el arco brillante es su avance y la luz, su salud.',
        readout: {
          title: 'Portafolio', projects: '{n} proyectos',
          summary: '{ok} a tiempo · {warn} en riesgo · {bad} retrasado',
          detail: '{progress}% completado · entrega {due}'
        }
      },
      state: { ok: 'A tiempo', warn: 'En riesgo', bad: 'Retrasado', high: 'Alto', medium: 'Medio', low: 'Bajo' },
      pillars: {
        heading: 'Tres pilares de la gestión',
        subheading: 'Todo lo que necesitas para gestionar bien tus proyectos',
        card1: { label: 'Control', title: 'Un solo lugar para todo', text: 'Deja de perseguir datos de proyectos entre sistemas.', cta: 'Explorar la plataforma' },
        card2: { label: 'Visibilidad', title: 'Mira lo que importa ahora', text: 'Conoce tu estado en tiempo real.', cta: 'Ver el portafolio' },
        card3: { label: 'Claridad', title: 'Toma decisiones que impulsan tus proyectos', text: 'Cambia las suposiciones diarias por respuestas en las que puedes confiar.', cta: 'Conocer el asistente' }
      },
      products: {
        heading: 'Una plataforma, todas las necesidades',
        subheading: 'Cada módulo resuelve un reto específico y, juntos, impulsan una operación de proyectos sin fricciones.',
        turn: 'Cómo funciona', turnBack: 'Volver al resumen', cta: 'Empezar',
        prev: 'Módulo anterior', next: 'Módulo siguiente', count: '{i} de {n}',
        card1: { tag: 'Proyectos', heading: 'Planificación, ejecución y entrega con IA', text: 'Impulsa proyectos y procesos a escala, con inteligencia que ejecuta, construye y automatiza por ti.' },
        card2: { tag: 'Portafolio', heading: 'Visibilidad del portafolio que te da el control', text: 'Ve todos tus proyectos a la vez. Sigue salud, riesgo y avance desde un solo centro de mando.' },
        card3: { tag: 'Analítica', heading: 'Decisiones basadas en datos que dan resultados', text: 'Convierte datos de proyectos en inteligencia para liderar. Pronostica mejor, actúa más rápido.' },
        card4: { tag: 'Automatización', heading: 'Automatiza el trabajo que nadie quiere hacer', text: 'De recordatorios a reportes: deja que la automatización se encargue de lo repetitivo para que tu equipo se enfoque en lo importante.' },
        card5: { tag: 'Recursos', heading: 'Las personas correctas en los proyectos correctos', text: 'Controla la capacidad, asigna recursos con inteligencia y evita el agotamiento antes de que empiece.' },
        card6: { tag: 'Reportes', heading: 'Reportes que sí se leen', text: 'Reportes automáticos para stakeholders con las métricas que importan, entregados cuando los necesitas.' },
        card7: { tag: 'Integraciones', heading: 'Conecta las herramientas que tu equipo ya usa', text: 'Integraciones nativas con Jira, Slack, Teams y más de 40 herramientas. Una sola fuente de verdad, cero fricción.' }
      },
      features: {
        sectionTitle: 'Qué cambia con Vantage PMO',
        f1: { title: 'Qué cambia cuando tomas el control', text: 'Los proyectos avanzan más rápido. Los equipos entienden qué importa. Los líderes deciden mejor.' },
        f2: { title: 'Proyectos a tiempo, equipos alineados', text: 'Los retrasos desaparecen cuando todos ven el mismo panorama. Vantage PMO elimina el ruido para que tus equipos avancen juntos, no en círculos.' },
        f3: { title: 'Comunicación que realmente funciona', text: 'Se acabó esperar actualizaciones o buscar información. Tus equipos saben qué se espera y los líderes saben qué pasa, ahora mismo.' },
        f4: { title: 'Decisiones basadas en hechos, no en intuiciones', text: 'Los datos reales reemplazan las suposiciones. Tu equipo directivo decide mejor, respaldado por los números y no solo por la experiencia.' }
      },
      ai: {
        heading: 'Tu asistente inteligente de proyectos',
        subheading: 'Pregunta lo que quieras. Obtén respuestas basadas en los datos reales de tus proyectos.',
        promptsLabel: 'Preguntas de ejemplo',
        prompt1: 'Crear un plan de proyecto', prompt2: 'Resumir el estado de los proyectos', prompt3: 'Identificar tareas en riesgo',
        prompt4: 'Generar un reporte para stakeholders', prompt5: 'Pronosticar la fecha de entrega',
        pause: 'Pausar el recorrido', play: 'Reanudar el recorrido',
        input: 'Pregúntale a Vantage AI…', inputLabel: 'Pregúntale a Vantage AI', send: 'Enviar',
        th: { project: 'Proyecto', progress: 'Avance', health: 'Salud', task: 'Tarea', due: 'Entrega', risk: 'Riesgo' },
        p0: {
          title: 'Nuevo plan de proyecto', objective: 'Objetivo', objectiveValue: 'Lanzar el portal de clientes en el Q3',
          milestones: 'Hitos', w1: 'Semana 1', w3: 'Semana 3', w6: 'Semana 6',
          m1: 'Alcance y arranque', m2: 'Diseño aprobado', m3: 'Lanzamiento a clientes', team: 'Equipo',
          answer: 'Preparé un plan de 6 semanas con 3 hitos, asignado a 6 personas del equipo. Revísalo y ajústalo antes de publicarlo.'
        },
        p1: { title: 'Portafolio de proyectos', answer: '2 de 4 proyectos van a tiempo. Beta Rollout va retrasado con un 42% de avance y CRM Update está en riesgo. Recomiendo revisar primero Beta Rollout.' },
        p2: { title: 'Tareas en riesgo', answer: 'Encontré 2 tareas de riesgo alto: API Integration (28 abr) y QA Testing (5 may). Ambas van por detrás del avance previsto.' },
        p3: { title: 'Reporte para stakeholders · Q2', k1: 'Proyectos activos', k2: 'En plazo', k3: 'En riesgo', answer: 'Reporte del Q2 generado: 12 proyectos activos, 87% en plazo y 3 marcados en riesgo. Listo para exportar en PDF.' },
        p4: { title: 'Pronóstico de entrega', answer: 'Es probable que Beta Rollout no cumpla su fecha. Con la velocidad actual, la entrega se proyecta para el 3 de junio, 12 días tarde.' }
      },
      about: {
        heading: 'Creado por ingenieros que entienden los proyectos',
        text: 'Vantage PMO nació de ingenieros de software que veían el mismo problema en todas partes: los proyectos no fallaban por falta de talento, sino por falta de claridad. Creamos Vantage PMO para resolverlo.',
        cta: 'Conoce al equipo', imgAlt: 'El equipo de Vantage PMO trabajando juntos'
      },
      onboarding: {
        heading: 'Empezar toma minutos, no meses',
        subheading: 'Configura tu espacio de trabajo y trae tus proyectos. Vantage PMO se encarga del resto.',
        step1: { title: 'Conecta tus proyectos a la plataforma', text: 'Importa lo que tengas o empieza de cero. Incorpora a tus equipos con plantillas estandarizadas.' },
        step2: { title: 'Mira cómo tu portafolio toma forma', text: 'Ve el estado donde lo necesites: proyectos, tareas y planes.' },
        step3: { title: 'Lidera con confianza y datos', text: 'Toma decisiones respaldadas por inteligencia, no por costumbre.' },
        cta: 'Crea tu espacio de trabajo'
      },
      testimonials: {
        heading: 'Voces reales', subheading: 'Lo que dicen los líderes de proyecto sobre Vantage PMO',
        t1: { quote: 'Dejamos de perder plazos desde el momento en que cambiamos. Ahora duermo mejor.', name: 'Maria Rodriguez', role: 'Líder de equipo' },
        t2: { quote: 'La visibilidad de todos nuestros proyectos pasó del caos a la claridad total en una semana.', name: 'James Carter', role: 'Director de PMO' }
      },
      pricing: {
        heading: 'Elige tu plan', subheading: 'Sin contratos a largo plazo. Cambia de plan o cancela cuando quieras.',
        period: 'al mes', cta: 'Empezar', notIncluded: 'No incluido:',
        basic: {
          name: 'Básico', description: 'Para equipos pequeños que quieren estandarizar cómo gestionan sus proyectos.',
          f1: 'Hasta 10 proyectos activos', f2: 'Paneles de proyecto en tiempo real', f3: 'Plantillas de proyecto estandarizadas',
          f4: 'Reportes de estado', f5: 'Soporte por correo', x1: 'Asistente IA', x2: 'Integraciones'
        },
        business: {
          name: 'Business', badge: 'Pensado para PMO con varios equipos', description: 'Para PMO que gestionan un portafolio de proyectos con varios equipos.',
          f1: 'Todo lo del plan Básico', f2: 'Proyectos ilimitados', f3: 'Vista de salud y riesgo del portafolio',
          f4: 'Asistente IA de proyectos', f5: 'Reportes automáticos para stakeholders', f6: 'Integraciones con Jira, Slack y Teams'
        },
        enterprise: {
          name: 'Enterprise', cta: 'Hablar con ventas', description: 'Para organizaciones con varias PMO y portafolios grandes.',
          f1: 'Todo lo del plan Business', f2: 'Planificación de capacidad de recursos', f3: 'Pronóstico de entregas',
          f4: 'Inicio de sesión único y roles', f5: 'SLA garantizado', f6: 'Gestor de cuenta dedicado'
        }
      },
      blog: {
        heading: 'Adelántate a lo que viene',
        subheading: 'Recibe ideas sobre gestión de proyectos, liderazgo y cómo construir mejores equipos.',
        cta: 'Suscribirme',
        post1: { category: 'Liderazgo', title: 'Por qué tu marco de PMO te está frenando', excerpt: 'La mayoría de las oficinas de proyectos se crearon para cumplir normas, no para ir rápido.' },
        post2: { category: 'Equipos', title: 'El costo real de los equipos desalineados', excerpt: 'La desalineación no solo frustra: se nota en tus plazos.' },
        post3: { category: 'Datos', title: 'Decisiones basadas en datos en la gestión de proyectos', excerpt: 'Pasar de la intuición a decisiones respaldadas por datos lo cambia todo.' }
      },
      team: {
        heading: 'Conoce al equipo', subheading: 'Ingenieros de software que construyen Vantage PMO.',
        member1: { role: 'CTO', bio: 'Desarrollador backend apasionado por construir sistemas escalables y eficientes.' },
        member2: { role: 'Jefa de Producto', bio: 'Diseñadora apasionada por crear experiencias intuitivas y atractivas.' },
        member3: { role: 'Engineering Manager', bio: 'Desarrollador frontend con experiencia en diagramas de arquitectura.' },
        member4: { role: 'Engineering Manager', bio: 'Desarrollador full-stack que resuelve problemas y diseña interfaces intuitivas.' },
        member5: { role: 'Engineering Manager', bio: 'Desarrollador backend experto en sistemas robustos y escalables.' }
      },
      cta: {
        heading: 'Ve todo tu portafolio desde un solo punto de vista.',
        text: 'Crea tu espacio de trabajo, trae tus proyectos y sabe hoy mismo en qué punto está cada uno.',
        login: 'Ya tengo una cuenta'
      },
      footer: {
        tagline: 'Claridad para cada proyecto, desde un solo punto de vista.',
        col1: 'Producto', col2: 'Empresa', col3: 'Cuenta',
        insights: 'Artículos', about: 'Nuestra historia', signup: 'Crear una cuenta',
        copyright: '© 2026 Vantage PMO. Todos los derechos reservados.'
      },
      register: {
        title: 'Vantage PMO – Crea tu cuenta',
        back: 'Volver al inicio', heading: 'Crea tu cuenta',
        lead: 'Empieza a ordenar tu portafolio en minutos. No necesitas tarjeta para probarlo.',
        name: 'Nombre completo', email: 'Correo de trabajo', password: 'Contraseña',
        passwordHint: 'Mínimo 8 caracteres.', submit: 'Crear cuenta',
        haveAccount: '¿Ya tienes una cuenta?', login: 'Inicia sesión',
        planLabel: 'Plan elegido:',
        errName: 'Escribe tu nombre completo.', errEmail: 'Escribe un correo válido, como nombre@empresa.com.',
        errPassword: 'Usa al menos 8 caracteres.',
      }
    }
  };

  function resolve(obj, key) {
    return key.split('.').reduce(function (acc, part) { return acc != null ? acc[part] : undefined; }, obj);
  }

  /** Traduce una clave e interpola {variables}. */
  function t(key, vars) {
    var v = resolve(DICT[current], key);
    if (v === undefined) v = resolve(DICT[DEFAULT_LANG], key);
    if (typeof v !== 'string') return key;
    if (vars) v = v.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return v;
  }

  function apply() {
    var d = DICT[current];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = resolve(d, el.getAttribute('data-i18n'));
      if (typeof v !== 'string') return;
      if (el.tagName === 'META') el.setAttribute('content', v);
      else el.textContent = v;
    });
    [['data-i18n-placeholder', 'placeholder'], ['data-i18n-aria', 'aria-label'], ['data-i18n-alt', 'alt']].forEach(function (pair) {
      document.querySelectorAll('[' + pair[0] + ']').forEach(function (el) {
        var v = resolve(d, el.getAttribute(pair[0]));
        if (typeof v === 'string') el.setAttribute(pair[1], v);
      });
    });
    document.documentElement.lang = current;

    var btn = document.getElementById('langSwitcher');
    var txt = document.getElementById('langText');
    if (txt) txt.textContent = t('nav.langNext');
    if (btn) btn.setAttribute('aria-label', t('nav.langLabel'));

    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: current } }));
  }

  function setLanguage(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply();
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var browser = (navigator.language || '').slice(0, 2);
    current = saved || (SUPPORTED.indexOf(browser) !== -1 ? browser : DEFAULT_LANG);

    var btn = document.getElementById('langSwitcher');
    if (btn) btn.addEventListener('click', function () { setLanguage(current === 'en' ? 'es' : 'en'); });
    apply();
  }

  window.i18n = { t: t, setLanguage: setLanguage, getCurrentLang: function () { return current; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
