# Vantage PMO – Sitio web

Landing page estática de **Vantage PMO**, una plataforma de gestión de proyectos (PMO) que centraliza el portafolio, da visibilidad en tiempo real y apoya las decisiones con un asistente de IA.

Desplegada en **GitHub Pages** · **EN / ES** · Tema **claro / oscuro** · Sin build ni dependencias de ejecución

---

## Cómo correrla

No hay paso de build. Abre `index.html` directamente o sírvela en local:

```bash
npx serve .            # o cualquier servidor estático
```

## Estructura

```
/
├── index.html                  # Landing
├── Session_registration.html   # Registro (destino del CTA principal)
├── PRODUCT.md / DESIGN.md      # Contexto de producto y sistema visual
└── public/
    ├── assets/images/          # WebP optimizados (+ originales PNG/JPEG)
    ├── js/
    │   ├── i18n.js             # Diccionarios EN/ES en línea + data-i18n / -aria / -placeholder / -alt
    │   ├── orrery.js           # Vista 3D del portafolio en canvas (sin librerías)
    │   └── main.js             # Nav, tema, orrery, carrusel 3D, asistente IA, recorrido
    └── styles/style.css        # Tokens + componentes + secciones
```

## Secciones

| Sección | ID | Qué hace |
|---|---|---|
| Hero | `#hero` | Propuesta de valor + orrery 3D interactivo (arrastrar, flechas, chips por proyecto) |
| Pilares | `#pillars` | Control, Visibilidad, Claridad |
| Plataforma | `#platform` | 7 módulos en carrusel 3D; cada tarjeta gira para mostrar cómo funciona |
| Resultados | `#results` | El orrery se ordena con el scroll: control → alineación → comunicación → datos |
| Asistente IA | `#assistant` | Recorrido de 5 preguntas (pausable) con tablero, reporte y pronóstico a escala |
| Nosotros | `#about` | Historia |
| Onboarding | `#onboarding` | 3 pasos con línea que se dibuja al entrar |
| Testimonios | `#testimonials` | Citas |
| Precios | `#pricing` | Básico / Business / Enterprise |
| Artículos | `#blog` | 3 artículos |
| Equipo | `#team` | 5 integrantes |
| Cierre | `#cta` | CTA final |

## Accesibilidad y rendimiento

- Enlace para saltar al contenido, foco visible, navegación completa por teclado (tabs del asistente con flechas, orrery con flechas y Escape).
- Contraste AA en ambos temas; `prefers-reduced-motion` respetado (orrery estático, sin recorrido automático).
- Animaciones pausadas fuera de pantalla; imágenes WebP con `width`/`height` y carga diferida.

## i18n

Todas las cadenas viven en `public/js/i18n.js`. Para añadir un idioma, duplica el bloque `en`, tradúcelo y añádelo a `SUPPORTED`.

```js
window.i18n.setLanguage('es');
```

## Pendiente de validar

- **Precios**: las características de cada plan son un borrador para un PMO SaaS.
- **Testimonios**: nombres y citas de ejemplo; reemplazar por clientes reales.
- **Registro**: el formulario envía a `/api/register`, que no existe en hosting estático.

© 2026 Vantage PMO. Todos los derechos reservados.
