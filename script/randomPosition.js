function getRandomPosition(containerWidth, containerHeight, elementWidth, elementHeight) {
    const x = Math.floor(Math.random() * (containerWidth - elementWidth));
    const y = Math.floor(Math.random() * (containerHeight - elementHeight));
    return { x, y };
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container--content');
    console.log(container);
    const elements = container.querySelectorAll('.pre-box');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
  
    elements.forEach(element => {
      const { x, y } = getRandomPosition(containerWidth, containerHeight, element.offsetWidth, element.offsetHeight);
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    });
  });