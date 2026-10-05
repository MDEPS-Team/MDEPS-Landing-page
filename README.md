# Vantage PMO – Sitio Web

Landing page estática de **Vantage PMO**, una plataforma de gestión de proyectos (PMO) que centraliza datos, proporciona visibilidad en tiempo real y permite decisiones basadas en datos.

Desplegado en **GitHub Pages** · Soporte **EN / ES** · Sin dependencias externas

---

## Características

- **Internacionalización (i18n)** — Inglés y Español con detección automática y persistencia en `localStorage`
- **Carrusel de productos** — Bucle infinito con scroll-snap, navegación por botones y dots
- **Reproductor de video inline** — Miniatura de YouTube con autoplay al hacer clic (sección "About the Team")
- **Secciones animadas** — Intersection Observer para fade-in en scroll
- **Diseño responsivo** — CSS Grid + Flexbox, adaptado a móvil, tablet y escritorio
- **Navegación móvil** — Menú hamburguesa con soporte ARIA
- **Imágenes externas** — Unsplash CDN para productos (sin archivos locales requeridos)

---

## Estructura del Proyecto

```
/
├── index.html                    # Documento principal (SPA)
├── README.md
└── public/
    ├── assets/
    │   └── images/
    │       ├── about/            # about.png
    │       ├── blog/             # data.jpeg · leadership.png · teams.jpeg
    │       ├── cta/              # lead.jpeg
    │       ├── hero/             # hero.png
    │       ├── logo/             # light-logo.png · dark-logo.png
    │       ├── pillars/          # pillar-01.png · pillar-02.png · pillar-03.png
    │       ├── team/             # Lionel , Rafael , Angiela , Kirk , Dylan 
    │       └── testimonials/     # testimonial-1.png · testimonial-2.jpeg
    ├── i18n/
    │   ├── en.json               # Traducciones en inglés
    │   └── es.json               # Traducciones en español
    ├── js/
    │   ├── i18n.js               # Módulo i18n (fetch + DOM update)
    │   ├── main.js               # Lógica principal (carrusel, animaciones, video, etc.)
    │   └── nav.js                # Menú de navegación móvil
    └── styles/
        └── style.css             # Hoja de estilos unificada (tokens CSS + BEM)
```

---

## Secciones del sitio

| Sección | ID | Descripción |
|---------|----|-------------|
| Nav | `#nav` | Barra de navegación con cambio de idioma |
| Hero | `#hero` | Encabezado principal con imagen |
| Pillars | `#pillars` | 3 pilares de gestión (Control, Visibilidad, Claridad) |
| Products | `#products` | Carrusel de 7 módulos de la plataforma |
| Features | `#features` | Características con scroll animado |
| AI | `#ai` | Sección de inteligencia artificial |
| About | `#about` | Historia del equipo |
| Onboarding | `#onboarding` | Pasos para comenzar |
| Testimonials | `#testimonials` | Testimonios de clientes |
| CTA | `#cta` | "Meet the team" con reproductor YouTube inline |
| Blog | `#blog` | 3 artículos con imágenes reales |
| Team | `#team` | Tarjetas del equipo de desarrollo |
| Footer | — | Links, redes sociales y copyright |

---

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| HTML5 semántico | Estructura y accesibilidad (ARIA) |
| CSS3 (Grid, Flexbox, Custom Properties) | Layout, temas, animaciones |
| JavaScript ES5+ (vanilla) | Interactividad sin frameworks |
| Google Fonts (Sora, Inter) | Tipografía |
| Unsplash CDN | Imágenes de productos |
| YouTube Embed API | Reproductor inline en sección CTA |
| Fetch API | Carga de traducciones JSON |
| Intersection Observer API | Animaciones en scroll |
| localStorage | Persistencia del idioma |

---

## i18n — Internacionalización

Las traducciones se cargan desde `public/i18n/{lang}.json` mediante `fetch()`. La URL se construye dinámicamente en base a la ubicación del script, lo que garantiza compatibilidad con GitHub Pages en cualquier subdirectorio.

Para cambiar el idioma en código:

```js
window.i18n.setLanguage('es'); // o 'en'
```

Para agregar un nuevo idioma:
1. Crear `public/i18n/fr.json` con las mismas claves
2. Agregar `'fr'` al array `SUPPORTED_LANGS` en `i18n.js`

---

## Soporte de navegadores

- Chrome 80+ · Firefox 75+ · Safari 13+ · Edge 80+
- Requiere: CSS Grid, Fetch API, Intersection Observer, scroll-snap

---

## Licencia

© 2026 Vantage PMO. Todos los derechos reservados.
