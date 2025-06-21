document.addEventListener('DOMContentLoaded', function () {
    const evaluacionForm = document.getElementById('evaluacionForm');
    if (!evaluacionForm) return;

    // --- ELEMENTOS DEL DOM ---
    const institucionSelect = document.getElementById('institucion');
    const otraInstitucionInput = document.getElementById('otraInstitucion');
    const progressBar = document.getElementById('progressBar');
    const sections = document.querySelectorAll('.evaluation-section');

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
        const triggerPoint = window.innerHeight * 0.4;

        sections.forEach((section, index) => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerPoint) {
                currentStep = index;
            }
        });

        const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `Paso ${currentStep + 1} de ${totalSteps}`;
    }
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();

    // --- MANEJO DEL ENVÍO DEL FORMULARIO ---
    evaluacionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        function recopilarDatos() {
            const datosParaEnviar = {
                institucion: '',
                evaluacion: {},
                comentarios: document.getElementById('comentarios').value.trim() || '',
                timestamp: new Date().toISOString()
            };

            if (institucionSelect.value === 'otra') {
                datosParaEnviar.institucion = otraInstitucionInput.value.trim();
            } else {
                datosParaEnviar.institucion = institucionSelect.value;
            }

            const preguntas = evaluacionForm.querySelectorAll('.btn-check[type="radio"]:checked');
            preguntas.forEach(pregunta => {
                const [categoria, nombrePregunta] = pregunta.name.split('_');
                if (!datosParaEnviar.evaluacion[categoria]) {
                    datosParaEnviar.evaluacion[categoria] = {};
                }
                datosParaEnviar.evaluacion[categoria][nombrePregunta] = pregunta.value;
            });
            return datosParaEnviar;
        }

        const datosFinales = recopilarDatos();

        if (!datosFinales.institucion) {
            alert('Por favor, selecciona o escribe el nombre de tu institución.');
            return;
        }
        
        console.log('--- Objeto de datos listo para enviar a la base de datos ---');
        console.log(JSON.stringify(datosFinales, null, 2));
        
        // Conservamos el código ejemplo para el backend
        /*
        fetch('https://api.tu-plataforma.cl/evaluaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFinales)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            alert('¡Evaluación enviada con éxito! Muchas gracias.');
            evaluacionForm.reset();
            otraInstitucionInput.classList.add('d-none');
        })
        .catch(error => {
            console.error('Error al enviar la evaluación:', error);
            alert('Hubo un error al enviar tu evaluación.');
        });
        */

        alert('¡Evaluación enviada con éxito! Muchas gracias por tu contribución.');
        evaluacionForm.reset();
        otraInstitucionInput.classList.add('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});