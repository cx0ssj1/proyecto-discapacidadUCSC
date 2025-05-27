$(document).ready(function() {
    // Inicialización principal
    inicializar();
});

// ==========================================
// INICIALIZACIÓN PRINCIPAL
// ==========================================

function inicializar() {
    // Configurar observadores y eventos inmediatamente
    configurarObservadorVisibilidad();
    configurarObservadorContadores();
    verificarVisibilidadInicial();
    
    // Inicializar funcionalidades con delay mínimo
    setTimeout(() => {
        configurarFiltros();
        configurarValidacionFormularios();
        configurarModalesRecursos();
        configurarBotonesDescarga();
    }, 200); // Reducido de 500ms
}

// ==========================================
// ANIMACIONES DE VISIBILIDAD
// ==========================================

function configurarObservadorVisibilidad() {
    const opciones = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('show');
                observador.unobserve(entrada.target); // Optimización
            }
        });
    }, opciones);
    
    // Observar elementos ocultos
    document.querySelectorAll('.hidden').forEach(elemento => {
        observador.observe(elemento);
    });
}

function verificarVisibilidadInicial() {
    const elementosOcultos = document.querySelectorAll('.hidden');
    const alturaVentana = window.innerHeight;
    
    elementosOcultos.forEach(elemento => {
        const posicionElemento = elemento.getBoundingClientRect().top;
        if (posicionElemento < alturaVentana - 50) {
            elemento.classList.add('show');
        }
    });
}

// ==========================================
// ANIMACIÓN DE CONTADORES
// ==========================================

function configurarObservadorContadores() {
    const opciones = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                animarContadores();
                observador.unobserve(entrada.target); // Ejecutar solo una vez
            }
        });
    }, opciones);
    
    const cajasContador = document.querySelectorAll('.counter-box');
    cajasContador.forEach(caja => {
        observador.observe(caja);
    });
}

function animarContadores() {
    const elementosContador = document.querySelectorAll('.animated-counter');
    
    elementosContador.forEach(contador => {
        const valorObjetivo = parseInt(contador.getAttribute('data-count'));
        
        // Verificar si ya fue animado
        if (contador.dataset.animado === 'true') return;
        contador.dataset.animado = 'true';
        
        animarContadorIndividual(contador, valorObjetivo);
    });
}

function animarContadorIndividual(elemento, objetivo) {
    const duracion = 2000; // ms
    const incremento = objetivo / (duracion / 16);
    let actual = 0;
    
    const actualizarContador = () => {
        actual += incremento;
        if (actual < objetivo) {
            elemento.textContent = Math.floor(actual).toLocaleString('es-ES');
            requestAnimationFrame(actualizarContador);
        } else {
            elemento.textContent = objetivo.toLocaleString('es-ES');
        }
    };
    
    actualizarContador();
}

// ==========================================
// SISTEMA DE FILTROS
// ==========================================

function configurarFiltros() {
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    
    if (!botonesFiltro.length) return;
    
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', manejarClickFiltro);
    });
}

function manejarClickFiltro(evento) {
    evento.preventDefault();
    
    const boton = evento.currentTarget;
    const filtro = boton.getAttribute('data-filter');
    
    // Evitar procesar el mismo filtro activo
    if (boton.classList.contains('active')) return;
    
    actualizarEstadoBotonesFiltro(boton);
    aplicarFiltroRecursos(filtro);
}

function actualizarEstadoBotonesFiltro(botonActivo) {
    document.querySelectorAll('.filter-btn').forEach(boton => {
        boton.classList.remove('active');
    });
    botonActivo.classList.add('active');
}

function aplicarFiltroRecursos(filtro) {
    const elementosRecursos = document.querySelectorAll('.resource-item');
    
    elementosRecursos.forEach(elemento => {
        const categorias = elemento.getAttribute('data-category') || '';
        const debesMostrar = filtro === 'all' || categorias.includes(filtro);
        
        if (debesMostrar) {
            mostrarElementoConAnimacion(elemento);
        } else {
            ocultarElementoConAnimacion(elemento);
        }
    });
}

function mostrarElementoConAnimacion(elemento) {
    elemento.style.display = 'block';
    elemento.style.opacity = '0';
    elemento.style.transform = 'translateY(20px)';
    
    // Animación suave
    elemento.style.transition = 'all 0.3s ease';
    requestAnimationFrame(() => {
        elemento.style.opacity = '1';
        elemento.style.transform = 'translateY(0)';
    });
}

