/**
 * Internationalization module for Vantage PMO website.
 *
 * Manages language switching, translation loading, and DOM updates
 * for English and Spanish content.
 *
 * @module i18n
 * @author Vantage PMO Development Team
 * @version 1.0.0
 * @license © 2026 Vantage PMO. All rights reserved.
 */

const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'es'];
const STORAGE_KEY = 'vantage-pmo-lang';

// Capturar base al momento del parseo (document.currentScript es null dentro de funciones)
var _scriptBase = (function () {
  var s = document.currentScript;
  if (s) {
    return s.src.replace(/\/js\/[^/]+$/, '');
  }
  return window.location.pathname.replace(/\/[^/]*$/, '');
}());

let currentLang = DEFAULT_LANG;

const INLINE_TRANSLATIONS = {
  en: {
    "meta": {
      "title": "Vantage PMO – Centralize your projects",
      "description": "Vantage PMO brings clarity to every project. Real-time visibility, standardized processes, and the intelligence you need to lead."
    },
    "nav": {
      "home": "Home",
      "context": "Context",
      "platform": "Platform",
      "testimonials": "Testimonials",
      "blog": "Blog",
      "team": "Team",
      "resources": "Resources",
      "login": "Login",
      "cta": "Try it"
    },
    "hero": {
      "heading": "Centralize your projects, control your future.",
      "subheading": "Vantage PMO brings clarity to every project. Real-time visibility, standardized processes, and the intelligence you need to lead.",
      "cta_primary": "Start now",
      "cta_secondary": "Learn more"
    },
    "pillars": {
      "label": "Context",
      "heading": "Three pillars of management",
      "subheading": "Everything you need to run projects well",
      "card1": {
        "label": "Control",
        "title": "One place for all",
        "text": "Stop drifting across systems for project data.",
        "cta": "Explore"
      },
      "card2": {
        "label": "Visibility",
        "title": "See what matters now",
        "text": "Know your status in real time.",
        "cta": "Explore"
      },
      "card3": {
        "label": "Clarity",
        "title": "Make decisions that move projects forward",
        "text": "Stop guesses you cannot believe every day.",
        "cta": "Explore"
      }
    },
    "features": {
      "f1": {
        "label": "Results",
        "title": "What changes when you take control",
        "text": "Projects move faster. Teams understand what matters. Leaders make better calls.",
        "cta1": "Discover",
        "cta2": "Learn"
      },
      "f2": {
        "label": "Aligned",
        "title": "Projects finish on time, teams stay aligned",
        "text": "Delays disappear when everyone sees the same picture. Vantage PMO cuts through the noise so your teams move together, not in circles.",
        "cta1": "Learn"
      },
      "f3": {
        "label": "Clarity",
        "title": "Communication that actually works",
        "text": "No more waiting for status updates or hunting down information. Your teams know what's expected, and leaders know what's happening, right now.",
        "cta1": "Learn"
      },
      "f4": {
        "label": "Confidence",
        "title": "Decisions built on facts, not feelings",
        "text": "Raw data replaces guesswork. Your leadership team makes smarter calls, backed by the numbers, not just experience.",
        "cta1": "Explore",
        "cta2": "Learn"
      }
    },
    "about": {
      "label": "Progress",
      "heading": "Built by engineers who understand projects",
      "text": "MEPB started as OPC, where software engineers saw the same problem everywhere: Projects failed not from lack of skills, but from lack of clarity. We built Vantage PMO to fix that.",
      "cta1": "About us",
      "cta2": "Learn"
    },
    "onboarding": {
      "heading": "Getting started takes minutes, not months",
      "subheading": "Set up your workspace and bring your projects in. Vantage PMO handles the rest.",
      "step1": {
        "title": "Connect your projects to the platform",
        "text": "Import anything. Start fresh. Onboard your teams with standardized templates.",
        "cta": "Start now"
      },
      "step2": {
        "title": "Watch your portfolio come into focus",
        "text": "See the status everywhere you need it. Projects. Todos. Plans.",
        "cta": "Start now"
      },
      "step3": {
        "title": "Lead with confidence and data",
        "text": "Make decisions backed by intelligence, not just a habit.",
        "cta": "Start now"
      }
    },
    "pricing": {
      "label": "Pricing",
      "heading": "Choose your plan",
      "subheading": "No long-term contracts. Upgrade or cancel anytime.",
      "basic": {
        "name": "BASIC",
        "price": "19",
        "period": "/month",
        "description": "Ideal for small homes that want to start automating their space.",
        "features": [
          "Up to 8 devices",
          "Energy consumption reports",
          "24/7 support",
          "Remote on/off control",
          "Informative dashboard"
        ],
        "unavailable": [
          "Advanced reports",
          "External integrations"
        ],
        "cta": "Get started"
      },
      "business": {
        "name": "BUSINESS",
        "price": "29",
        "period": "/month",
        "badge": "MOST POPULAR",
        "description": "For homes and offices that want full control of their devices and real-time monitoring.",
        "features": [
          "All Basic plan features",
          "Up to 20 devices",
          "Unlimited automations",
          "Priority support 24/7",
          "Advanced reports",
          "External integrations"
        ],
        "cta": "Get started"
      },
      "enterprise": {
        "name": "ENTERPRISE",
        "price": "39",
        "period": "/month",
        "description": "For companies, buildings and large-scale projects.",
        "features": [
          "Unlimited devices",
          "Unlimited automations",
          "Custom dashboard",
          "Guaranteed SLA",
          "ERP/BMS integration",
          "Dedicated account manager"
        ],
        "cta": "Contact sales"
      }
    },
    "testimonials": {
      "heading": "Real voices",
      "subheading": "What project leaders say about Vantage PMO",
      "t1": {
        "quote": "We stopped losing track of deadlines the moment we switched. Now I sleep better.",
        "name": "Maria Rodriguez",
        "role": "Team Lead, Relume"
      },
      "t2": {
        "quote": "Visibility across all our projects went from chaotic to crystal clear in one week.",
        "name": "James Carter",
        "role": "PMO Director, Webflow"
      }
    },
    "cta": {
      "label": "Team",
      "heading": "Meet the people behind Vantage PMO",
      "text": "A team of engineers and project leaders passionate about making project management work better for everyone.",
      "cta2": "Meet the team"
    },
    "blog": {
      "heading": "Stay ahead of what's next",
      "subheading": "Get insights on project management, leadership, and building better teams.",
      "cta": "Subscribe",
      "post1": {
        "category": "Leadership",
        "title": "Why your PMO framework is slowing you down",
        "excerpt": "Most project offices were built for compliance, not speed. Here's how to rethink yours."
      },
      "post2": {
        "category": "Teams",
        "title": "The real cost of misaligned teams",
        "excerpt": "Misalignment isn't just frustrating — it shows up directly in your project timelines and budgets."
      },
      "post3": {
        "category": "Data",
        "title": "Data-driven decisions in project management",
        "excerpt": "Moving from gut feelings to intelligence-backed choices changes everything for your leadership team."
      }
    },
    "footer": {
      "tagline": "Get insights on project management, directional and steady.",
      "col1": {
        "title": "Product",
        "link1": "Home",
        "link2": "Platform",
        "link3": "Pricing",
        "link4": "Blog"
      },
      "col2": {
        "title": "About us",
        "link1": "Our story",
        "link2": "Team",
        "link3": "Careers",
        "link4": "Contact"
      },
      "col3": {
        "title": "Follow us",
        "link1": "Facebook",
        "link2": "Instagram",
        "link3": "Twitter",
        "link4": "LinkedIn"
      },
      "copyright": "© 2026 VantagePMO. All rights reserved.",
      "privacy": "Privacy policy",
      "terms": "Terms of service",
      "cookies": "Cookie settings"
    },
    "products": {
      "label": "Platform",
      "heading": "One platform, every need",
      "subheading": "Each module solves a specific challenge, and together they power seamless project operations.",
      "card1": {
        "tag": "Vantage PMO · Projects",
        "heading": "AI-driven planning, execution & delivery",
        "text": "Drive projects and processes forward at scale, with intelligence that executes, builds, and automates for you.",
        "cta": "Get started"
      },
      "card2": {
        "tag": "Vantage PMO · Portfolio",
        "heading": "Portfolio visibility that gives you control",
        "text": "See every project at once. Track health, risk, and progress from a single command center.",
        "cta": "Get started"
      },
      "card3": {
        "tag": "Vantage PMO · Analytics",
        "heading": "Data-first decisions that deliver results",
        "text": "Turn raw project data into leadership intelligence. Forecast better, act faster.",
        "cta": "Get started"
      },
      "card4": {
        "tag": "Vantage PMO · Automation",
        "heading": "Automate the work no one wants to do",
        "text": "From reminders to reports, let smart automation handle the repetitive tasks so your team can focus on what matters.",
        "cta": "Get started"
      },
      "card5": {
        "tag": "Vantage PMO · Resources",
        "heading": "Right people on the right projects",
        "text": "Track capacity, allocate resources intelligently, and prevent burnout before it starts.",
        "cta": "Get started"
      },
      "card6": {
        "tag": "Vantage PMO · Reporting",
        "heading": "Reports that actually get read",
        "text": "Auto-generated stakeholder reports with the metrics that matter — delivered on your schedule.",
        "cta": "Get started"
      },
      "card7": {
        "tag": "Vantage PMO · Integrations",
        "heading": "Connect every tool your team already uses",
        "text": "Native integrations with Jira, Slack, Teams, and 40+ tools. One source of truth, zero friction.",
        "cta": "Get started"
      }
    },
    "ai": {
      "label": "Intelligence",
      "heading": "Your smart project assistant",
      "subheading": "Ask anything. Get answers backed by your real project data.",
      "prompt1": "Create a project plan",
      "prompt2": "Summarize project status",
      "prompt3": "Identify at-risk tasks",
      "prompt4": "Generate a stakeholder report",
      "prompt5": "Forecast delivery date",
      "input": "Ask Vantage AI..."
    },
    "team": {
      "label": "Team",
      "heading": "Meet the team behind Vantage PMO",
      "subheading": "We are a team of engineers passionate about solving project management challenges. Our mission is to build tools that make projects clearer, faster, and more successful for everyone.",
      "member1": {
        "name": "Kirk Quiliano",
        "role": "Software Engineer",
        "bio": "Backend developer with a passion for building scalable and efficient systems."
      },
      "member2": {
        "name": "Angiela Fuentes",
        "role": "Software Engineer",
        "bio": "Designer passionate about creating intuitive and engaging user experiences."
      },
      "member3": {
        "name": "Lionel Mendoza",
        "role": "Software Engineer",
        "bio": "Frontend developer with experience designing architecture diagrams."
      },
      "member4": {
        "name": "Mike Guillen",
        "role": "Software Engineer",
        "bio": "Full-stack developer who solves problems and designs intuitive interfaces."
      },
      "member5": {
        "name": "Rafael Pacheco",
        "role": "Software Engineer",
        "bio": "Expert backend developer in building robust and scalable systems."
      }
    }
  },
  es: {
    "meta": {
      "title": "Vantage PMO – Centraliza tus proyectos",
      "description": "Vantage PMO aporta claridad a cada proyecto. Visibilidad en tiempo real, procesos estandarizados y la inteligencia que necesitas para liderar."
    },
    "nav": {
      "home": "Inicio",
      "context": "Contexto",
      "platform": "Plataforma",
      "testimonials": "Testimonios",
      "blog": "Blog",
      "team": "Equipo",
      "resources": "Recursos",
      "login": "Iniciar sesión",
      "cta": "Pruébalo"
    },
    "hero": {
      "heading": "Centraliza tus proyectos, controla tu futuro.",
      "subheading": "Vantage PMO aporta claridad a cada proyecto. Visibilidad en tiempo real, procesos estandarizados y la inteligencia que necesitas para liderar.",
      "cta_primary": "Comenzar ahora",
      "cta_secondary": "Saber más"
    },
    "pillars": {
      "label": "Contexto",
      "heading": "Tres pilares de la gestión",
      "subheading": "Todo lo que necesitas para ejecutar proyectos correctamente",
      "card1": {
        "label": "Control",
        "title": "Un solo lugar para todo",
        "text": "Deja de dispersarte entre sistemas para gestionar datos de proyectos.",
        "cta": "Explorar"
      },
      "card2": {
        "label": "Visibilidad",
        "title": "Ve lo que importa ahora",
        "text": "Conoce el estado de tus proyectos en tiempo real.",
        "cta": "Explorar"
      },
      "card3": {
        "label": "Claridad",
        "title": "Toma decisiones que impulsan proyectos",
        "text": "Elimina las suposiciones que no puedes creer cada día.",
        "cta": "Explorar"
      }
    },
    "features": {
      "f1": {
        "label": "Resultados",
        "title": "Qué cambia cuando tomas el control",
        "text": "Los proyectos avanzan más rápido. Los equipos entienden lo que importa. Los líderes toman mejores decisiones.",
        "cta1": "Descubrir",
        "cta2": "Aprender"
      },
      "f2": {
        "label": "Alineados",
        "title": "Los proyectos terminan a tiempo, los equipos se mantienen alineados",
        "text": "Los retrasos desaparecen cuando todos ven el mismo panorama. Vantage PMO elimina el ruido para que tus equipos avancen juntos.",
        "cta1": "Aprender"
      },
      "f3": {
        "label": "Claridad",
        "title": "Comunicación que realmente funciona",
        "text": "No más esperas por actualizaciones de estado. Tus equipos saben qué se espera de ellos y los líderes saben qué está pasando, ahora mismo.",
        "cta1": "Aprender"
      },
      "f4": {
        "label": "Confianza",
        "title": "Decisiones basadas en hechos, no en intuición",
        "text": "Los datos reales reemplazan las suposiciones. Tu equipo de liderazgo toma decisiones más inteligentes, respaldadas por números.",
        "cta1": "Explorar",
        "cta2": "Aprender"
      }
    },
    "about": {
      "label": "Progreso",
      "heading": "Construido por ingenieros que entienden los proyectos",
      "text": "MEPB comenzó como OPC, donde los ingenieros de software vieron el mismo problema en todas partes: los proyectos fallaban no por falta de habilidades, sino por falta de claridad. Construimos Vantage PMO para solucionarlo.",
      "cta1": "Sobre nosotros",
      "cta2": "Aprender"
    },
    "onboarding": {
      "heading": "Comenzar toma minutos, no meses",
      "subheading": "Configura tu espacio de trabajo y lleva tus proyectos. Vantage PMO se encarga del resto.",
      "step1": {
        "title": "Conecta tus proyectos a la plataforma",
        "text": "Importa lo que quieras. Comienza desde cero. Integra a tus equipos con plantillas estandarizadas.",
        "cta": "Comenzar ahora"
      },
      "step2": {
        "title": "Observa cómo tu portafolio cobra claridad",
        "text": "Ve el estado donde lo necesites. Proyectos. Tareas. Planes.",
        "cta": "Comenzar ahora"
      },
      "step3": {
        "title": "Lidera con confianza y datos",
        "text": "Toma decisiones respaldadas por inteligencia, no solo por hábito.",
        "cta": "Comenzar ahora"
      }
    },
    "pricing": {
      "label": "Precios",
      "heading": "Elige tu plan",
      "subheading": "Sin contratos a largo plazo. Actualiza o cancela en cualquier momento.",
      "basic": {
        "name": "BÁSICO",
        "price": "19",
        "period": "/mes",
        "description": "Ideal para casas pequeñas que desean comenzar a automatizar su espacio.",
        "features": [
          "Hasta 8 dispositivos",
          "Reportes de consumo de energía",
          "Soporte 24/7",
          "Control remoto encendido/apagado",
          "Panel de control informativo"
        ],
        "unavailable": [
          "Reportes avanzados",
          "Integraciones externas"
        ],
        "cta": "Comenzar"
      },
      "business": {
        "name": "NEGOCIO",
        "price": "29",
        "period": "/mes",
        "badge": "MÁS POPULAR",
        "description": "Para hogares y oficinas que desean control total de sus dispositivos y monitoreo en tiempo real.",
        "features": [
          "Todas las funciones del plan Básico",
          "Hasta 20 dispositivos",
          "Automatizaciones ilimitadas",
          "Soporte prioritario 24/7",
          "Reportes avanzados",
          "Integraciones externas"
        ],
        "cta": "Comenzar"
      },
      "enterprise": {
        "name": "EMPRESARIAL",
        "price": "39",
        "period": "/mes",
        "description": "Para empresas, edificios y proyectos a gran escala.",
        "features": [
          "Dispositivos ilimitados",
          "Automatizaciones ilimitadas",
          "Panel personalizado",
          "SLA garantizado",
          "Integración ERP/BMS",
          "Gestor de cuenta dedicado"
        ],
        "cta": "Contactar ventas"
      }
    },
    "testimonials": {
      "heading": "Voces reales",
      "subheading": "Lo que dicen los líderes de proyectos sobre Vantage PMO",
      "t1": {
        "quote": "Dejamos de perder el rastro de los plazos en el momento en que cambiamos. Ahora duermo mejor.",
        "name": "María Rodríguez",
        "role": "Líder de equipo, Relume"
      },
      "t2": {
        "quote": "La visibilidad en todos nuestros proyectos pasó del caos a la claridad total en una semana.",
        "name": "James Carter",
        "role": "Director PMO, Webflow"
      }
    },
    "cta": {
      "label": "Equipo",
      "heading": "Conoce a las personas detrás de Vantage PMO",
      "text": "Un equipo de ingenieros y líderes de proyectos apasionados por mejorar la gestión de proyectos para todos.",
      "cta2": "Conoce al equipo"
    },
    "blog": {
      "heading": "Mantente a la vanguardia",
      "subheading": "Obtén información sobre gestión de proyectos, liderazgo y construcción de mejores equipos.",
      "cta": "Suscribirse",
      "post1": {
        "category": "Liderazgo",
        "title": "Por qué tu marco PMO te está frenando",
        "excerpt": "La mayoría de las oficinas de proyectos se construyeron para el cumplimiento, no para la velocidad."
      },
      "post2": {
        "category": "Equipos",
        "title": "El costo real de los equipos desalineados",
        "excerpt": "La desalineación no solo es frustrante: aparece directamente en tus plazos y presupuestos."
      },
      "post3": {
        "category": "Datos",
        "title": "Decisiones basadas en datos en la gestión de proyectos",
        "excerpt": "Pasar de la intuición a las decisiones respaldadas por inteligencia lo cambia todo."
      }
    },
    "footer": {
      "tagline": "Información sobre gestión de proyectos, directa y constante.",
      "col1": {
        "title": "Producto",
        "link1": "Inicio",
        "link2": "Plataforma",
        "link3": "Precios",
        "link4": "Blog"
      },
      "col2": {
        "title": "Sobre nosotros",
        "link1": "Nuestra historia",
        "link2": "Equipo",
        "link3": "Carreras",
        "link4": "Contacto"
      },
      "col3": {
        "title": "Síguenos",
        "link1": "Facebook",
        "link2": "Instagram",
        "link3": "Twitter",
        "link4": "LinkedIn"
      },
      "copyright": "© 2026 VantagePMO. Todos los derechos reservados.",
      "privacy": "Política de privacidad",
      "terms": "Términos de servicio",
      "cookies": "Configuración de cookies"
    },
    "products": {
      "label": "Plataforma",
      "heading": "Una plataforma, cada necesidad",
      "subheading": "Cada módulo resuelve un desafío específico, y juntos impulsan operaciones de proyectos sin fricciones.",
      "card1": {
        "tag": "Vantage PMO · Proyectos",
        "heading": "Planificación, ejecución y entrega impulsadas por IA",
        "text": "Lleva proyectos y procesos hacia adelante a escala, con inteligencia que ejecuta, construye y automatiza por ti.",
        "cta": "Comenzar"
      },
      "card2": {
        "tag": "Vantage PMO · Portafolio",
        "heading": "Visibilidad de portafolio que te da control",
        "text": "Ve todos tus proyectos a la vez. Rastrea salud, riesgo y progreso desde un único centro de mando.",
        "cta": "Comenzar"
      },
      "card3": {
        "tag": "Vantage PMO · Analítica",
        "heading": "Decisiones basadas en datos que generan resultados",
        "text": "Convierte datos crudos de proyectos en inteligencia para el liderazgo. Mejor pronóstico, acción más rápida.",
        "cta": "Comenzar"
      },
      "card4": {
        "tag": "Vantage PMO · Automatización",
        "heading": "Automatiza el trabajo que nadie quiere hacer",
        "text": "Desde recordatorios hasta reportes, deja que la automatización inteligente maneje las tareas repetitivas para que tu equipo se enfoque en lo que importa.",
        "cta": "Comenzar"
      },
      "card5": {
        "tag": "Vantage PMO · Recursos",
        "heading": "Las personas correctas en los proyectos correctos",
        "text": "Controla la capacidad, asigna recursos inteligentemente y previene el agotamiento antes de que ocurra.",
        "cta": "Comenzar"
      },
      "card6": {
        "tag": "Vantage PMO · Reportes",
        "heading": "Reportes que realmente se leen",
        "text": "Reportes auto-generados para stakeholders con las métricas que importan, entregados según tu calendario.",
        "cta": "Comenzar"
      },
      "card7": {
        "tag": "Vantage PMO · Integraciones",
        "heading": "Conecta cada herramienta que tu equipo ya usa",
        "text": "Integraciones nativas con Jira, Slack, Teams y más de 40 herramientas. Una sola fuente de verdad, cero fricción.",
        "cta": "Comenzar"
      }
    },
    "ai": {
      "label": "Inteligencia",
      "heading": "Tu asistente inteligente de proyectos",
      "subheading": "Pregunta lo que quieras. Obtén respuestas respaldadas por tus datos reales de proyectos.",
      "prompt1": "Crear un plan de proyecto",
      "prompt2": "Resumir el estado del proyecto",
      "prompt3": "Identificar tareas en riesgo",
      "prompt4": "Generar un reporte para stakeholders",
      "prompt5": "Pronosticar fecha de entrega",
      "input": "Pregunta a Vantage AI..."
    },
    "team": {
      "label": "Equipo",
      "heading": "Conoce al equipo detrás de Vantage PMO",
      "subheading": "Somos un equipo de ingenieros apasionados por resolver los desafíos de la gestión de proyectos. Nuestra misión es construir herramientas que hagan que los proyectos sean más claros, rápidos y exitosos para todos.",
      "member1": {
        "name": "Kirk Quiliano",
        "role": "Ingeniero de Software",
        "bio": "Desarrollador backend con una pasión por construir sistemas escalables y eficientes."
      },
      "member2": {
        "name": "Angiela Fuentes",
        "role": "Ingeniero de Software",
        "bio": "Diseñador apasionado por crear experiencias de usuario intuitivas y atractivas."
      },
      "member3": {
        "name": "Lionel Mendoza",
        "role": "Ingeniero de Software",
        "bio": "Desarrollador frontend que tiene experiencia diseñando de diagramas de arquitectura."
      },
      "member4": {
        "name": "Mike Guillen",
        "role": "Ingeniero de Software",
        "bio": "Desarrollador full-stack que soluciona problemas y diseña interfaces intuitivas."
      },
      "member5": {
        "name": "Rafael pacheco",
        "role": "Ingeniero de Software",
        "bio": "Desarrollador backend experto en construir sistemas robustos y escalables."
      }
    }
  }
};

