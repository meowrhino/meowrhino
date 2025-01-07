// Array con nombres y links en un array (links)
    const items = [
      { 
        name: "joc de la vida", 
        links: ["https://meowrhino.github.io/gameOfLife/"]
      },
      { 
        name: "archive", 
        links: ["https://meowrhino.neocities.org/"]
      },
      { 
        name: "masajes", 
        links: ["https://meowrhino.github.io/rikamichie/"]
      },
      { 
        name: "tarifas", 
        links: ["https://meowrhino.github.io/tarifas/"]
      },
      { 
        name: "las xordxs", 
        links: ["https://meowrhino.github.io/jordiyordiyordyiordi/"]
      },
      { 
        name: "e3000", 
        links: ["https://meowrhino.github.io/e300/"]
      },
      { 
        name: "villa granota", 
        links: ["https://villagranota.github.io/villagranota/"]
      },
      { 
        name: "minesweeper", 
        links: ["https://meowrhino.github.io/etchASketch/"]
      },
      { 
        name: "freewrite", 
        links: ["https://meowrhino.github.io/writingapp/"]
      },
      { 
        name: "directorio cosas nuevas", 
        links: ["https://meowrhino.github.io/directorio/"]
      },
      { 
        name: "hopeko", 
        links: [
          "https://meowrhino.github.io/hopeko/",
          "https://meowrhino.github.io/hopeko2/"
        ]
      },
      { 
        name: "notas", 
        links: [
          "https://meowrhino.github.io/notas/",
          "https://meowrhino.github.io/notas2/",
          "https://meowrhino.github.io/notas3/"
        ]
      },
      { 
        name: "barcelona per eixample", 
        links: ["barcelona.html"]
      },
      { 
        name: "profilePics", 
        links: ["https://meowrhino.github.io/profilePics/"]
      },
      { 
        name: "rockPaperScissors", 
        links: ["https://meowrhino.github.io/rockPaperScissors/"]
      },
      { 
        name: "festa", 
        links: [
          "https://meowrhino.neocities.org/lafesta_old.html",
          "https://meowrhino.neocities.org/lafesta.html"
        ]
      },
      { 
        name: "TFG", 
        links: ["https://meowrhino.cargo.site/tfg"]
      },
      {
        name: "la torra manel",
        links: [
          "https://www.indiexpo.net/es/games/la-torra-manel",
          "https://www.indiexpo.net/es/games/la-2a-torre-manel",
          "https://www.indiexpo.net/es/games/la-3era-torra-manel-2"
        ]
      },
    ];

    // Contenedor principal
    const container = document.querySelector('.container--content');

    // Factor aleatorio
    function getRandomFactor() {
      const isMobile = window.matchMedia("(max-width: 600px)").matches;
      if (isMobile) {
          return 0.65 + Math.random() * 1.0;
      }
      return 0.85 + Math.random() * 1.2;
    }

    /**
     * Devuelve un "indicador" en pseudo-números romanos:
     */
    function getRomanIndex(num) {
      switch (num) {
          case 1: return "i";
          case 2: return "ii";
          case 3: return "iii"; 
          case 4: return "iv";   
          case 5: return "v";     
          default: return num;    
      }
    }

    // Crear elemento dinámico (adaptado para single/múltiples enlaces)
    function createElement(item) {
      const preBox = document.createElement('div');
      preBox.classList.add('pre-box');

      const box = document.createElement('div');
      box.classList.add('box', 'box--title');

      // 1) Comprobamos si hay varios enlaces o solo uno
      const linksArray = item.links || [];
      if (linksArray.length <= 1) {
          // ---- SOLO UN ENLACE ----
          const h5 = document.createElement('h5');
          const linkElement = document.createElement('a');
          linkElement.href = linksArray[0] || "#";
          linkElement.textContent = item.name;
          linkElement.target = "_blank";
          h5.appendChild(linkElement);
          box.appendChild(h5);

      } else {
          // ---- VARIOS ENLACES ----
          // Creamos el h4 con el nombre
          const h4 = document.createElement('h4');
          box.classList.add('flex-column');
          
          h4.textContent = item.name;
          box.appendChild(h4);
          

          // Debajo, un <p> con spans para cada enlace
          const p = document.createElement('p');
          linksArray.forEach((link, index) => {
              const span = document.createElement('span');
              const a = document.createElement('a');
              a.target = "_blank";
              a.href = link;
              // index comienza en 0, así que para getRomanIndex lo pasamos como (index+1)
              a.textContent = getRomanIndex(index + 1);
              span.appendChild(a);
              p.appendChild(span);
          });
          box.appendChild(p);
      }

      // Ajustes de estilo y dimensiones
      box.style.height = 'inherit';
      box.style.width = 'inherit';
      preBox.appendChild(box);

      // Aplicar un tamaño aleatorio
      const randomFactor = getRandomFactor();
      const baseWidth = 200;
      const newWidth = baseWidth * randomFactor;
      const newHeight = newWidth / 1.55;
      preBox.style.width = `${newWidth}px`;
      preBox.style.height = `${newHeight}px`;

      container.appendChild(preBox);
    }

    // Generar elementos inicialmente
    items.forEach(item => createElement(item));

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
     /* window.addEventListener('scroll', throttle(updatePositions, 200));*/
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
      updateElements();  // Ajusta tamaños y posiciones al cargar
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
