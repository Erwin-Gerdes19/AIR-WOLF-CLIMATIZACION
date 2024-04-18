window.addEventListener('scroll', function () {
    var scrollPosition = window.scrollY;
    var contenedor = document.querySelector('.contenedor');
    if (scrollPosition > 0) {
        contenedor.classList.add('scrolled');
    } else {
        contenedor.classList.remove('scrolled');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Selecciona todos los enlaces con la clase 'smooth-scroll'
    var links = document.querySelectorAll('.smooth-scroll');

    // Agrega un event listener a cada enlace
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            // Previene el comportamiento predeterminado del enlace
            e.preventDefault();

            // Obtiene el objetivo del enlace (el valor del atributo href)
            var targetId = this.getAttribute('href');

            // Desplázate suavemente hacia el elemento objetivo
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});