document.addEventListener('DOMContentLoaded', function () {
    const evaluacionForm = document.getElementById('evaluacionForm');
    if (!evaluacionForm) return;
    gestionarCheckboxesDiscapacidad()
    // --- ELEMENTOS DEL DOM ---
    const institucionSelect = document.getElementById('institucion');
    const otraInstitucionInput = document.getElementById('otraInstitucion');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const sections = document.querySelectorAll('.evaluation-section');
    const stepDots = document.querySelectorAll('.step-dot');

    // --- LÓGICA DE LA INTERFAZ ---
    institucionSelect.addEventListener('change', function () {
        if (this.value === 'otra') {
            otraInstitucionInput.classList.remove('d-none');
            otraInstitucionInput.setAttribute('required', 'true');
        } else {
            otraInstitucionInput.classList.add('d-none');
            otraInstitucionInput.removeAttribute('required');
        }
    });

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    function updateProgressBar() {
        if (!sections.length || !progressBar) return;
        const totalSteps = sections.length;
        let currentStep = 0;
        const triggerPoint = window.innerHeight * 0.3;

        sections.forEach((section, index) => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerPoint) {
                currentStep = index;
            }
        });

        const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Paso ${currentStep + 1} de ${totalSteps}`;

        stepDots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index < currentStep) {
                dot.classList.add('completed');
            } else if (index === currentStep) {
                dot.classList.add('active');
            }
        });
    }

    function validateSection(sectionId) {
        const section = document.getElementById(sectionId);
        const requiredFields = section.querySelectorAll('[required]');
        const radioGroups = {};
        
        section.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (!radioGroups[radio.name]) {
                radioGroups[radio.name] = [];
            }
            radioGroups[radio.name].push(radio);
        });

        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('validation-error');
                isValid = false;
            } else {
                field.classList.remove('validation-error');
            }
        });

        return isValid;
    }

    function calcularPuntuaciones() {
        const categorias = ['fisica', 'tecnologica', 'academica', 'servicios'];
        const puntuaciones = {};
        let totalGeneral = 0;
        let totalPreguntas = 0;

        categorias.forEach(categoria => {
            const preguntas = evaluacionForm.querySelectorAll(`input[name^="${categoria}_"]:checked`);
            let puntuacionCategoria = 0;
            let preguntasCategoria = 0;

            preguntas.forEach(pregunta => {
                puntuacionCategoria += parseInt(pregunta.value);
                preguntasCategoria++;
            });

            if (preguntasCategoria > 0) {
                const promedioCategoria = (puntuacionCategoria / (preguntasCategoria * 2)) * 100;
                puntuaciones[categoria] = Math.round(promedioCategoria);
                totalGeneral += puntuacionCategoria;
                totalPreguntas += preguntasCategoria * 2;
            }
        });

        const puntuacionGeneral = totalPreguntas > 0 ? Math.round((totalGeneral / totalPreguntas) * 100) : 0;
        puntuaciones.general = puntuacionGeneral;

        return puntuaciones;
    }

    function mostrarResumen() {
        const puntuaciones = calcularPuntuaciones();
        const resumenCard = document.getElementById('resumen-evaluacion');
        
        Object.keys(puntuaciones).forEach(categoria => {
            const elemento = document.getElementById(`score-${categoria}`);
            if (elemento) {
                elemento.textContent = `${puntuaciones[categoria]}%`;
                elemento.className = `score-display ${getScoreClass(puntuaciones[categoria])}`;
            }
        });

        resumenCard.classList.remove('d-none');
        //resumenCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function getScoreClass(puntuacion) {
        if (puntuacion >= 70) return 'score-high';
        if (puntuacion >= 40) return 'score-medium';
        return 'score-low';
    }
    function gestionarCheckboxesDiscapacidad() {
        const sinDiscapacidadCheckbox = document.getElementById('sin_discapacidad');
        const otrosCheckboxes = document.querySelectorAll('input[name="tipo_discapacidad"]:not(#sin_discapacidad)');

        sinDiscapacidadCheckbox.addEventListener('change', function() {
            const deshabilitar = this.checked;
            otrosCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = deshabilitar;
            });
        });

        otrosCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    sinDiscapacidadCheckbox.checked = false;
                }
            });
        });
    }

    // Event listeners para actualizar progreso
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();

    evaluacionForm.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            setTimeout(mostrarResumen, 500);
        }
    });

    // --- MANEJO DEL ENVÍO DEL FORMULARIO ---
    evaluacionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validar institución
        if (!institucionSelect.value || (institucionSelect.value === 'otra' && !otraInstitucionInput.value.trim())) {
            alert('Por favor, selecciona o escribe el nombre de tu institución.');
            institucionSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        function recopilarDatos() {
            const datosParaEnviar = {
                institucion: institucionSelect.value === 'otra' ? otraInstitucionInput.value.trim() : institucionSelect.value,
                tipoInstitucion: document.getElementById('tipoInstitucion').value,
                region: document.getElementById('region').value,
                anioIngreso: document.getElementById('anioIngreso').value,
                evaluacion: {},
                tipoDiscapacidad: [],
                valoracionGeneral: document.getElementById('valoracion_general').value,
                comentarios: document.getElementById('comentarios').value.trim() || '',
                principalesBarreras: document.getElementById('principales_barreras').value.trim() || '',
                puntuaciones: calcularPuntuaciones(),
                timestamp: new Date().toISOString(),
                version: '2.0'
            };

            // Recopilar respuestas de evaluación
            const preguntas = evaluacionForm.querySelectorAll('input[type="radio"]:checked');
            preguntas.forEach(pregunta => {
                const [categoria, nombrePregunta] = pregunta.name.split('_');
                if (!datosParaEnviar.evaluacion[categoria]) {
                    datosParaEnviar.evaluacion[categoria] = {};
                }
                datosParaEnviar.evaluacion[categoria][nombrePregunta] = parseInt(pregunta.value);
            });

            // Recopilar tipos de discapacidad
            const discapacidades = evaluacionForm.querySelectorAll('input[name="tipo_discapacidad"]:checked');
            discapacidades.forEach(disc => {
                datosParaEnviar.tipoDiscapacidad.push(disc.value);
            });

            return datosParaEnviar;
        }


        const datosFinales = recopilarDatos();
        
        console.log('--- DATOS PARA ENVIAR A LA BASE DE DATOS ---');
        console.log(JSON.stringify(datosFinales, null, 2));
        
        // Mostrar mensaje de éxito más detallado
        const puntuacionGeneral = datosFinales.puntuaciones.general;
        let mensajeExito = `¡Evaluación enviada con éxito! 

            Tu institución obtuvo una puntuación general de inclusión del ${puntuacionGeneral}%.

            Gracias por contribuir al mapa nacional de inclusión en Educación Superior. Tu experiencia nos ayuda a construir un futuro más inclusivo.`;

        alert(mensajeExito);
        
        // Reset del formulario
        evaluacionForm.reset();
        otraInstitucionInput.classList.add('d-none');
        document.getElementById('resumen-evaluacion').classList.add('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateProgressBar();

        // Aquí iría la llamada real al backend
        /*
        fetch('/api/evaluaciones', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(datosFinales)
        })
        .then(response => {
            if (!response.ok) throw new Error('Error en el servidor');
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            // Mostrar mensaje de éxito
        })
        .catch(error => {
            console.error('Error al enviar la evaluación:', error);
            alert('Hubo un error al enviar tu evaluación. Por favor, inténtalo nuevamente.');
        });
        */
    });
});