function adjustBoxSizes() {
    const boxes = document.querySelectorAll('.box');
    const aspectRatio = 1.55; // Relación de aspecto ancho:alto (1.55:1)

    boxes.forEach(box => {
      const width = box.offsetWidth; // Obtiene el ancho actual de la caja
      const height = width / aspectRatio; // Calcula la altura según la proporción
      box.style.height = `${height}px`; // Aplica la altura calculada
    });
  }

  // Ajustar las cajas al cargar la página y al cambiar el tamaño de la ventana
  window.onload = adjustBoxSizes;
  window.onresize = adjustBoxSizes;