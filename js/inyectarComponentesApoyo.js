fetch("/components/navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("navbar-container").innerHTML = data;                                                             
    })
    .catch((error) => {
        console.error("Error al cargar el componente navbar:", error);
    });

fetch("/components/footer/footer.html")
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("footer-container").innerHTML = data;                                                             
    })
    .catch((error) => {
        console.error("Error al cargar el componente footer:", error);
    });

fetch("/components/accessibility-bar/accessibility-bar.html")
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("accessibility-bar-container").innerHTML = data;                                                             
    })
    .catch((error) => {
        console.error("Error al cargar el componente accessibility-bar:", error);
    });