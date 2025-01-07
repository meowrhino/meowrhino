// Array con nombres y links
const items = [
    { name: "Primer archivo 1", link: "#" },
    { name: "Primer archivo 2", link: "#" },
    { name: "Primer archivo 3", link: "#" },
];

// Contenedor principal donde se agregarán los elementos
const container = document.querySelector('.container--content');

function getRandomFactor() {
    // Media query para detectar pantallas pequeñas (móvil)
    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    // Si es móvil, devolver un factor más pequeño
    if (isMobile) {
        return 0.6 + Math.random() * 1.0; // Rango más pequeño
    }

    // Si no, usar el rango más amplio
    return 0.85 + Math.random() * 1.2;
}


// Crea dinámicamente un elemento con tamaño aleatorio
function createElement(name, link) {
    // Crear los divs
    const preBox = document.createElement('div');
    preBox.classList.add('pre-box');
    
    const box = document.createElement('div');
    box.classList.add('box', 'box--title');

    // Añadir el texto y el link
    const h5 = document.createElement('h5');
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = name;
    h5.appendChild(linkElement);
    box.appendChild(h5);

    // Añadir la caja al pre-box
    box.style.height = 'inherit';
    box.style.width = 'inherit';
    preBox.appendChild(box);

    // Calcular tamaño aleatorio
    const randomFactor = getRandomFactor();
    const baseWidth = 200; // Tamaño base de referencia en píxeles
    const newWidth = baseWidth * randomFactor;
    const newHeight = newWidth / 1.55; // Aspect ratio de 1.55

    preBox.style.width = `${newWidth}px`;
    preBox.style.height = `${newHeight}px`;

    // Añadir al contenedor
    container.appendChild(preBox);
}

// Generar todos los elementos dinámicamente
items.forEach(item => {
    createElement(item.name, item.link);
});

// Función para actualizar las posiciones y tamaños de los elementos en container--content
function updateElements() {
    const elements = container.querySelectorAll('.pre-box');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    elements.forEach(element => {
        // Calcular tamaño aleatorio
        const randomFactor = getRandomFactor();
        const baseWidth = 200;
        const newWidth = baseWidth * randomFactor;
        const newHeight = newWidth / 1.55;

        element.style.width = `${newWidth}px`;
        element.style.height = `${newHeight}px`;

        // Recalcular posición aleatoria
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const x = Math.floor(Math.random() * (containerWidth - elementWidth));
        const y = Math.floor(Math.random() * (containerHeight - elementHeight));

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.position = 'absolute';
    });
}

// Llamar a updateElements en el evento resize
window.addEventListener('resize', updateElements);


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