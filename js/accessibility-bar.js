$(document).ready(function() {
    // Inicializar herramientas de accesibilidad con delay reducido
    setTimeout(() => {
        configurarHerramientasAccesibilidad();
    }, 200); // Reducido de 500ms
});

// ==========================================
// CONFIGURACIÓN PRINCIPAL
// ==========================================

function configurarHerramientasAccesibilidad() {
    // Verificar disponibilidad de elementos
    const elementos = obtenerElementosAccesibilidad();
    if (!elementos.algunoDisponible) {
        console.warn('No se encontraron elementos de accesibilidad');
        return;
    }
    
    // Inicializar estado
    const estado = inicializarEstadoAccesibilidad();
    
    // Configurar funcionalidades
    configurarControlTamanoTexto(elementos, estado);
    configurarControlContraste(elementos, estado);
    configurarLectorPantalla(elementos, estado);
    configurarBarraMovible();
    
    // Restaurar configuración guardada
    restaurarConfiguracionUsuario(estado);
}

function obtenerElementosAccesibilidad() {
    const elementos = {
        botonAumentarTexto: document.getElementById('increase-text'),
        botonDisminuirTexto: document.getElementById('decrease-text'),
        botonContraste: document.getElementById('toggle-contrast'),
        botonLeerPagina: document.getElementById('read-page'),
        barraAccesibilidad: document.getElementById('accessibility-bar'),
        contenidoPrincipal: document.getElementById('main-content')
    };
    
    elementos.algunoDisponible = Object.values(elementos).some(el => el !== null);
    
    return elementos;
}

function inicializarEstadoAccesibilidad() {
    return {
        tamanoTextoActual: 100,
        contrasteAltoActivo: false,
        sintesisVoz: window.speechSynthesis,
        leyendoActualmente: false,
        configuracionGuardada: obtenerConfiguracionGuardada()
    };
}

// ==========================================
// CONTROL DE TAMAÑO DE TEXTO
// ==========================================

function configurarControlTamanoTexto(elementos, estado) {
    const { botonAumentarTexto, botonDisminuirTexto } = elementos;
    
    if (botonAumentarTexto) {
        botonAumentarTexto.addEventListener('click', () => {
            aumentarTamanoTexto(estado);
        });
    }
    
    if (botonDisminuirTexto) {
        botonDisminuirTexto.addEventListener('click', () => {
            disminuirTamanoTexto(estado);
        });
    }
}

function aumentarTamanoTexto(estado) {
    const TAMANO_MAXIMO = 200;
    const INCREMENTO = 10;
    
    if (estado.tamanoTextoActual < TAMANO_MAXIMO) {
        estado.tamanoTextoActual += INCREMENTO;
        aplicarTamanoTexto(estado.tamanoTextoActual);
        mostrarNotificacionAccesibilidad(`Tamaño de texto: ${estado.tamanoTextoActual}%`);
        guardarConfiguracion('tamanoTexto', estado.tamanoTextoActual);
    } else {
        mostrarNotificacionAccesibilidad('Tamaño máximo de texto alcanzado', 'warning');
    }
}

function disminuirTamanoTexto(estado) {
    const TAMANO_MINIMO = 50;
    const DECREMENTO = 10;
    
    if (estado.tamanoTextoActual > TAMANO_MINIMO) {
        estado.tamanoTextoActual -= DECREMENTO;
        aplicarTamanoTexto(estado.tamanoTextoActual);
        mostrarNotificacionAccesibilidad(`Tamaño de texto: ${estado.tamanoTextoActual}%`);
        guardarConfiguracion('tamanoTexto', estado.tamanoTextoActual);
    } else {
        mostrarNotificacionAccesibilidad('Tamaño mínimo de texto alcanzado', 'warning');
    }
}

function aplicarTamanoTexto(porcentaje) {
    document.body.style.fontSize = `${porcentaje}%`;
    
    // Aplicar con transición suave
    if (!document.body.style.transition.includes('font-size')) {
        document.body.style.transition += ', font-size 0.3s ease';
    }
}

// ==========================================
// CONTROL DE CONTRASTE
// ==========================================

function configurarControlContraste(elementos, estado) {
    const { botonContraste } = elementos;
    
    if (botonContraste) {
        botonContraste.addEventListener('click', () => {
            alternarContraste(estado, botonContraste);
        });
    }
}