function ocultarElementoConAnimacion(elemento) {
    elemento.style.transition = 'all 0.3s ease';
    elemento.style.opacity = '0';
    elemento.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 300);
}

// ==========================================
// VALIDACIÓN DE FORMULARIOS
// ==========================================

function configurarValidacionFormularios() {
    const formularios = document.querySelectorAll('.needs-validation');
    
    Array.from(formularios).forEach(formulario => {
        formulario.addEventListener('submit', manejarEnvioFormulario);
    });
}

function manejarEnvioFormulario(evento) {
    const formulario = evento.currentTarget;
    
    evento.preventDefault();
    evento.stopPropagation();
    
    if (formulario.checkValidity()) {
        procesarFormularioValido(formulario);
    } else {
        mostrarErroresValidacion(formulario);
    }
    
    formulario.classList.add('was-validated');
}

function procesarFormularioValido(formulario) {
    mostrarNotificacionExito('¡Gracias! Tu mensaje ha sido enviado correctamente.');
    formulario.reset();
    formulario.classList.remove('was-validated');
}

function mostrarErroresValidacion(formulario) {
    const camposInvalidos = formulario.querySelectorAll(':invalid');
    if (camposInvalidos.length > 0) {
        camposInvalidos[0].focus(); // Enfocar el primer campo inválido
    }
}

// ==========================================
// MODALES DE RECURSOS
// ==========================================

function configurarModalesRecursos() {
    const botonesRecursos = document.querySelectorAll('[data-bs-target="#resourceModal"]');
    const botonesNormativa = document.querySelectorAll('[data-bs-target="#normativaModal"]');
    const botonesLenguaje = document.querySelectorAll('[data-bs-target="#lenguajeModal"]');
    
    botonesRecursos.forEach(boton => {
        boton.addEventListener('click', () => manejarClickRecurso(boton));
    });
    
    botonesNormativa.forEach(boton => {
        boton.addEventListener('click', () => cargarContenidoNormativa());
    });
    
    botonesLenguaje.forEach(boton => {
        boton.addEventListener('click', () => cargarContenidoLenguaje());
    });
}

function manejarClickRecurso(boton) {
    const tipoRecurso = boton.getAttribute('data-resource');
    const tarjeta = boton.closest('.card-ucsc');
    const tituloRecurso = tarjeta ? tarjeta.querySelector('h5')?.textContent : 'Recurso';
    
    actualizarTituloModal('resourceModalLabel', tituloRecurso);
    cargarContenidoRecurso(tipoRecurso);
}

function actualizarTituloModal(idModal, titulo) {
    const elementoTitulo = document.getElementById(idModal);
    if (elementoTitulo) {
        elementoTitulo.textContent = titulo;
    }
}

function cargarContenidoRecurso(tipo) {
    const contenedorContenido = document.getElementById('resourceContent');
    if (!contenedorContenido) return;
    
    // Mostrar indicador de carga
    mostrarIndicadorCarga(contenedorContenido);
    
    setTimeout(() => {
        const contenido = generarContenidoSegunTipo(tipo);
        contenedorContenido.innerHTML = contenido;
    }, 500);
}