/**
 * Resolves a nested object property using dot notation.
 *
 * @param {Object} obj - The object to traverse
 * @param {string} key - The dot-separated key path
 * @returns {*} The resolved value or undefined if not found
 * @private
 */
function resolve(obj, key) {
  return key.split('.').reduce(function (acc, part) {
    return acc !== undefined ? acc[part] : undefined;
  }, obj);
}

/**
 * Applies loaded translations to the DOM.
 *
 * @param {Object} translations - The translation object for the current language
 * @private
 */
function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    var value = resolve(translations, key);
    if (value !== undefined) {
      if (el.tagName.toLowerCase() === 'meta') {
        el.setAttribute('content', value);
      } else {
        el.textContent = value;
      }
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-placeholder');
    var value = resolve(translations, key);
    if (value !== undefined) {
      el.setAttribute('placeholder', value);
    }
  });

  document.documentElement.lang = currentLang;
}

/**
 * Loads translation JSON file for the specified language.
 *
 * @param {string} lang - The language code to load
 * @returns {Promise<Object>} Promise resolving to the translation object
 * @private
 */
function loadTranslations(lang) {
  if (window.location.protocol === 'file:') {
    return Promise.resolve(INLINE_TRANSLATIONS[lang] || INLINE_TRANSLATIONS[DEFAULT_LANG]);
  }

  var path = new URL('public/i18n/' + lang + '.json', window.location.href).href;
  return fetch(path)
    .then(function (res) {
      if (!res.ok) throw new Error('No se pudo cargar: ' + lang + ' (' + path + ')');
      return res.json();
    })
    .catch(function (err) {
      if (INLINE_TRANSLATIONS[lang]) {
        return INLINE_TRANSLATIONS[lang];
      }
      throw err;
    });
}

