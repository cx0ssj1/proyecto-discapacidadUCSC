$(document).ready(function() {
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

// Animación de contadores
function animateCounters() {
    const counterElements = document.querySelectorAll('.animated-counter');
    
    counterElements.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // ms
        const increment = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// Animaciones de scroll
function checkVisibility() {
    const hiddenElements = document.querySelectorAll('.hidden');
    const windowHeight = window.innerHeight;
    
    hiddenElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        if (elementPosition < windowHeight - 50) {
            element.classList.add('show');
        }
    });
}

// Filtro de recursos
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Toggle active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            document.querySelectorAll('.resource-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category').includes(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Validación de formularios
function setupFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Aquí iría el código para procesar el formulario
                event.preventDefault();
                alert('¡Gracias! Tu mensaje ha sido enviado correctamente.');
                form.reset();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

// Cargar recursos
function setupResourceModals() {
    const resourceButtons = document.querySelectorAll('[data-bs-target="#resourceModal"]');
    
    resourceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const resourceType = button.getAttribute('data-resource');
            const resourceTitle = button.closest('.card-ucsc').querySelector('h5').textContent;
            
            // Actualizar título del modal
            document.getElementById('resourceModalLabel').textContent = resourceTitle;
            
            // Simulación de carga de contenido basado en el tipo de recurso
            let content = '';
            switch(resourceType) {
                case 'infografias':
                    content = '<img src="https://via.placeholder.com/800x400?text=Infografía+Legal" class="img-fluid mb-3" alt="Infografía Legal">';
                    content += '<p>Esta infografía explica los derechos educativos principales para estudiantes con discapacidad según la ley chilena.</p>';
                    break;
                case 'audio':
                    content = '<audio controls class="w-100 mb-3"><source src="#" type="audio/mpeg">Tu navegador no soporta audio HTML5.</audio>';
                    content += '<p>Audio explicativo sobre los ajustes razonables en educación superior.</p>';
                    break;
                case 'videos':
                    content = '<div class="ratio ratio-16x9 mb-3"><iframe src="https://via.placeholder.com/560x315?text=Video+con+LSCh" title="Video con lengua de señas" allowfullscreen></iframe></div>';
                    content += '<p>Video explicativo con interpretación en Lengua de Señas Chilena sobre derechos educativos.</p>';
                    break;
                default:
                    content = '<div class="text-center py-5"><i class="fas fa-spinner fa-spin fa-3x"></i><p class="mt-3">Cargando recurso...</p></div>';
            }
            
            document.getElementById('resourceContent').innerHTML = content;
        });
    });
}


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