function mostrarIndicadorCarga(contenedor) {
    contenedor.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando recurso...</p>
        </div>
    `;
}

function generarContenidoSegunTipo(tipo) {
    const contenidos = {
        infografias: `
            <div class="text-center mb-3">
                <img src="https://via.placeholder.com/800x400/0066cc/ffffff?text=Infografía+Legal" 
                     class="img-fluid rounded shadow" alt="Infografía Legal">
            </div>
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Esta infografía explica los derechos educativos principales para estudiantes con discapacidad según la ley chilena.
            </div>
        `,
        audio: `
            <div class="mb-3">
                <audio controls class="w-100">
                    <source src="#" type="audio/mpeg">
                    Tu navegador no soporta audio HTML5.
                </audio>
            </div>
            <div class="alert alert-success">
                <i class="fas fa-volume-up me-2"></i>
                Audio explicativo sobre los ajustes razonables en educación superior.
            </div>
        `,
        videos: `
            <div class="ratio ratio-16x9 mb-3">
                <iframe src="https://via.placeholder.com/560x315/cc0000/ffffff?text=Video+con+LSCh" 
                        title="Video con lengua de señas" 
                        class="rounded"
                        allowfullscreen></iframe>
            </div>
            <div class="alert alert-warning">
                <i class="fas fa-sign-language me-2"></i>
                Video explicativo con interpretación en Lengua de Señas Chilena sobre derechos educativos.
            </div>
        `
    };
    
    return contenidos[tipo] || `
        <div class="alert alert-secondary text-center">
            <i class="fas fa-file-alt fa-3x mb-3"></i>
            <h5>Recurso en preparación</h5>
            <p>Este contenido estará disponible próximamente.</p>
        </div>
    `;
}

function cargarContenidoNormativa() {
    // Lógica específica para modal de normativa
    console.log('Cargando contenido de normativa...');
}

function cargarContenidoLenguaje() {
    // Lógica específica para modal de lenguaje
    console.log('Cargando contenido de lenguaje inclusivo...');
}

// ==========================================
// SISTEMA DE DESCARGAS
// ==========================================

function configurarBotonesDescarga() {
    const botonLenguaje = document.getElementById('downloadLenguaje');
    const botonNormativa = document.getElementById('downloadNormativa');
    
    if (botonLenguaje) {
        botonLenguaje.addEventListener('click', () => {
            iniciarDescarga('Guía de Lenguaje Inclusivo', 'lenguaje-inclusivo.pdf');
        });
    }
    
    if (botonNormativa) {
        botonNormativa.addEventListener('click', () => {
            iniciarDescarga('Normativa Completa', 'normativa-completa.pdf');
        });
    }
}

function iniciarDescarga(nombreArchivo, rutaArchivo) {
    mostrarNotificacionInfo(`Iniciando descarga: ${nombreArchivo}`);
    
    // Simulación de descarga 
    setTimeout(() => {
        mostrarNotificacionExito(`Descarga completada: ${nombreArchivo}`);
    }, 2000);
    
    // Implementación real de descarga:
    /*
    const enlace = document.createElement('a');
    enlace.href = `/descargas/${rutaArchivo}`;
    enlace.download = nombreArchivo;
    enlace.style.display = 'none';
    
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    */
}

// ==========================================
// SISTEMA DE NOTIFICACIONES
// ==========================================

function mostrarNotificacionExito(mensaje) {
    mostrarNotificacion(mensaje, 'success');
}

function mostrarNotificacionInfo(mensaje) {
    mostrarNotificacion(mensaje, 'info');
}

function mostrarNotificacionError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Remover notificaciones anteriores
    const notificacionesAnteriores = document.querySelectorAll('.notificacion-temporal');
    notificacionesAnteriores.forEach(notif => notif.remove());
    
    const configuracion = obtenerConfiguracionNotificacion(tipo);
    const elementoNotificacion = crearElementoNotificacion(mensaje, configuracion);
    
    document.body.appendChild(elementoNotificacion);
    
    // Mostrar con animación
    requestAnimationFrame(() => {
        elementoNotificacion.classList.add('show');
    });
    
    // Auto-ocultar
    setTimeout(() => {
        ocultarNotificacion(elementoNotificacion);
    }, 4000);
}

function obtenerConfiguracionNotificacion(tipo) {
    const configuraciones = {
        success: {
            icono: 'fas fa-check-circle',
            clase: 'alert-success',
            color: '#198754'
        },
        error: {
            icono: 'fas fa-exclamation-circle',
            clase: 'alert-danger',
            color: '#dc3545'
        },
        warning: {
            icono: 'fas fa-exclamation-triangle',
            clase: 'alert-warning',
            color: '#ffc107'
        },
        info: {
            icono: 'fas fa-info-circle',
            clase: 'alert-info',
            color: '#0dcaf0'
        }
    };
    
    return configuraciones[tipo] || configuraciones.info;
}

function crearElementoNotificacion(mensaje, config) {
    const elemento = document.createElement('div');
    elemento.className = `notificacion-temporal alert ${config.clase} alert-dismissible fade position-fixed`;
    elemento.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        transform: translateX(100%);
    `;
    
    elemento.innerHTML = `
        <i class="${config.icono} me-2"></i>
        <span class="mensaje-notificacion">${mensaje}</span>
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    return elemento;
}

function ocultarNotificacion(elemento) {
    elemento.style.transform = 'translateX(100%)';
    elemento.style.opacity = '0';
    
    setTimeout(() => {
        if (elemento.parentNode) {
            elemento.remove();
        }
    }, 300);
}