
// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Verificar visibilidad inicial
    
    setupDraggableAccessibilityBar();
    setupFilters();
    setupFormValidation();
    setupAccessibilityTools();
    setupResourceModals();
    
    // Iniciar animación de contadores cuando la sección sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.counter-box').forEach(box => {
        observer.observe(box);
    });
});

// Para el modal de normativa y lenguaje
document.querySelectorAll('[data-bs-target="#normativaModal"], [data-bs-target="#lenguajeModal"]').forEach(button => {
    button.addEventListener('click', () => {
        setupResourceModals()
    });
});

// Simulación de descarga
document.getElementById('downloadLenguaje')?.addEventListener('click', function() {
    alert('Descargando guía de lenguaje inclusivo...');
});

document.getElementById('downloadNormativa')?.addEventListener('click', function() {
    alert('Descargando documento de normativa completa...');
});