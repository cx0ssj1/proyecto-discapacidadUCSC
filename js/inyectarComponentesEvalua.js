// Array con las promesas de fetch para cada componente de la página de apoyo
const fetchPromises = [
    fetch("/components/navbar/navbar.html").then(response => response.text()),
    fetch("/components/footer/footer.html").then(response => response.text()),
    fetch("/components/accessibility-bar/accessibility-bar.html").then(response => response.text())
];
Promise.all(fetchPromises)
    .then(([navbarHtml, footerHtml, accessibilityBarHtml]) => {
        const navbarContainer = document.getElementById("navbar-container");
        if (navbarContainer) {
            navbarContainer.innerHTML = navbarHtml;
        }
        const footerContainer = document.getElementById("footer-container");
        if (footerContainer) {
            footerContainer.innerHTML = footerHtml;
        }
        const accessibilityBarContainer = document.getElementById("accessibility-bar-container");
        if (accessibilityBarContainer) {
            accessibilityBarContainer.innerHTML = accessibilityBarHtml;
        }
        document.body.classList.add('loaded');
    })
    .catch(error => {
        console.error("Error al cargar componentes para la página de apoyo:", error);
        document.body.classList.add('loaded');
    });