(function() {
    // El script se ejecuta solo cuando el HTML ha sido completamente cargado y parseado.
    document.addEventListener('DOMContentLoaded', inicializar);

    // ==========================================
    // INICIALIZACIÓN PRINCIPAL
    // ==========================================
    function inicializar() {
        configurarAnimacionesScroll();
        configurarAnimacionContadores();
        configurarFiltrosRecursos();
        configurarValidacionFormulario();
        configurarModales();
        configurarDescargas();
    }

    // ==========================================
    // ANIMACIONES CON INTERSECTION OBSERVER
    // ==========================================
    function configurarAnimacionesScroll() {
        const observador = new IntersectionObserver((entradas, observer) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('show');
                    observer.unobserve(entrada.target); // Optimización: dejar de observar el elemento visible.
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.hidden').forEach(el => observador.observe(el));
    }

    function configurarAnimacionContadores() {
        const elementosContador = document.querySelectorAll('.animated-counter');
        if (elementosContador.length === 0) return;

        const observador = new IntersectionObserver((entradas, observer) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    const contador = entrada.target;
                    const valorObjetivo = parseInt(contador.dataset.count, 10);
                    animarContador(contador, valorObjetivo);
                    observer.unobserve(contador);
                }
            });
        }, { threshold: 0.8 });

        elementosContador.forEach(el => observador.observe(el));
    }

    function animarContador(elemento, objetivo) {
        let valorActual = 0;
        const duracion = 2000;
        const pasoTiempo = 16; 
        const incremento = objetivo / (duracion / pasoTiempo);

        const actualizar = () => {
            valorActual += incremento;
            if (valorActual < objetivo) {
                elemento.textContent = Math.floor(valorActual).toLocaleString('es-CL');
                requestAnimationFrame(actualizar);
            } else {
                elemento.textContent = objetivo.toLocaleString('es-CL');
            }
        };
        requestAnimationFrame(actualizar);
    }

    // ==========================================
    // SISTEMA DE FILTROS POR CSS
    // ==========================================
    function configurarFiltrosRecursos() {
        const botones = document.querySelectorAll('.filter-btn');
        botones.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const filtro = e.currentTarget.dataset.filter;

                // Actualizar botón activo
                botones.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');

                // Aplicar filtro a los elementos
                document.querySelectorAll('.resource-item').forEach(item => {
                    const categorias = item.dataset.category || '';
                    const debeMostrar = filtro === 'all' || categorias.includes(filtro);
                    item.classList.toggle('resource-hidden', !debeMostrar);
                });
            });
        });
    }

    // ==========================================
    // VALIDACIÓN DE FORMULARIO DE CONTACTO
    // ==========================================
    function configurarValidacionFormulario() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (form.checkValidity()) {
                mostrarNotificacion('¡Gracias! Tu mensaje ha sido enviado.', 'success');
                form.reset();
                form.classList.remove('was-validated');
            } else {
                form.classList.add('was-validated');
            }
        });
    }

    // ==========================================
    // MODALES Y DESCARGAS
    // ==========================================
    function configurarModales() {
        document.querySelectorAll('[data-bs-target="#resourceModal"]').forEach(boton => {
             boton.addEventListener('click', () => {
                const tipoRecurso = boton.dataset.resource;
                const titulo = boton.closest('.card-ucsc')?.querySelector('h5')?.textContent || 'Recurso';
                const modalTitle = document.getElementById('resourceModalLabel');
                const modalContent = document.getElementById('resourceContent');
                
                if (modalTitle) modalTitle.textContent = titulo;
                if (modalContent) modalContent.innerHTML = `<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>`;
                
                setTimeout(() => {
                    if(modalContent) modalContent.innerHTML = generarContenidoModal(tipoRecurso);
                }, 300);
             });
        });
    }

    function generarContenidoModal(tipo) {
        const contenidos = {
         infografias: `<div class="alert alert-info">Contenido de infografía sobre derechos educativos.</div>`,
         audio: `<div class="alert alert-success">Contenido de audio sobre ajustes razonables.</div>`,
         videos: `<div class="alert alert-warning">Contenido de video con Lengua de Señas.</div>`,
         default: `<div class="alert alert-secondary">Este recurso estará disponible próximamente.</div>`
        };
        return contenidos[tipo] || contenidos.default;
    }

    function configurarDescargas() {
        document.getElementById('downloadLenguaje')?.addEventListener('click', () => mostrarNotificacion('Iniciando descarga de Guía de Lenguaje Inclusivo', 'info'));
        document.getElementById('downloadNormativa')?.addEventListener('click', () => mostrarNotificacion('Iniciando descarga de Normativa Completa', 'info'));
    }

    // ==========================================
    // SISTEMA DE NOTIFICACIONES CON CSS
    // ==========================================
    function mostrarNotificacion(mensaje, tipo = 'info') {
        const container = document.body;
        const elemento = document.createElement('div');
        
        elemento.className = `custom-notification notification-${tipo}`;
        elemento.setAttribute('role', 'alert');
        elemento.innerHTML = `<span>${mensaje}</span><button type="button" class="btn-close-notif">&times;</button>`;
        
        container.appendChild(elemento);

        setTimeout(() => elemento.classList.add('show'), 10);

        elemento.querySelector('.btn-close-notif').addEventListener('click', () => {
            elemento.classList.remove('show');
            elemento.addEventListener('transitionend', () => elemento.remove());
        });

        setTimeout(() => {
            elemento.classList.remove('show');
            elemento.addEventListener('transitionend', () => elemento.remove());
        }, 5000);
    }

})();