const fetchPromises = [
    fetch("/components/navbar/navbar.html").then(res => res.text()),
    fetch("/components/footer/footer.html").then(res => res.text()),
    fetch("/components/accessibility-bar/accessibility-bar.html").then(res => res.text())
];

Promise.all(fetchPromises)
    .then(([navbar, footer, accessibilityBar]) => {
        document.getElementById("navbar-container").innerHTML = navbar;
        document.getElementById("footer-container").innerHTML = footer;
        document.getElementById("accessibility-bar-container").innerHTML = accessibilityBar;
        
        // Dispara un evento personalizado para indicar que los componentes se han cargado.
        window.dispatchEvent(new CustomEvent('componentsLoaded'));
        // Una vez que todos los componentes se han inyectado, muestra el body.
        document.body.classList.add('loaded');
    })
    .catch(error => {
        console.error("Error al cargar componentes:", error);
        // Incluso si hay un error, muestra el contenido para que la página no se quede en blanco.
        document.body.classList.add('loaded');
    });