function alternarContraste(estado, boton) {
    estado.contrasteAltoActivo = !estado.contrasteAltoActivo;
    
    aplicarContraste(estado.contrasteAltoActivo);
    actualizarBotonContraste(boton, estado.contrasteAltoActivo);
    
    const mensaje = estado.contrasteAltoActivo ? 
        'Contraste alto activado' : 
        'Contraste normal restaurado';
    
    mostrarNotificacionAccesibilidad(mensaje);
    guardarConfiguracion('contrasteAlto', estado.contrasteAltoActivo);
}

function aplicarContraste(activar) {
    const claseContraste = 'high-contrast';
    
    if (activar) {
        document.body.classList.add(claseContraste);
        aplicarEstilosContrasteAlto();
    } else {
        document.body.classList.remove(claseContraste);
        removerEstilosContrasteAlto();
    }
}

function aplicarEstilosContrasteAlto() {
    // Crear hoja de estilos dinámica si no existe
    let hojaEstilos = document.getElementById('estilos-contraste-alto');
    
    if (!hojaEstilos) {
        hojaEstilos = document.createElement('style');
        hojaEstilos.id = 'estilos-contraste-alto';
        document.head.appendChild(hojaEstilos);
    }
    
    hojaEstilos.textContent = `
        .high-contrast {
            filter: contrast(150%) brightness(120%);
        }
        .high-contrast * {
            border-color: #000 !important;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.8) !important;
        }
    `;
}

function removerEstilosContrasteAlto() {
    const hojaEstilos = document.getElementById('estilos-contraste-alto');
    if (hojaEstilos) {
        hojaEstilos.textContent = '';
    }
}

function actualizarBotonContraste(boton, activo) {
    const icono = boton.querySelector('i');
    const texto = boton.querySelector('.btn-text');
    
    if (activo) {
        boton.classList.add('active');
        if (icono) icono.className = 'fas fa-eye-slash';
        if (texto) texto.textContent = 'Contraste Normal';
    } else {
        boton.classList.remove('active');
        if (icono) icono.className = 'fas fa-eye';
        if (texto) texto.textContent = 'Alto Contraste';
    }
}

// ==========================================
// LECTOR DE PANTALLA
// ==========================================

function configurarLectorPantalla(elementos, estado) {
    const { botonLeerPagina, contenidoPrincipal } = elementos;
    
    if (botonLeerPagina) {
        botonLeerPagina.addEventListener('click', () => {
            manejarLecturaPagina(estado, contenidoPrincipal, botonLeerPagina);
        });
    }
}

function manejarLecturaPagina(estado, contenidoPrincipal, boton) {
    if (!estado.sintesisVoz) {
        mostrarNotificacionAccesibilidad('Tu navegador no soporta síntesis de voz', 'error');
        return;
    }
    
    if (estado.leyendoActualmente) {
        detenerLectura(estado, boton);
    } else {
        iniciarLectura(estado, contenidoPrincipal, boton);
    }
}

function iniciarLectura(estado, contenidoPrincipal, boton) {
    const contenido = obtenerContenidoParaLeer(contenidoPrincipal);
    
    if (!contenido) {
        mostrarNotificacionAccesibilidad('No se encontró contenido para leer', 'warning');
        return;
    }
    
    const locucion = crearLocucion(contenido);
    configurarEventosLocucion(locucion, estado, boton);
    
    estado.sintesisVoz.speak(locucion);
    estado.leyendoActualmente = true;
    actualizarBotonLectura(boton, true);
    
    mostrarNotificacionAccesibilidad('Iniciando lectura de página');
}

function detenerLectura(estado, boton) {
    estado.sintesisVoz.cancel();
    estado.leyendoActualmente = false;
    actualizarBotonLectura(boton, false);
    
    mostrarNotificacionAccesibilidad('Lectura detenida');
}

function obtenerContenidoParaLeer(contenidoPrincipal) {
    if (contenidoPrincipal && contenidoPrincipal.textContent.trim()) {
        return limpiarTextoParaLectura(contenidoPrincipal.textContent);
    }
    
    // Fallback: obtener contenido de elementos principales
    const selectores = ['main', 'article', '.content', '#content', 'body'];
    
    for (const selector of selectores) {
        const elemento = document.querySelector(selector);
        if (elemento && elemento.textContent.trim()) {
            return limpiarTextoParaLectura(elemento.textContent);
        }
    }
    
    return null;
}

function limpiarTextoParaLectura(texto) {
    return texto
        .replace(/\s+/g, ' ') // Normalizar espacios
        .replace(/[^\w\s\.,;:!?¿¡]/g, '') // Remover caracteres especiales
        .trim()
        .substring(0, 5000); // Limitar longitud para mejor rendimiento
}

