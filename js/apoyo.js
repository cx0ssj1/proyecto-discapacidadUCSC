$(document).ready(function() {
    // Inicializar todas las funcionalidades con un pequeño delay
    setTimeout(() => {
        inicializarAnimacionesScroll();
        inicializarFuncionalidadFiltros();
        inicializarFuncionalidadBusqueda();
    }, 300); // Reducido de 500ms a 300ms
});

// ==========================================
// ANIMACIONES DE SCROLL
// ==========================================

function inicializarAnimacionesScroll() {
    // Configuración optimizada del observer
    const opciones = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('show');
                // Dejar de observar el elemento una vez que se muestra
                observador.unobserve(entrada.target);
            }
        });
    }, opciones);

    // Observar todos los elementos ocultos
    document.querySelectorAll('.hidden').forEach(elemento => {
        observador.observe(elemento);
    });
}

// ==========================================
// FUNCIONALIDAD DE BÚSQUEDA
// ==========================================

function inicializarFuncionalidadBusqueda() {
    const $campoBusqueda = $('#searchInput');
    const $botonBusqueda = $('#searchBtn');
    
    if (!$campoBusqueda.length) return; // Verificar que el elemento existe
    
    // Búsqueda en tiempo real con debounce optimizado
    $campoBusqueda.on('input', retrasarEjecucion(realizarBusqueda, 250));
    
    // Búsqueda al hacer clic en el botón
    $botonBusqueda.on('click', realizarBusqueda);
    
    // Búsqueda al presionar Enter
    $campoBusqueda.on('keypress', function(evento) {
        if (evento.which === 13) {
            evento.preventDefault();
            realizarBusqueda();
        }
    });
}

function realizarBusqueda() {
    const terminoBusqueda = $('#searchInput').val().toLowerCase().trim();
    const $elementosRecurso = $('.resource-item');
    
    if (!$elementosRecurso.length) return; // Verificar que existen elementos
    
    if (terminoBusqueda === '') {
        mostrarTodosElementos($elementosRecurso);
        return;
    }
    
    const elementosVisibles = filtrarElementosPorBusqueda($elementosRecurso, terminoBusqueda);
    actualizarContadorResultados(elementosVisibles);
    
    // Scroll suave optimizado
    if (terminoBusqueda !== '') {
        desplazarseASección('#instituciones');
    }
}

function mostrarTodosElementos($elementos) {
    $elementos.removeClass('filtered-out').fadeIn(200);
    actualizarContadorResultados($elementos.length);
}

function filtrarElementosPorBusqueda($elementos, termino) {
    let contadorVisible = 0;
    
    $elementos.each(function() {
        const $elemento = $(this);
        const textoElemento = obtenerTextoElemento($elemento);
        
        if (textoElemento.includes(termino)) {
            mostrarElementoConAnimacion($elemento);
            contadorVisible++;
        } else {
            ocultarElemento($elemento);
        }
    });
    
    return contadorVisible;
}

function obtenerTextoElemento($elemento) {
    // Cache del texto para mejor rendimiento
    let texto = $elemento.data('texto-busqueda');
    if (!texto) {
        texto = $elemento.text().toLowerCase();
        $elemento.data('texto-busquedad', texto);
    }
    return texto;
}

function mostrarElementoConAnimacion($elemento) {
    $elemento.removeClass('filtered-out').fadeIn(200, function() {
        $(this).addClass('highlight-result');
        setTimeout(() => {
            $(this).removeClass('highlight-result');
        }, 1500); // Reducido de 2000ms
    });
}

function ocultarElemento($elemento) {
    $elemento.addClass('filtered-out').fadeOut(200);
}

function actualizarContadorResultados(cantidad) {
    const $contadorAnterior = $('.search-results-count');
    $contadorAnterior.remove();
    
    const valorBusqueda = $('#searchInput').val().trim();
    if (valorBusqueda !== '') {
        mostrarContadorResultados(cantidad);
    }
}

