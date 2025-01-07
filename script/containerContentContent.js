const items = [
    { name: "Primer archivo 1", link: "#" },
    { name: "Primer archivo 2", link: "#" },
    { name: "Primer archivo 3", link: "#" },
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

    // Detectar scroll (solo posiciones)
    window.addEventListener('scroll', () => {
        updatePositions();
    });
}

// Eventos
window.addEventListener('resize', () => {
    updateElements();
});

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