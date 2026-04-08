/**
 * AIR WOLF CLIMATIZACIÓN — JavaScript v3.0
 * @description Scripts mejorados: slider, FAQ, header sticky, menú hamburguesa, contador de stats
 */

(function () {
    'use strict';

    // ==================== UTILIDADES ====================
    const Utils = {
        debounce(func, wait = 250) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        throttle(func, limit = 100) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => (inThrottle = false), limit);
                }
            };
        }
    };

    // ==================== HEADER STICKY ====================
    class StickyHeader {
        constructor() {
            this.header = document.querySelector('.container-header');
            if (!this.header) return;
            this.init();
        }

        init() {
            window.addEventListener('scroll', Utils.throttle(() => this.onScroll(), 80));
        }

        onScroll() {
            if (window.scrollY > 60) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
    }

    // ==================== MENÚ HAMBURGUESA ====================
    class MobileMenu {
        constructor() {
            this.menuIcon = document.getElementById('icon-menu');
            this.nav = document.querySelector('header nav');
            if (!this.menuIcon || !this.nav) return;
            this.isOpen = false;
            this.init();
        }

        init() {
            this.menuIcon.addEventListener('click', () => this.toggle());

            // Cerrar al hacer click en enlace (móvil)
            this.nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 800) this.close();
                });
            });

            // Cerrar al hacer click fuera
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.nav.contains(e.target) && !this.menuIcon.contains(e.target)) {
                    this.close();
                }
            });

            // Cerrar con Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) this.close();
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.isOpen = true;
            this.nav.classList.add('active');
            this.menuIcon.classList.add('active');
            this.menuIcon.setAttribute('alt', 'Cerrar menú de navegación');
            this.menuIcon.setAttribute('aria-expanded', 'true');
        }

        close() {
            this.isOpen = false;
            this.nav.classList.remove('active');
            this.menuIcon.classList.remove('active');
            this.menuIcon.setAttribute('alt', 'Abrir menú de navegación');
            this.menuIcon.setAttribute('aria-expanded', 'false');
        }
    }

    // ==================== SMOOTH SCROLL ====================
    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('a.smooth-scroll, a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => this.handleClick(e));
            });
        }

        handleClick(e) {
            const href = e.currentTarget.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.container-header')?.offsetHeight || 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

            window.scrollTo({ top, behavior: 'smooth' });

            if (history.pushState) {
                history.pushState(null, null, href);
            }
        }
    }

    // ==================== SLIDER MANUAL + AUTOPLAY ====================
    class Slider {
        constructor() {
            this.track = document.getElementById('slider-track');
            this.dots = document.querySelectorAll('.slider-dot');
            this.prevBtn = document.getElementById('slider-prev');
            this.nextBtn = document.getElementById('slider-next');
            if (!this.track) return;

            this.total = this.track.children.length;
            this.current = 0;
            this.autoplayInterval = null;
            this.autoplayDelay = 4500;
            this.isTransitioning = false;

            this.init();
        }

        init() {
            // Quitar animación CSS del ul (usamos JS)
            this.track.classList.remove('auto-play');

            // Aseguramos que el ul tenga la transición CSS aplicada
            this.track.style.transition = 'margin-left 0.65s cubic-bezier(0.77, 0, 0.175, 1)';

            // Botones de flecha
            this.prevBtn?.addEventListener('click', () => { this.go(this.current - 1); this.resetAutoplay(); });
            this.nextBtn?.addEventListener('click', () => { this.go(this.current + 1); this.resetAutoplay(); });

            // Dots
            this.dots.forEach((dot, i) => {
                dot.addEventListener('click', () => { this.go(i); this.resetAutoplay(); });
            });

            // Touch / swipe
            this.initTouch();

            // Autoplay
            this.startAutoplay();

            // Pausar al hover
            this.track.parentElement.addEventListener('mouseenter', () => this.stopAutoplay());
            this.track.parentElement.addEventListener('mouseleave', () => this.startAutoplay());
        }

        go(index) {
            if (this.isTransitioning) return;
            this.isTransitioning = true;

            // Wrap around
            if (index < 0) index = this.total - 1;
            if (index >= this.total) index = 0;

            this.current = index;
            this.track.style.marginLeft = `-${this.current * 100}%`;

            // Actualizar dots
            this.dots.forEach((dot, i) => {
                const active = i === this.current;
                dot.classList.toggle('active', active);
                dot.setAttribute('aria-selected', String(active));
            });

            setTimeout(() => { this.isTransitioning = false; }, 700);
        }

        startAutoplay() {
            this.stopAutoplay();
            this.autoplayInterval = setInterval(() => this.go(this.current + 1), this.autoplayDelay);
        }

        stopAutoplay() {
            clearInterval(this.autoplayInterval);
        }

        resetAutoplay() {
            this.stopAutoplay();
            this.startAutoplay();
        }

        initTouch() {
            let startX = 0;
            const el = this.track.parentElement;

            el.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].screenX;
            }, { passive: true });

            el.addEventListener('touchend', (e) => {
                const diff = startX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) {
                    this.go(diff > 0 ? this.current + 1 : this.current - 1);
                    this.resetAutoplay();
                }
            }, { passive: true });
        }
    }

    // ==================== FAQ ACORDEÓN ====================
    class FAQAccordion {
        constructor() {
            this.items = document.querySelectorAll('.faq-item');
            if (!this.items.length) return;
            this.init();
        }

        init() {
            this.items.forEach(item => {
                const btn = item.querySelector('.faq-question');
                btn?.addEventListener('click', () => this.toggle(item));
            });
        }

        toggle(item) {
            const isOpen = item.classList.contains('open');

            // Cerrar todos
            this.items.forEach(i => {
                i.classList.remove('open');
                const q = i.querySelector('.faq-question');
                q?.setAttribute('aria-expanded', 'false');
            });

            // Abrir el clickeado (si estaba cerrado)
            if (!isOpen) {
                item.classList.add('open');
                const btn = item.querySelector('.faq-question');
                btn?.setAttribute('aria-expanded', 'true');
            }
        }
    }

    // ==================== CONTADOR DE ESTADÍSTICAS ====================
    class StatsCounter {
        constructor() {
            this.counters = document.querySelectorAll('.stat-number:not(.stat-text)');
            this.duration = 2000;
            this.hasAnimated = false;
            if (!this.counters.length) return;
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.hasAnimated = true;
                        this.animate();
                    }
                });
            }, { threshold: 0.4 });

            const section = document.querySelector('.stats-section');
            if (section) observer.observe(section);
        }

        animate() {
            this.counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target') || '0');
                const increment = target / (this.duration / 16);
                let current = 0;

                const tick = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(tick);
                    } else {
                        counter.textContent = target;
                    }
                };

                requestAnimationFrame(tick);
            });
        }
    }

    // ==================== SCROLL REVEAL ====================
    class ScrollReveal {
        constructor() {
            this.elements = document.querySelectorAll(
                '.card, .ventaja-card, .testimonio-card, .faq-item, .vision-mision article'
            );
            if (!this.elements.length) return;
            this.init();
        }

        init() {
            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(24px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, 60 * (Array.from(this.elements).indexOf(entry.target) % 4));
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ==================== VALIDACIÓN DE FORMULARIO ====================
    class FormValidator {
        constructor(formId) {
            this.form = document.getElementById(formId);
            if (!this.form) return;
            this.init();
        }

        init() {
            this.form.addEventListener('submit', (e) => {
                if (!this.validate()) {
                    e.preventDefault();
                }
            });

            // Validación en tiempo real (on blur)
            this.form.querySelectorAll('input[required], textarea[required]').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearError(field));
            });
        }

        validate() {
            let valid = true;
            this.form.querySelectorAll('input[required], textarea[required]').forEach(field => {
                if (!this.validateField(field)) valid = false;
            });
            return valid;
        }

        validateField(field) {
            this.clearError(field);
            const val = field.value.trim();

            if (!val) {
                this.setError(field, 'Este campo es requerido');
                return false;
            }

            if (field.type === 'email') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    this.setError(field, 'Ingrese un correo electrónico válido');
                    return false;
                }
            }

            return true;
        }

        setError(field, msg) {
            field.style.borderColor = '#ef4444';
            let span = field.parentElement.querySelector('.field-error');
            if (!span) {
                span = document.createElement('span');
                span.className = 'field-error';
                span.style.cssText = 'color:#ef4444;font-size:12px;margin-top:4px;display:block;font-family:var(--font-subtitles)';
                span.setAttribute('role', 'alert');
                field.parentElement.appendChild(span);
            }
            span.textContent = msg;
        }

        clearError(field) {
            field.style.borderColor = '';
            const span = field.parentElement.querySelector('.field-error');
            span?.remove();
        }
    }

    // ==================== LAZY LOADING (fallback) ====================
    class LazyLoader {
        constructor() {
            if ('loading' in HTMLImageElement.prototype) return; // soporte nativo
            const imgs = document.querySelectorAll('img[loading="lazy"]');
            const obs = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '80px' });
            imgs.forEach(img => obs.observe(img));
        }
    }

    // ==================== PERFORMANCE (Analytics) ====================
    class PerformanceMonitor {
        constructor() {
            window.addEventListener('load', () => {
                if (typeof gtag !== 'function') return;
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                gtag('event', 'timing_complete', {
                    name: 'load',
                    value: loadTime,
                    event_category: 'Performance'
                });
            });
        }
    }

    // ==================== INICIALIZACIÓN ====================
    function boot() {
        new StickyHeader();
        new MobileMenu();
        new SmoothScroll();
        new Slider();
        new FAQAccordion();
        new StatsCounter();
        new ScrollReveal();
        new FormValidator('formulario');
        new LazyLoader();
        new PerformanceMonitor();

        document.documentElement.classList.add('js-loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