function crearLocucion(contenido) {
    const locucion = new SpeechSynthesisUtterance(contenido);
    
    // Configurar parámetros de voz
    locucion.lang = 'es-ES';
    locucion.rate = 0.9; // Velocidad ligeramente reducida
    locucion.pitch = 1.0;
    locucion.volume = 0.8;
    
    return locucion;
}

function configurarEventosLocucion(locucion, estado, boton) {
    locucion.onend = () => {
        estado.leyendoActualmente = false;
        actualizarBotonLectura(boton, false);
        mostrarNotificacionAccesibilidad('Lectura completada');
    };
    
    locucion.onerror = (evento) => {
        estado.leyendoActualmente = false;
        actualizarBotonLectura(boton, false);
        mostrarNotificacionAccesibilidad('Error en la lectura de voz', 'error');
        console.error('Error en síntesis de voz:', evento);
    };
}

function actualizarBotonLectura(boton, leyendo) {
    const icono = boton.querySelector('i');
    const texto = boton.querySelector('.btn-text');
    
    if (leyendo) {
        boton.classList.add('active');
        if (icono) icono.className = 'fas fa-stop';
        if (texto) texto.textContent = 'Detener Lectura';
    } else {
        boton.classList.remove('active');
        if (icono) icono.className = 'fas fa-volume-up';
        if (texto) texto.textContent = 'Leer Página';
    }
}

// ==========================================
// BARRA MOVIBLE
// ==========================================

function configurarBarraMovible() {
    const barraAccesibilidad = document.getElementById('accessibility-bar');
    
    if (!barraAccesibilidad) {
        console.info('Barra de accesibilidad no encontrada');
        return;
    }
    
    const manejador = barraAccesibilidad.querySelector('.handle') || 
                    barraAccesibilidad.querySelector('.drag-handle') ||
                    crearManejadorArrastre(barraAccesibilidad);
    
    if (manejador) {
        configurarArrastreRaton(barraAccesibilidad, manejador);
        configurarArrastreTactil(barraAccesibilidad, manejador);
    }
}

function crearManejadorArrastre(barra) {
    const manejador = document.createElement('div');
    manejador.className = 'drag-handle';
    manejador.style.cssText = `
        width: 20px;
        height: 20px;
        background: #666;
        border-radius: 3px;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
    `;
    manejador.innerHTML = '⋮⋮';
    manejador.title = 'Arrastrar para mover';
    
    barra.insertBefore(manejador, barra.firstChild);
    return manejador;
}

function configurarArrastreRaton(barra, manejador) {
    let arrastrando = false;
    let desplazamientoY = 0;
    let desplazamientoX = 0;
    
    manejador.addEventListener('mousedown', iniciarArrastre);
    
    function iniciarArrastre(evento) {
        evento.preventDefault();
        arrastrando = true;
        
        const rectBarra = barra.getBoundingClientRect();
        desplazamientoY = evento.clientY - rectBarra.top;
        desplazamientoX = evento.clientX - rectBarra.left;
        
        document.addEventListener('mousemove', moverRaton);
        document.addEventListener('mouseup', detenerArrastre);
        
        barra.style.transition = 'none';
        document.body.style.userSelect = 'none';
    }
    
    function moverRaton(evento) {
        if (!arrastrando) return;
        
        const nuevaPosicion = calcularNuevaPosicion(
            evento.clientX - desplazamientoX,
            evento.clientY - desplazamientoY,
            barra
        );
        
        aplicarPosicion(barra, nuevaPosicion);
    }
    
    function detenerArrastre() {
        arrastrando = false;
        document.removeEventListener('mousemove', moverRaton);
        document.removeEventListener('mouseup', detenerArrastre);
        
        barra.style.transition = '';
        document.body.style.userSelect = '';
        
        guardarPosicionBarra(barra);
    }
}

function configurarArrastreTactil(barra, manejador) {
    let arrastrando = false;
    let desplazamientoY = 0;
    let desplazamientoX = 0;
    
    manejador.addEventListener('touchstart', iniciarArrastreTactil, { passive: false });
    
    function iniciarArrastreTactil(evento) {
        evento.preventDefault();
        const toque = evento.touches[0];
        arrastrando = true;
        
        const rectBarra = barra.getBoundingClientRect();
        desplazamientoY = toque.clientY - rectBarra.top;
        desplazamientoX = toque.clientX - rectBarra.left;
        
        document.addEventListener('touchmove', moverTactil, { passive: false });
        document.addEventListener('touchend', detenerArrastreTactil);
        
        barra.style.transition = 'none';
    }
    
    function moverTactil(evento) {
        if (!arrastrando) return;
        evento.preventDefault();
        
        const toque = evento.touches[0];
        const nuevaPosicion = calcularNuevaPosicion(
            toque.clientX - desplazamientoX,
            toque.clientY - desplazamientoY,
            barra
        );
        
        aplicarPosicion(barra, nuevaPosicion);
    }
    
    function detenerArrastreTactil() {
        arrastrando = false;
        document.removeEventListener('touchmove', moverTactil);
        document.removeEventListener('touchend', detenerArrastreTactil);
        
        barra.style.transition = '';
        guardarPosicionBarra(barra);
    }
}

