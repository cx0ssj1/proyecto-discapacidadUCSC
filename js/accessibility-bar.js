/**
 * accessibility-bar.js
 * Este script gestiona la barra de accesibilidad del sitio web.
 */
(function () {
    window.addEventListener('componentsLoaded', () => {
        
        const A11Y_SETTINGS_KEY = 'ucscA11ySettings';

        const elements = {
            bar: document.getElementById('accessibility-bar'),
            increaseTextBtn: document.getElementById('increase-text'),
            decreaseTextBtn: document.getElementById('decrease-text'),
            contrastBtn: document.getElementById('toggle-contrast'),
            readPageBtn: document.getElementById('read-page'),
            mainContent: document.querySelector('main')
        };

        // Medida de seguridad final: si la barra sigue sin encontrarse, nos detenemos.
        if (!elements.bar) {
            console.error('Error Crítico: El evento "componentsLoaded" se disparó, pero el elemento #accessibility-bar sigue sin encontrarse en el DOM.');
            return;
        }
        
        console.log('Componentes cargados. Barra de accesibilidad inicializada.');

        const state = {
            isReading: false,
            speechSynthesis: window.speechSynthesis,
            readingPlaylist: [],
            currentReadingIndex: -1,
            currentlyReadingElement: null
        };

        function loadSettings() {
            const savedSettings = JSON.parse(localStorage.getItem(A11Y_SETTINGS_KEY));
            if (!savedSettings) return;
            if (savedSettings.fontSize) applyTextSize(savedSettings.fontSize);
            if (savedSettings.highContrast) applyContrast(savedSettings.highContrast);
        }

        function saveSetting(key, value) {
            const settings = JSON.parse(localStorage.getItem(A11Y_SETTINGS_KEY)) || {};
            settings[key] = value;
            localStorage.setItem(A11Y_SETTINGS_KEY, JSON.stringify(settings));
        }

        function applyTextSize(size) {
            document.documentElement.style.fontSize = `${size}%`;
        }

        function changeTextSize(amount) {
            const currentSize = parseFloat(document.documentElement.style.fontSize || '100');
            let newSize = Math.max(50, Math.min(200, currentSize + amount));
            applyTextSize(newSize);
            saveSetting('fontSize', newSize);
        }

        function applyContrast(isActive) {
            document.body.classList.toggle('high-contrast', isActive);
            if (elements.contrastBtn) elements.contrastBtn.classList.toggle('active', isActive);
            saveSetting('highContrast', isActive);
        }

        function stopReading() {
            state.speechSynthesis.cancel();
            if (state.currentlyReadingElement) {
                state.currentlyReadingElement.classList.remove('reading-highlight');
            }
            state.isReading = false;
            if (elements.readPageBtn) {
                elements.readPageBtn.classList.remove('active');
                elements.readPageBtn.querySelector('span').textContent = 'Leer';
            }
            state.readingPlaylist = [];
            state.currentReadingIndex = -1;
            state.currentlyReadingElement = null;
        }

        function playNextInPlaylist() {
            if (state.currentlyReadingElement) {
                state.currentlyReadingElement.classList.remove('reading-highlight');
            }
            state.currentReadingIndex++;
            if (state.currentReadingIndex >= state.readingPlaylist.length) {
                stopReading();
                return;
            }
            const elementToRead = state.readingPlaylist[state.currentReadingIndex];
            state.currentlyReadingElement = elementToRead;
            const textToRead = elementToRead.innerText;
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'es-CL';
            utterance.rate = 0.9;
            utterance.onstart = () => {
                elementToRead.classList.add('reading-highlight');
                elementToRead.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };
            utterance.onend = playNextInPlaylist;
            utterance.onerror = playNextInPlaylist; // En caso de error, simplemente salta al siguiente
            state.speechSynthesis.speak(utterance);
        }

        function startReading() {
            if (!elements.mainContent) {
                console.warn('No se encontró contenido principal para leer.');
                return;
            }
            state.isReading = true;
            elements.readPageBtn.classList.add('active');
            elements.readPageBtn.querySelector('span').textContent = 'Detener';
            const readableElements = elements.mainContent.querySelectorAll('h1, h2, h3, h4, p, li, [data-readable]');
            state.readingPlaylist = Array.from(readableElements).filter(el => el.innerText.trim().length > 10);
            state.currentReadingIndex = -1;
            playNextInPlaylist();
        }

        function handleSpeechToggle() {
            if (state.isReading) {
                stopReading();
            } else {
                startReading();
            }
        }

        function init() {
            // Asignación de eventos a los botones
            if (elements.increaseTextBtn) elements.increaseTextBtn.addEventListener('click', () => changeTextSize(10));
            if (elements.decreaseTextBtn) elements.decreaseTextBtn.addEventListener('click', () => changeTextSize(-10));
            if (elements.contrastBtn) elements.contrastBtn.addEventListener('click', () => applyContrast(!document.body.classList.contains('high-contrast')));
            if (elements.readPageBtn) elements.readPageBtn.addEventListener('click', handleSpeechToggle);

            // Detiene la lectura si el usuario se va de la página
            window.addEventListener('beforeunload', () => {
                if (state.isReading) stopReading();
            });

            // Carga las preferencias guardadas por el usuario
            loadSettings();
        }

        // Llamada final a la función que conecta todo
        init();

    }); // Fin del addEventListener 'componentsLoaded'

})(); // Fin del script