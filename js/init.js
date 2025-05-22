

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Verificar visibilidad inicial
    
    setupFilters();
    setupFormValidation();
    setupAccessibilityTools();
    setupResourceModals();
    
    const observer = new IntersectionObserver((entries) => {
        animateCounters();
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