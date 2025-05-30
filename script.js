
   document.addEventListener("DOMContentLoaded", async function () {
  // --- Configuración base ---
  const NUM_VENTANAS = 5;         // 5 pantallas verticales
  const NUM_CUADRANTES_H = 1;     // 2 cuadrantes horizontales (ajusta si quieres)

  // --- Datos de proyectos ---
  const proyectos = await fetch("proyectos.json").then(r => r.json());

  // --- DOM Elements ---
  const container = document.querySelector(".container--content");
  const canvas = document.getElementById("canvas-nubes");

  // --- Forma de la nube ---
  const nubeCSS = getComputedStyle(document.documentElement).getPropertyValue("--nube").trim();
  const nubeCoords = nubeCSS.replace(/^polygon\(|\)$/g, "")
    .split(",")
    .map(pt => pt.trim().split(" "))
    .map(([xs, ys]) => [parseFloat(xs) / 100, parseFloat(ys) / 100]);

  // --- Genera posiciones y tamaños con proporción 16:10 ---
  function calculaPosiciones() {
    let secciones = Array.from({ length: NUM_VENTANAS }, () => []);
    proyectos.forEach((p, i) => secciones[i % NUM_VENTANAS].push(p));
    let posiciones = [];
    secciones.forEach((projs, vIdx) => {
      projs.forEach((p, i) => {
        // Divide horizontalmente
        const hIdx = i % NUM_CUADRANTES_H;
        const leftBase = (hIdx / NUM_CUADRANTES_H) * 100;
        const leftMax = ((hIdx + 1) / NUM_CUADRANTES_H) * 100;

        // Rango vertical SOLO dentro de su ventana
        const topBase = vIdx * 100;
        const top = topBase + 10 + Math.random() * 70; // 10-80vh en ventana
        const left = leftBase + 5 + Math.random() * (leftMax - leftBase - 20);

        // Tamaño: ancho aleatorio y alto proporcionado
        const w = 16*2 + Math.random() * 50;  // ancho en vw (ajusta rango a tu gusto)
        const h = w * (10 / 16);            // alto en vw para 16:10
        posiciones.push({ top, left, w, h, proyecto: p });
      });
    });
    return posiciones;
  }

  // --- Inicializa Paper.js y ajusta canvas ---
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * NUM_VENTANAS;
    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
  }
  paper.setup(canvas);
  resizeCanvas();

  // --- Dibuja blobs y fusiona ---
  function dibujaBlobs(posiciones) {
    paper.project.activeLayer.removeChildren();
    let blobs = posiciones.map(({ top, left, w, h }) => {
      // vh/vw a px
      const x = (left / 100) * canvas.width;
      const y = (top / (NUM_VENTANAS * 100)) * canvas.height;
      const ancho = (w / 100) * canvas.width;
      const alto = (h / 100) * canvas.width * (10 / 16); // mantiene la proporción 16:10

      const path = new paper.Path();
      nubeCoords.forEach(([px, py], i) => {
        const pt = new paper.Point(x + px * ancho, y + py * alto);
        i === 0 ? path.moveTo(pt) : path.lineTo(pt);
      });
      path.closed = true;
      path.fillColor = getComputedStyle(document.documentElement).getPropertyValue("--color-2").trim();
      path.strokeColor = getComputedStyle(document.documentElement).getPropertyValue("--color-3").trim();
      path.strokeWidth = 8;
      path.shadowColor = new paper.Color(0, 0, 0, 0.2);
      path.shadowBlur = 24;
      return path;
    });

    // Fusiona blobs
    let fusionados = [];
    let usados = Array(blobs.length).fill(false);
    for (let i = 0; i < blobs.length; i++) {
      if (usados[i]) continue;
      let cur = blobs[i];
      for (let j = i + 1; j < blobs.length; j++) {
        if (usados[j]) continue;
        if (cur.bounds.intersects(blobs[j].bounds) && cur.intersects(blobs[j])) {
          cur = cur.unite(blobs[j]);
          blobs[j].remove();
          usados[j] = true;
        }
      }
      fusionados.push(cur);
      usados[i] = true;
    }
    fusionados.forEach(b => {
      b.strokeColor = getComputedStyle(document.documentElement).getPropertyValue("--color-3").trim();
      b.strokeWidth = 8;
      b.shadowColor = new paper.Color(0, 0, 0, 0.2);
      b.shadowBlur = 24;
    });

    paper.view.update();
  }

  // --- Renderiza las palabras (labels) por encima ---
  function dibujaLabels(posiciones) {
    container.innerHTML = "";
    posiciones.forEach(({ top, left, w, h, proyecto }) => {
      const nubeDiv = document.createElement('div');
      nubeDiv.className = 'nube-box';
      nubeDiv.style.top = `${top}vh`;
      nubeDiv.style.left = `${left}vw`;
      nubeDiv.style.width = `${w}vw`;
      nubeDiv.style.height = `${h}vw`; // Usa ancho para altura para respetar 16:10

      // Palabra, con enlace
      const label = document.createElement('div');
      label.className = 'nube-label';
      if (proyecto.links && proyecto.links.length > 0) {
        const a = document.createElement('a');
        a.href = proyecto.links[0];
        a.target = '_blank';
        a.textContent = proyecto.name || proyecto.titulo || 'Sin nombre';
        a.style.color = 'inherit';
        a.style.textDecoration = 'none';
        label.appendChild(a);
      } else {
        label.textContent = proyecto.name || proyecto.titulo || 'Sin nombre';
      }
      nubeDiv.appendChild(label);

      container.appendChild(nubeDiv);
    });
  }

  // --- Render principal ---
  let posiciones = calculaPosiciones();
  function renderAll() {
    resizeCanvas();
    dibujaBlobs(posiciones);
    dibujaLabels(posiciones);
  }

  window.addEventListener("resize", renderAll);
  renderAll();
});