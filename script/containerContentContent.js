// Array con nombres y links
const items = [
    { name: "notas3", link: "https://meowrhino.github.io/notas3/" },
    { name: "joc de la vida", link: "https://meowrhino.github.io/gameOfLife/" },
    { name: "archive", link: "https://meowrhino.neocities.org/" },
    { name: "masajes", link: "https://meowrhino.github.io/rikamichie/" },
    { name: "tarifas", link: "https://meowrhino.github.io/tarifas/" },
    { name: "notas2", link: "https://meowrhino.github.io/notas2/" },
    { name: "las xordxs", link: "https://meowrhino.github.io/jordiyordiyordyiordi/" },
    { name: "e3000", link: "https://meowrhino.github.io/e300/" },
    { name: "villa granota", link: "https://villagranota.github.io/villagranota/" },
    { name: "minesweeper", link: "https://meowrhino.github.io/etchASketch/" },
    { name: "freewrite", link: "https://meowrhino.github.io/writingapp/" },
    { name: "directorio cosas nuevas", link: "https://meowrhino.github.io/directorio/" },
    { name: "hopeko", link: "https://meowrhino.github.io/hopeko/" },
    { name: "hopeko2", link: "https://meowrhino.github.io/hopeko2/" },
    { name: "notas", link: "https://meowrhino.github.io/notas/" },
    { name: "barcelona per eixample", link: "barcelona.html" },
    { name: "profilePics", link: "https://meowrhino.github.io/profilePics/" },
    { name: "rockPaperScissors", link: "https://meowrhino.github.io/rockPaperScissors/" },
    { name: "festa", link: "lafesta_old.html" },
    { name: "festa (version + gran)", link: "lafesta.html" },
    { name: "TFG", link: "https://meowrhino.cargo.site/tfg" },
    { name: "la torra manel I", link: "https://www.indiexpo.net/es/games/la-torra-manel" },
    { name: "la torra manel II", link: "https://www.indiexpo.net/es/games/la-2a-torre-manel" },
    { name: "la torra manel III", link: "https://www.indiexpo.net/es/games/la-3era-torra-manel-2" },
];

// Contenedor principal
const container = document.querySelector('.container--content');

// Factor aleatorio
function getRandomFactor() {
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        return 0.6 + Math.random() * 1.0;
    }
    return 0.85 + Math.random() * 1.2;
}

// Crear elemento dinámico
function createElement(name, link) {
    const preBox = document.createElement('div');
    preBox.classList.add('pre-box');

    const box = document.createElement('div');
    box.classList.add('box', 'box--title');

    const h5 = document.createElement('h5');
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = name;
    h5.appendChild(linkElement);
    box.appendChild(h5);

    box.style.height = 'inherit';
    box.style.width = 'inherit';
    preBox.appendChild(box);

    const randomFactor = getRandomFactor();
    const baseWidth = 200;
    const newWidth = baseWidth * randomFactor;
    const newHeight = newWidth / 1.55;
    preBox.style.width = `${newWidth}px`;
    preBox.style.height = `${newHeight}px`;

    container.appendChild(preBox);
}

// Generar elementos inicialmente
items.forEach(item => createElement(item.name, item.link));

// Recalcula tamaños y posiciones
function updateElements() {
    const elements = container.querySelectorAll('.pre-box');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    elements.forEach(element => {
        // Tamaño aleatorio
        const randomFactor = getRandomFactor();
        const baseWidth = 200;
        const newWidth = baseWidth * randomFactor;
        const newHeight = newWidth / 1.55;
        element.style.width = `${newWidth}px`;
        element.style.height = `${newHeight}px`;

        // Posición aleatoria
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const x = Math.floor(Math.random() * (containerWidth - elementWidth));
        const y = Math.floor(Math.random() * (containerHeight - elementHeight));
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.position = 'absolute';
    });
}

// Solo recalcula posiciones sin cambiar tamaño
function updatePositions() {
    const elements = container.querySelectorAll('.pre-box');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    elements.forEach(element => {
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const x = Math.floor(Math.random() * (containerWidth - elementWidth));
        const y = Math.floor(Math.random() * (containerHeight - elementHeight));
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    });
}

// Detectar zoom y scroll
function detectZoomOrScroll() {
    let lastZoom = window.devicePixelRatio;
    let lastContainerWidth = container.offsetWidth;
    let lastContainerHeight = container.offsetHeight;

    // Detectar zoom
    setInterval(() => {
        if (window.devicePixelRatio !== lastZoom) {
            lastZoom = window.devicePixelRatio;
            // Actualizar solo si cambian las dimensiones del contenedor
            if (
                container.offsetWidth !== lastContainerWidth ||
                container.offsetHeight !== lastContainerHeight
            ) {
                lastContainerWidth = container.offsetWidth;
                lastContainerHeight = container.offsetHeight;
                updateElements();
            }
        }
    }, 200);

    // Detectar scroll (solo posiciones con throttle)
    window.addEventListener('scroll', throttle(updatePositions, 200));
}

// Limitar frecuencia de ejecución
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Eventos
window.addEventListener('resize', throttle(updateElements, 200));

document.addEventListener('DOMContentLoaded', () => {
    // Crear elementos adicionales si deseas
    updateElements();
    detectZoomOrScroll();
});

/*
// Aplicar posiciones y tamaños iniciales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    items.forEach(item => {
        createElement(item.name, item.link);
    });
    updateElements(); // Aplicar posiciones y tamaños inicialmente
    detectZoomOrScroll(); // Detectar zoom o scroll
});
*/

/*
// Detectar zoom o scroll y activar updateElements
function detectZoomOrScroll() {
    let lastZoom = window.devicePixelRatio;

    // Detectar cambios de zoom
    setInterval(() => {
        if (window.devicePixelRatio !== lastZoom) {
            lastZoom = window.devicePixelRatio;
            updateElements();
        }
    }, 100);

    // Detectar scroll
    window.addEventListener('scroll', updateElements);
}

// Aplicar posiciones y tamaños iniciales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    items.forEach(item => {
        createElement(item.name, item.link);
    });
    updateElements(); // Aplicar posiciones y tamaños inicialmente
    detectZoomOrScroll(); // Detectar zoom o scroll
});
*/

/*
cosas traviesas:
// Función para que el elemento cambie de posición al intentar atraparlo
function addEscapeBehavior() {
    const elements = container.querySelectorAll('.pre-box');
    elements.forEach(element => {
        element.addEventListener('mouseover', () => {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;

            const x = Math.floor(Math.random() * (containerWidth - elementWidth));
            const y = Math.floor(Math.random() * (containerHeight - elementHeight));

            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        });
    });
}
    */
