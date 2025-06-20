(function($) {
    $(document).ready(function() {
        inicializarAnimacionesScroll();
        inicializarFuncionalidadBusqueda();
        inicializarFuncionalidadFiltros();
    });

    // ==========================================
    // ANIMACIONES DE SCROLL
    // ==========================================
    function inicializarAnimacionesScroll() {
        const observador = new IntersectionObserver((entradas, observer) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('show');
                    observer.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.hidden').forEach(el => observador.observe(el));
    }

    // ==========================================
    // FUNCIONALIDAD DE BÚSQUEDA
    // ==========================================
    function inicializarFuncionalidadBusqueda() {
        const $campoBusqueda = $('#searchInput');
        if (!$campoBusqueda.length) return;

        const realizarBusquedaDebounced = retrasarEjecucion(realizarBusqueda, 300);
        
        $campoBusqueda.on('input', realizarBusquedaDebounced);
        $('#searchBtn').on('click', realizarBusqueda);
        $campoBusqueda.on('keypress', (e) => {
            if (e.which === 13) {
                e.preventDefault();
                realizarBusqueda();
            }
        });
    }

    function realizarBusqueda() {
        const termino = $('#searchInput').val().toLowerCase().trim();
        const $items = $('.resource-item');

        if (termino === '') {
            $items.removeClass('filtered-out').stop(true, true).fadeIn(300);
            $('.search-results-count').remove();
            return;
        }

        let contadorVisible = 0;
        $items.each(function() {
            const $item = $(this);
            let textoCacheado = $item.data('texto-busqueda');
            if (!textoCacheado) {
                textoCacheado = $item.text().toLowerCase();
                $item.data('texto-busqueda', textoCacheado);
            }

            if (textoCacheado.includes(termino)) {
                $item.removeClass('filtered-out').stop(true, true).fadeIn(300);
                contadorVisible++;
            } else {
                $item.addClass('filtered-out').stop(true, true).fadeOut(300);
            }
        });

        actualizarContadorResultados(contadorVisible);
    }

    function actualizarContadorResultados(cantidad) {
        $('.search-results-count').remove();
        const textoPlural = cantidad !== 1 ? 's' : '';
        const htmlContador = `
            <div class="search-results-count text-center mt-3 animate__animated animate__fadeIn" role="status" aria-live="polite">
                <small class="text-muted">
                    <i class="fas fa-search me-1"></i>
                    ${cantidad === 0 ? 'No se encontraron resultados' : `Se encontraron ${cantidad} resultado${textoPlural}`}
                </small>
            </div>`;
        $('.search-box').after(htmlContador);
    }

    // ==========================================
    // FUNCIONALIDAD DE FILTROS
    // ==========================================
    function inicializarFuncionalidadFiltros() {
        const $botonesFiltro = $('.filter-btn');
        $botonesFiltro.on('click', function(e) {
            e.preventDefault();
            const $boton = $(this);
            if ($boton.hasClass('active')) return;

            $botonesFiltro.removeClass('active');
            $boton.addClass('active');

            const filtro = $boton.data('filter');
            aplicarFiltro(filtro);
            
            // Limpiar la búsqueda al aplicar un filtro
            $('#searchInput').val('');
        });
    }

    function aplicarFiltro(filtro) {
        const $items = $('.resource-item');
        $('.search-results-count').remove(); // Limpiar contador de búsqueda

        if (filtro === 'all') {
            $items.removeClass('filtered-out').stop(true, true).fadeIn(300);
        } else {
            $items.each(function() {
                const $item = $(this);
                const categorias = $item.data('category') || '';
                if (categorias.toString().includes(filtro)) {
                    $item.removeClass('filtered-out').stop(true, true).fadeIn(300);
                } else {
                    $item.addClass('filtered-out').stop(true, true).fadeOut(300);
                }
            });
        }
    }

    // ==========================================
    // FUNCIONES DE UTILIDAD
    // ==========================================

    // Función Debounce: retrasa la ejecución de una función hasta que el usuario deja de escribir.
    function retrasarEjecucion(funcion, retraso) {
        let temporizador;
        return function(...args) {
            clearTimeout(temporizador);
            temporizador = setTimeout(() => funcion.apply(this, args), retraso);
        };
    }
    
})(jQuery); 