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