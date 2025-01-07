// Array con nombres y links
const items = [
    { name: "Primer archivo 1", link: "#" },
    { name: "Primer archivo 2", link: "#" },
    { name: "Primer archivo 3", link: "#" },
];

// Contenedor principal donde se agregarán los elementos
const container = document.querySelector('.container--content');

// Genera un factor aleatorio entre 0.5 y 1.5
function getRandomFactor() {
    return 0.85 + Math.random() * 1.2;
}

// Crea dinámicamente un elemento con tamaño aleatorio
function createElement(name, link) {
    // Crear los divs
    const preBox = document.createElement('div');
    preBox.classList.add('pre-box');
    
    const box = document.createElement('div');
    box.classList.add('box', 'box--title');

    // Añadir el texto
    const h5 = document.createElement('h5');
    h5.textContent = name;
    box.appendChild(h5);

    // Añadir la caja al pre-box
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

// Aplicar posiciones aleatorias tras generar los elementos
document.addEventListener('DOMContentLoaded', () => {
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
        element.style.position = 'absolute'; // Asegurarse de que la posición funcione
    });
});