function mostrarContadorResultados(cantidad) {
    const textoPlural = cantidad !== 1 ? 's' : '';
    const htmlContador = `
        <div class="search-results-count text-center mt-3 animate__animated animate__fadeIn">
            <small class="text-muted">
                <i class="fas fa-search me-1"></i>
                ${cantidad === 0 ? 'No se encontraron resultados' : `Se encontraron ${cantidad} resultado${textoPlural}`}
            </small>
        </div>
    `;
    $('.search-box').after(htmlContador);
}

// ==========================================
// FUNCIONALIDAD DE FILTROS
// ==========================================

function inicializarFuncionalidadFiltros() {
    const $botonesFiltro = $('.filter-btn');
    
    if (!$botonesFiltro.length) return;
    
    $botonesFiltro.on('click', function(evento) {
        evento.preventDefault();
        const $boton = $(this);
        const filtro = $boton.data('filter');
        
        if ($boton.hasClass('active')) return; // Evitar procesar el mismo filtro
        
        actualizarBotonesActivos($boton);
        aplicarFiltro(filtro);
        limpiarBusqueda();
    });
}

function actualizarBotonesActivos($botonActivo) {
    $('.filter-btn').removeClass('active');
    $botonActivo.addClass('active');
}

function aplicarFiltro(filtro) {
    const $elementosRecurso = $('.resource-item');
    
    if (!$elementosRecurso.length) return;
    
    if (filtro === 'all') {
        $elementosRecurso.removeClass('filtered-out').fadeIn(200);
    } else {
        filtrarElementosPorCategoria($elementosRecurso, filtro);
    }
    
    // Scroll suave con delay mínimo
    setTimeout(() => desplazarseASección('#instituciones'), 50);
}

function filtrarElementosPorCategoria($elementos, categoria) {
    $elementos.each(function() {
        const $elemento = $(this);
        const categorias = $elemento.data('category') || '';
        
        if (categorias.toString().includes(categoria)) {
            $elemento.removeClass('filtered-out').fadeIn(200);
        } else {
            $elemento.addClass('filtered-out').fadeOut(200);
        }
    });
}

function limpiarBusqueda() {
    $('#searchInput').val('');
    $('.search-results-count').remove();
}

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================

function desplazarseASección(selector) {
    const $seccion = $(selector);
    if ($seccion.length) {
        $('html, body').animate({
            scrollTop: $seccion.offset().top - 80 // Reducido de 100px
        }, 600); // Reducido de 800ms
    }
}

function retrasarEjecucion(funcion, retraso) {
    let temporizador;
    return function(...argumentos) {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => funcion.apply(this, argumentos), retraso);
    };
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Remover notificaciones anteriores con animación
    $('.notification').fadeOut(200, function() {
        $(this).remove();
    });
    
    const configuracionIconos = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const configuracionColores = {
        success: 'alert-success',
        error: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info'
    };
    
    const $notificacion = $(`
        <div class="notification alert ${configuracionColores[tipo]} alert-dismissible fade position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px; display: none;">
            <i class="${configuracionIconos[tipo]} me-2"></i>
            <span>${mensaje}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `);
    
    $('body').append($notificacion);
    $notificacion.fadeIn(300).addClass('show');
    
    // Auto-ocultar con animación mejorada
    setTimeout(() => {
        $notificacion.fadeOut(300, function() {
            $(this).remove();
        });
    }, 4000); // Reducido de 5000ms
}

// ==========================================
// FUNCIONES PARA DESCARGA (COMENTADAS)
// ==========================================

/*
function iniciarDescarga(tituloDocumento) {
    mostrarNotificacion('Descarga iniciada: ' + tituloDocumento, 'success');
    
    // Ejemplo de implementación real:
    const urlDescarga = obtenerUrlDescarga(tituloDocumento);
    const enlace = document.createElement('a');
    enlace.href = urlDescarga;
    enlace.download = tituloDocumento + '.pdf';
    enlace.style.display = 'none';
    
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

function obtenerUrlDescarga(titulo) {
    // Lógica para obtener la URL de descarga basada en el título
    return `/downloads/${encodeURIComponent(titulo)}.pdf`;
}
*/