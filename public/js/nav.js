/**
 * Navigation module for Vantage PMO website.
 *
 * Handles the behavior of the navigation menu, specifically the mobile
 * hamburger menu toggle functionality with accessibility features.
 *
 * @module nav
 * @author Vantage PMO Development Team
 * @version 1.0.0
 * @license © 2026 Vantage PMO. All rights reserved.
 */

/**
 * Initializes the navigation menu functionality.
 *
 * Sets up event listeners for the mobile menu toggle button, including:
 * - Click events to open/close the menu
 * - Outside clicks to close the menu
 * - Window resize events to close menu on desktop breakpoint
 *
 * @function init
 * @private
 */
function init() {
  var toggle = document.querySelector('.nav__toggle');
  var menu   = document.querySelector('.nav__menu');

  if (!toggle || !menu) return;

  /* Abrir / cerrar menú */
  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Cerrar al hacer clic fuera del nav */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* Cerrar al redimensionar a desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
