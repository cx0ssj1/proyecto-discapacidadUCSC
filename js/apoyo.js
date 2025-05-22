// ==========================================
// SCRIPT PRINCIPAL PARA PÁGINA DE APOYO
// ==========================================

$(document).ready(function() {
    console.log('Script de apoyo cargado');
    
    // Inicializar todas las funcionalidades
    initScrollAnimations();
    initSearchFunctionality();
    initFilterFunctionality();
    initDownloadModals();
    initCounterAnimations();
    initSmoothScrolling();
    
    // Mostrar elementos con delay
    setTimeout(() => {
        showElementsSequentially();
    }, 500);
});

// ==========================================
// ANIMACIONES DE SCROLL
// ==========================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Si es un contador, iniciarlo
                if (entry.target.classList.contains('animated-counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    });

    // Observar todos los elementos ocultos
    document.querySelectorAll('.hidden').forEach(el => {
        observer.observe(el);
    });
}

function showElementsSequentially() {
    const hiddenElements = document.querySelectorAll('.hidden');
    
    hiddenElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('show');
        }, index * 100);
    });
}

// ==========================================
// FUNCIONALIDAD DE BÚSQUEDA
// ==========================================

function initSearchFunctionality() {
    const searchInput = $('#searchInput');
    const searchBtn = $('#searchBtn');
    
    // Búsqueda en tiempo real
    searchInput.on('input', debounce(performSearch, 300));
    
    // Búsqueda al hacer clic en el botón
    searchBtn.on('click', performSearch);
    
    // Búsqueda al presionar Enter
    searchInput.on('keypress', function(e) {
        if (e.which === 13) {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = $('#searchInput').val().toLowerCase().trim();
    const resourceItems = $('.resource-item');
    
    if (searchTerm === '') {
        // Mostrar todos los elementos
        resourceItems.removeClass('filtered-out').fadeIn(300);
        updateResultsCount(resourceItems.length);
        return;
    }
    
    let visibleCount = 0;
    
    resourceItems.each(function() {
        const $item = $(this);
        const text = $item.text().toLowerCase();
        
        if (text.includes(searchTerm)) {
            $item.removeClass('filtered-out').fadeIn(300, function() {
                $(this).addClass('highlight-result');
                setTimeout(() => {
                    $(this).removeClass('highlight-result');
                }, 2000);
            });
            visibleCount++;
        } else {
            $item.addClass('filtered-out').fadeOut(300);
        }
    });
    
    updateResultsCount(visibleCount);
    
    // Scroll suave a los resultados si hay búsqueda
    if (searchTerm !== '') {
        $('html, body').animate({
            scrollTop: $('#instituciones').offset().top - 100
        }, 800);
    }
}

function updateResultsCount(count) {
    // Remover contador anterior si existe
    $('.search-results-count').remove();
    
    // Añadir nuevo contador
    if ($('#searchInput').val().trim() !== '') {
        const countHtml = `
            <div class="search-results-count text-center mt-3">
                <small class="text-muted">
                    <i class="fas fa-search me-1"></i>
                    Se encontraron ${count} resultado${count !== 1 ? 's' : ''}
                </small>
            </div>
        `;
        $('.search-box').after(countHtml);
    }
}

// ==========================================
// FUNCIONALIDAD DE FILTROS
// ==========================================

function initFilterFunctionality() {
    $('.filter-btn').on('click', function() {
        const $btn = $(this);
        const filter = $btn.data('filter');
        
        // Actualizar botones activos
        $('.filter-btn').removeClass('active');
        $btn.addClass('active');
        
        // Aplicar filtro
        applyFilter(filter);
        
        // Limpiar búsqueda
        $('#searchInput').val('');
        $('.search-results-count').remove();
    });
}

function applyFilter(filter) {
    const resourceItems = $('.resource-item');
    
    if (filter === 'all') {
        resourceItems.removeClass('filtered-out').fadeIn(300);
    } else {
        resourceItems.each(function() {
            const $item = $(this);
            const categories = $item.data('category') || '';
            
            if (categories.includes(filter)) {
                $item.removeClass('filtered-out').fadeIn(300);
            } else {
                $item.addClass('filtered-out').fadeOut(300);
            }
        });
    }
    
    // Scroll suave a la sección de instituciones
    setTimeout(() => {
        $('html, body').animate({
            scrollTop: $('#instituciones').offset().top - 100
        }, 800);
    }, 100);
}

// ==========================================
// MODALES DE DESCARGA
// ==========================================

function initDownloadModals() {
    $('.download-btn').on('click', function(e) {
        e.preventDefault();
        
        const $btn = $(this);
        const $card = $btn.closest('.download-card');
        const documentTitle = $card.find('h6').text();
        
        // Actualizar modal con información del documento
        $('#downloadModalLabel').text('Descarga: ' + documentTitle);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('downloadModal'));
        modal.show();
        
        // Configurar botón de descarga en el modal
        $('.modal .btn-ucsc').off('click').on('click', function() {
            initiateDownload(documentTitle);
            modal.hide();
        });
    });
}

function initiateDownload(documentTitle) {
    // Simular descarga (en un caso real, aquí iría la URL del documento)
    showNotification('Descarga iniciada: ' + documentTitle, 'success');
    
    // Ejemplo de descarga real (descomenta y ajusta según tus necesidades):
    /*
    const downloadUrl = getDownloadUrl(documentTitle);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = documentTitle + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    */
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Remover notificaciones anteriores
    $('.notification').remove();
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const colorMap = {
        success: 'alert-success',
        error: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info'
    };
    
    const notification = $(`
        <div class="notification alert ${colorMap[type]} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="${iconMap[type]} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(notification);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        notification.alert('close');
    }, 5000);
}

// ==========================================
// EFECTOS ADICIONALES
// ==========================================

// Efecto parallax suave en hero
$(window).on('scroll', function() {
    const scrolled = $(this).scrollTop();
    const parallax = $('.hero-section');
    const speed = 0.5;
    
    parallax.css('transform', `translateY(${scrolled * speed}px)`);
});

// Highlight en hover para tarjetas de recursos
$('.resource-link-card, .download-card').on('mouseenter', function() {
    $(this).addClass('shadow-lg');
}).on('mouseleave', function() {
    $(this).removeClass('shadow-lg');
});

// ==========================================
// ACCESIBILIDAD MEJORADA
// ==========================================

// Navegación por teclado en filtros
$('.filter-btn').on('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).click();
    }
});

// Navegación por teclado en botones de descarga
$('.download-btn').on('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).click();
    }
});

// Anunciar cambios para lectores de pantalla
function announceToScreenReader(message) {
    const announcement = $('<div>', {
        'aria-live': 'polite',
        'aria-atomic': 'true',
        'class': 'sr-only'
    }).text(message);
    
    $('body').append(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}