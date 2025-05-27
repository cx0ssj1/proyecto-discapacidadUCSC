$(document).ready(function() {
    // Mostrar elementos con delay
    setTimeout(() => {
        setupAccessibilityTools();
    }, 500);
});
// Herramientas de accesibilidad
function setupAccessibilityTools() {
    const increaseTextBtn = document.getElementById('increase-text');
    const decreaseTextBtn = document.getElementById('decrease-text');
    const contrastBtn = document.getElementById('toggle-contrast');
    const readPageBtn = document.getElementById('read-page');
    
    let currentFontSize = 100;
    let isHighContrast = false;
    let speechSynthesis = window.speechSynthesis;

    // Verifica que la barra exista antes de hacerla movible
    if (document.getElementById('accessibility-bar')) {
        setupDraggableAccessibilityBar();
    }
    
    increaseTextBtn?.addEventListener('click', () => {
        if (currentFontSize < 199) {
            currentFontSize += 10;
            document.body.style.fontSize = `${currentFontSize}%`;
        }
    });
    
    decreaseTextBtn?.addEventListener('click', () => {
        if (currentFontSize > 50) {
            currentFontSize -= 10;
            document.body.style.fontSize = `${currentFontSize}%`;
        }
    });
    
    contrastBtn?.addEventListener('click', () => {
        isHighContrast = !isHighContrast;
        document.body.classList.toggle('high-contrast', isHighContrast);
    });
    
    readPageBtn?.addEventListener('click', () => {
        if (speechSynthesis) {
            const mainContent = document.getElementById('main-content')?.textContent;
            if (!mainContent) return alert('No se encontró contenido principal para leer.');
            
            const utterance = new SpeechSynthesisUtterance(mainContent);
            utterance.lang = 'es-ES';

            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            } else {
                speechSynthesis.speak(utterance);
            }
        } else {
            alert('Lo sentimos, tu navegador no soporta la síntesis de voz.');
        }
    });
}



// Hacer que la barra de accesibilidad sea movible
function setupDraggableAccessibilityBar() {
    const accessibilityBar = document.getElementById('accessibility-bar');
    console.log('accessibilityBar', accessibilityBar); // Esto mostrará null si no existe
    const handle = accessibilityBar.querySelector('.handle');

    
    let isDragging = false;
    let offsetY = 0;
    
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetY = e.clientY - accessibilityBar.getBoundingClientRect().top;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    
    function onMouseMove(e) {
        if (!isDragging) return;
        
        const y = e.clientY - offsetY;
        const maxY = window.innerHeight - accessibilityBar.offsetHeight;
        
        // Mantener dentro de los límites de la ventana
        const boundedY = Math.max(0, Math.min(maxY, y));
        
        accessibilityBar.style.top = boundedY + 'px';
    }
    
    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}