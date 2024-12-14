function adjustBoxSizes() {
  const boxes = document.querySelectorAll('.box');
  const preboxes = document.querySelectorAll('.pre-box');
  const aspectRatio = 1.55; // Relación de aspecto ancho:alto (1.55:1)

  boxes.forEach(box => {
    const width = box.offsetWidth; 
    const height = width / aspectRatio; 
    box.style.height = `${height}px`; 
  });

  preboxes.forEach(prebox => {
    const width = prebox.offsetWidth; 
    const height = width / aspectRatio; 
    prebox.style.height = `${height}px`; 
  });
}

// Ajustar las cajas al cargar la página y al cambiar el tamaño de la ventana
window.onload = adjustBoxSizes;
window.onresize = adjustBoxSizes;
