/**
 * AIR WOLF CLIMATIZACIÓN - JavaScript Optimizado
 * @version 2.0
 * @description Scripts mejorados con mejores prácticas y rendimiento optimizado
 */

(function() {
    'use strict';

    // ==================== UTILIDADES ====================
    const Utils = {
        /**
         * Debounce function para optimizar eventos que se disparan frecuentemente
         * @param {Function} func - Función a ejecutar
         * @param {number} wait - Tiempo de espera en ms
         * @returns {Function}
         */
        debounce: function(func, wait = 250) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function para limitar la frecuencia de ejecución
         * @param {Function} func - Función a ejecutar
         * @param {number} limit - Límite de tiempo en ms
         * @returns {Function}
         */
        throttle: function(func, limit = 250) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // ==================== SCROLL HANDLER ====================
    class ScrollHandler {
        constructor() {
            this.init();
        }

        init() {
            // Optimización con throttle para mejor rendimiento
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
            }, 100));
        }

        handleScroll() {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            const contenedor = document.querySelector('.contenedor');
            
            if (contenedor) {
                if (scrollPosition > 0) {
                    contenedor.classList.add('scrolled');
                } else {
                    contenedor.classList.remove('scrolled');
                }
            }

            // Mostrar/ocultar botón de scroll to top
            this.toggleScrollTopButton(scrollPosition);
        }

        toggleScrollTopButton(scrollPosition) {
            const scrollTopBtn = document.getElementById('scrollTopBtn');
            if (scrollTopBtn) {
                if (scrollPosition > 300) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            }
        }
    }

    // ==================== SMOOTH SCROLL ====================
    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            // Selecciona todos los enlaces con la clase 'smooth-scroll'
            const links = document.querySelectorAll('.smooth-scroll');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    this.handleClick(e);
                });
            });
        }

        handleClick(e) {
            e.preventDefault();
            
            const targetId = e.currentTarget.getAttribute('href');
            
            // Validar que el targetId existe
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Desplazamiento suave con offset para header fijo
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Actualizar URL sin recargar la página
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }

                // Mejorar accesibilidad: dar foco al elemento
                targetElement.focus({preventScroll: true});
            }
        }
    }

    // ==================== FORM VALIDATION ====================
    class FormValidator {
        constructor(formId) {
            this.form = document.getElementById(formId);
            if (this.form) {
                this.init();
            }
        }

        init() {
            this.form.addEventListener('submit', (e) => {
                if (!this.validateForm()) {
                    e.preventDefault();
                    this.showError('Por favor, complete todos los campos correctamente.');
                }
            });

            // Validación en tiempo real
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        }

        validateForm() {
            let isValid = true;
            const inputs = this.form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            let isValid = true;

            // Limpiar mensajes de error previos
            this.clearFieldError(field);

            // Validar campo vacío
            if (field.required && value === '') {
                this.setFieldError(field, '');
                isValid = false;
            }

            // Validar email
            if (type === 'email' && value !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.setFieldError(field, 'Por favor, ingrese un email válido');
                    isValid = false;
                }
            }

            // Validar longitud mínima
            if (field.minLength && value.length < field.minLength) {
                this.setFieldError(field, `Mínimo ${field.minLength} caracteres`);
                isValid = false;
            }

            return isValid;
        }

        setFieldError(field, message) {
            field.classList.add('error');
            
            // Crear mensaje de error si no existe
            let errorMsg = field.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.setAttribute('role', 'alert');
                field.parentElement.appendChild(errorMsg);
            }
            errorMsg.textContent = message;
        }

        clearFieldError(field) {
            field.classList.remove('error');
            const errorMsg = field.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }

        showError(message) {
            alert(message); // En producción, usar un modal o toast más elegante
        }
    }

    // ==================== LAZY LOADING ====================
    class LazyLoader {
        constructor() {
            this.images = document.querySelectorAll('img[loading="lazy"]');
            this.init();
        }

        init() {
            // Verificar si el navegador soporta lazy loading nativo
            if ('loading' in HTMLImageElement.prototype) {
                // El navegador soporta lazy loading nativo
                return;
            }

            // Fallback para navegadores que no soportan lazy loading
            this.observeImages();
        }

        observeImages() {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            this.images.forEach(img => imageObserver.observe(img));
        }
    }

    // ==================== PERFORMANCE MONITORING ====================
    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            // Medir el tiempo de carga de la página
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                // Solo en desarrollo - comentar en producción
                // console.log(`Tiempo de carga de la página: ${pageLoadTime}ms`);
                
                // Enviar a analytics si está configurado
                if (typeof gtag === 'function') {
                    gtag('event', 'timing_complete', {
                        name: 'load',
                        value: pageLoadTime,
                        event_category: 'Performance'
                    });
                }
            });
        }
    }

    // ==================== MENU MOBILE ====================
    class MobileMenu {
        constructor() {
            this.menuIcon = document.getElementById('icon-menu');
            this.nav = document.querySelector('nav');
            if (this.menuIcon && this.nav) {
                this.init();
            }
        }

        init() {
            this.menuIcon.addEventListener('click', () => {
                this.toggleMenu();
            });

            // Cerrar menú al hacer click en un enlace
            const navLinks = this.nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 800) {
                        this.closeMenu();
                    }
                });
            });
        }

        toggleMenu() {
            this.nav.classList.toggle('active');
            this.menuIcon.classList.toggle('active');
        }

        closeMenu() {
            this.nav.classList.remove('active');
            this.menuIcon.classList.remove('active');
        }
    }

    // ==================== INICIALIZACIÓN ====================
    class App {
        constructor() {
            this.init();
        }

        init() {
            // Esperar a que el DOM esté completamente cargado
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initializeComponents();
                });
            } else {
                this.initializeComponents();
            }
        }

        initializeComponents() {
            // Inicializar todos los componentes
            new ScrollHandler();
            new SmoothScroll();
            new FormValidator('formulario');
            new LazyLoader();
            new PerformanceMonitor();
            new MobileMenu();

            // Añadir clase para indicar que JS está cargado
            document.documentElement.classList.add('js-loaded');

            // Log para desarrollo
            // console.log('Air Wolf Climatización - Sitio web cargado correctamente');
        }
    }

    // Iniciar la aplicación
    new App();

    // ==================== CONTADOR DE ESTADÍSTICAS ====================
    class StatsCounter {
        constructor() {
            this.counters = document.querySelectorAll('.stat-number');
            this.duration = 2500; // Duración de la animación en ms
            this.hasAnimated = false;
            this.init();
        }

        init() {
            // Usar Intersection Observer para animar cuando sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateCounters();
                        this.hasAnimated = true;
                    }
                });
            }, { threshold: 0.5 });

            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                observer.observe(statsSection);
            }
        }

        animateCounters() {
            this.counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / (this.duration / 16); // 60 FPS
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            });
        }
    }

    // Iniciar contador de estadísticas
    new StatsCounter();

    // ==================== SERVICE WORKER (PWA) ====================
    // Descomentar para habilitar PWA
    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration);
                })
                .catch(error => {
                    console.log('Error al registrar Service Worker:', error);
                });
        });
    }
    */

})();