function calcularNuevaPosicion(x, y, elemento) {
    const anchoVentana = window.innerWidth;
    const altoVentana = window.innerHeight;
    const anchoElemento = elemento.offsetWidth;
    const altoElemento = elemento.offsetHeight;
    
    // Mantener dentro de los límites de la ventana
    const xLimitada = Math.max(0, Math.min(anchoVentana - anchoElemento, x));
    const yLimitada = Math.max(0, Math.min(altoVentana - altoElemento, y));
    
    return { x: xLimitada, y: yLimitada };
}

function aplicarPosicion(elemento, posicion) {
    elemento.style.left = posicion.x + 'px';
    elemento.style.top = posicion.y + 'px';
    elemento.style.position = 'fixed';
}

function guardarPosicionBarra(barra) {
    const posicion = {
        x: parseInt(barra.style.left),
        y: parseInt(barra.style.top)
    };
    
    guardarConfiguracion('posicionBarra', posicion);
}

// ==========================================
// GESTIÓN DE CONFIGURACIÓN
// ==========================================

function guardarConfiguracion(clave, valor) {
    try {
        const configuracion = obtenerConfiguracionGuardada();
        configuracion[clave] = valor;
        // En lugar de localStorage, usar variable global
        window.configuracionAccesibilidad = configuracion;
    } catch (error) {
        console.warn('No se pudo guardar la configuración:', error);
    }
}

function obtenerConfiguracionGuardada() {
    try {
        return window.configuracionAccesibilidad || {};
    } catch (error) {
        console.warn('No se pudo cargar la configuración:', error);
        return {};
    }
}

function restaurarConfiguracionUsuario(estado) {
    const configuracion = estado.configuracionGuardada;
    
    // Restaurar tamaño de texto
    if (configuracion.tamanoTexto) {
        estado.tamanoTextoActual = configuracion.tamanoTexto;
        aplicarTamanoTexto(estado.tamanoTextoActual);
    }
    
    // Restaurar contraste
    if (configuracion.contrasteAlto) {
        estado.contrasteAltoActivo = configuracion.contrasteAlto;
        aplicarContraste(estado.contrasteAltoActivo);
        
        const botonContraste = document.getElementById('toggle-contrast');
        if (botonContraste) {
            actualizarBotonContraste(botonContraste, estado.contrasteAltoActivo);
        }
    }
    
    // Restaurar posición de barra
    if (configuracion.posicionBarra) {
        const barra = document.getElementById('accessibility-bar');
        if (barra) {
            aplicarPosicion(barra, configuracion.posicionBarra);
        }
    }
}

// ==========================================
// SISTEMA DE NOTIFICACIONES
// ==========================================

function mostrarNotificacionAccesibilidad(mensaje, tipo = 'info') {
    // Remover notificaciones anteriores
    const notificacionesAnteriores = document.querySelectorAll('.notificacion-accesibilidad');
    notificacionesAnteriores.forEach(notif => notif.remove());
    
    const elementoNotificacion = crearNotificacionAccesibilidad(mensaje, tipo);
    document.body.appendChild(elementoNotificacion);
    
    // Mostrar con animación
    requestAnimationFrame(() => {
        elementoNotificacion.style.opacity = '1';
        elementoNotificacion.style.transform = 'translateY(0)';
    });
    
    // Auto-ocultar
    setTimeout(() => {
        elementoNotificacion.style.opacity = '0';
        elementoNotificacion.style.transform = 'translateY(-20px)';
        setTimeout(() => elementoNotificacion.remove(), 300);
    }, 3000);
}

function crearNotificacionAccesibilidad(mensaje, tipo) {
    const colores = {
        info: '#17a2b8',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545'
    };
    
    const elemento = document.createElement('div');
    elemento.className = 'notificacion-accesibilidad';
    elemento.setAttribute('role', 'alert');
    elemento.setAttribute('aria-live', 'polite');
    
    elemento.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colores[tipo] || colores.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    elemento.textContent = mensaje;
    
    return elemento;
}