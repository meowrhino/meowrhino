window.addEventListener("DOMContentLoaded", async () => {
  // — Parámetros —
  const TOTAL_HEIGHT_VH = 500;
  const NUM_NUBES = 20;             // cuántas nubes generar
  const MIN_SCALE = 0.5, MAX_SCALE = 1.5; // escalas relativas
  const canvas = document.getElementById("canvas-nubes");
  const container = document.querySelector(".container--content");

  // Carga proyectos
  const proyectos = await fetch("proyectos.json").then(r => r.json());

  // Extrae coords normalizadas [0–1] de --nube
  const nubeCSS = getComputedStyle(document.documentElement)
                    .getPropertyValue("--nube").trim();
  const nubeCoords = nubeCSS
    .replace(/^polygon\(|\)$/g, "")
    .split(",")
    .map(pt => pt.trim().split(" "))
    .map(([xs, ys]) => [parseFloat(xs)/100, parseFloat(ys)/100]);

  // Setup Paper.js
  paper.setup(canvas);
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight * (TOTAL_HEIGHT_VH/100);
    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
  }
  window.addEventListener("resize", resize);
  resize();

  // Genera puntos semilla aleatorios
  function generaSemillas() {
    let sem = [];
    for (let i=0; i<NUM_NUBES; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const scale = MIN_SCALE + Math.random() * (MAX_SCALE - MIN_SCALE);
      const proyecto = proyectos[i % proyectos.length];
      sem.push({ x, y, scale, proyecto });
    }
    return sem;
  }

  // Dibuja todas las nubes
  function dibuja(semillas) {
    paper.project.activeLayer.removeChildren();
    // 1) crear paths
    let paths = semillas.map(s => {
      const path = new paper.Path();
      nubeCoords.forEach(([px,py], i) => {
        const pxAbs = s.x + px * 200 * s.scale; // 200px es tamaño base
        const pyAbs = s.y + py * 125 * s.scale; // mantiene 16:10
        i===0 ? path.moveTo(pxAbs, pyAbs) : path.lineTo(pxAbs, pyAbs);
      });
      path.closed = true;
      path.fillColor   = getComputedStyle(document.documentElement)
                         .getPropertyValue("--color-2").trim();
      path.strokeColor = getComputedStyle(document.documentElement)
                         .getPropertyValue("--color-3").trim();
      path.strokeWidth = 6;
      return path;
    });

    // 2) fusiona solapamientos
    let unificado = [];
    let used = Array(paths.length).fill(false);
    for (let i=0; i<paths.length; i++) {
      if (used[i]) continue;
      let base = paths[i];
      for (let j=i+1; j<paths.length; j++) {
        if (used[j]) continue;
        if (base.bounds.intersects(paths[j].bounds)) {
          base = base.unite(paths[j]);
          paths[j].remove();
          used[j] = true;
        }
      }
      unificado.push(base);
      used[i] = true;
    }
    unificado.forEach(p => {
      p.strokeWidth = 6;
    });
    paper.view.update();
  }

  // Coloca labels
  function pintaLabels(semillas) {
    container.innerHTML = "";
    semillas.forEach(s => {
      const div = document.createElement("div");
      div.className = "label";
      div.style.left = `${s.x}px`;
      div.style.top  = `${s.y}px`;
      const texto = s.proyecto.name || s.proyecto.titulo || "Sin nombre";
      if (s.proyecto.links?.length) {
        const a = document.createElement("a");
        a.href = s.proyecto.links[0];
        a.textContent = texto;
        a.target = "_blank";
        div.appendChild(a);
      } else {
        div.textContent = texto;
      }
      container.appendChild(div);
    });
  }

  // Render completo
  function render() {
    const sem = generaSemillas();
    dibuja(sem);
    pintaLabels(sem);
  }

  // Botón de refrescar
  document.getElementById("refresh")
          .addEventListener("click", render);

  render();
});