/**
 * Updates the language switcher button text.
 *
 * @param {string} lang - The current language code
 * @private
 */
function updateSwitcher(lang) {
  var btn = document.getElementById('langSwitcher');
  if (btn) {
    btn.textContent = lang.toUpperCase();
  }
}

/**
 * Changes the active language and applies translations.
 *
 * @param {string} lang - The language code to switch to
 * @public
 */
function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  loadTranslations(lang)
    .then(function (translations) {
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      applyTranslations(translations);
      updateSwitcher(lang);
    })
    .catch(function (err) {
      console.error('[i18n]', err);
    });
}

/**
 * Gets the currently active language code.
 *
 * @returns {string} The current language code
 * @public
 */
function getCurrentLang() {
  return currentLang;
}

/**
 * Initializes the i18n system.
 *
 * @private
 */
function init() {
  var saved = localStorage.getItem(STORAGE_KEY);
  var browser = (navigator.language || '').substring(0, 2);
  var initial = saved || (SUPPORTED_LANGS.includes(browser) ? browser : DEFAULT_LANG);

  var switcher = document.getElementById('langSwitcher');
  if (switcher) {
    switcher.addEventListener('click', function () {
      setLanguage(currentLang === 'en' ? 'es' : 'en');
    });
  }

  setLanguage(initial);
}

document.addEventListener('DOMContentLoaded', init);

/* Public API */
window.i18n = { setLanguage: setLanguage, getCurrentLang: getCurrentLang };
