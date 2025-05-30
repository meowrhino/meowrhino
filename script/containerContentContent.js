// script/containerContentContent.js

document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container--content");
  const nubeCSS = getComputedStyle(document.documentElement)
    .getPropertyValue("--nube")
    .trim();
  const nubeCoords = nubeCSS
    .replace(/^polygon\(|\)$/g, "")
    .split(",")
    .map((pt) => pt.trim().split(" "))
    .map(([xs, ys]) => [parseFloat(xs) / 100, parseFloat(ys) / 100]);

  // Ajusta estos valores para cambiar la cuadrícula (pantallas x columnas)
  const NUM_VENTANAS = 5;   // vertical (scroll)
  const NUM_COLS = 3;       // horizontal

  function resizeCanvas() {
    const canvas = document.getElementById("canvas-nubes");
    if (!canvas) return;
    const content = document.querySelector(".container--content");
    canvas.width = window.innerWidth;
    canvas.height = content.scrollHeight;
    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
  }

  const canvas = document.getElementById("canvas-nubes");
  if (!canvas) return;
  paper.setup("canvas-nubes");
  resizeCanvas();

  function getRandomBetween(min, max) {
    return min + Math.random() * (max - min);
  }
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

  // --- NUEVO: Distribución 2D en cuadrícula ---
  function getPositions(items) {
    // Calcula las celdas
    const numSlots = NUM_VENTANAS * NUM_COLS;
    // Si hay más items que slots, se pueden superponer (tuneable)
    const slots = [];
    for (let v = 0; v < NUM_VENTANAS; v++) {
      for (let c = 0; c < NUM_COLS; c++) {
        slots.push({ v, c });
      }
    }
    // Aleatoriza slots para no tener siempre el mismo orden
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    // Reparte items por slots, si hay más items que slots, repite (aleatorio)
    const positions = items.map((item, i) => {
      const slot = slots[i % slots.length];
      const ventanaHeightPct = 1 / NUM_VENTANAS;
      const colWidthPct = 1 / NUM_COLS;

      // Sortea dentro de la celda (con márgenes)
      const yMin = slot.v * ventanaHeightPct;
      const yMax = (slot.v + 1) * ventanaHeightPct;
      const xMin = slot.c * colWidthPct;
      const xMax = (slot.c + 1) * colWidthPct;

      const topPct = getRandomBetween(yMin + 0.07, yMax - 0.18);
      const leftPct = getRandomBetween(xMin + 0.03, xMax - 0.28);

      // Tamaño relativo a viewport
      const widthPct = 0.28 + Math.random() * 0.06; // entre 28-34vw
      const heightPct = widthPct / 1.55;

      return { leftPct, topPct, widthPct, heightPct };
    });
    return positions;
  }

  function createBlobPx({leftPct, topPct, widthPct, heightPct}, cw, ch) {
    const x = leftPct * cw;
    const y = topPct * ch;
    const w = widthPct * cw;
    const h = heightPct * ch;

    const path = new paper.Path();
    nubeCoords.forEach(([px, py], i) => {
      const pt = new paper.Point(x + px * w, y + py * h);
      i === 0 ? path.moveTo(pt) : path.lineTo(pt);
    });
    path.closePath();
    path.fillColor = getComputedStyle(document.documentElement).getPropertyValue("--color-2").trim();
    path.strokeColor = getComputedStyle(document.documentElement).getPropertyValue("--color-3").trim();
    path.strokeWidth = 8;
    path.shadowColor = new paper.Color(0, 0, 0, 0.2);
    path.shadowBlur = 16;
    return path;
  }

  function createTextBoxPx(item, pos, cw, ch) {
    const x = pos.leftPct * cw;
    const y = pos.topPct * ch;
    const w = pos.widthPct * cw;
    const h = pos.heightPct * ch;

    const box = document.createElement("div");
    box.classList.add("box", "box--title");
    Object.assign(box.style, {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
      zIndex: 2
    });

    const links = item.links || [];
    if (links.length <= 1) {
      const h5 = document.createElement("h5");
      const a = document.createElement("a");
      a.href = links[0] || "#";
      a.textContent = item.name;
      a.target = "_blank";
      h5.appendChild(a);
      box.appendChild(h5);
    } else {
      box.classList.add("flex-column");
      const h4 = document.createElement("h4");
      h4.textContent = item.name;
      box.appendChild(h4);
      const p = document.createElement("p");
      links.forEach((ln, i) => {
        const span = document.createElement("span");
        const a = document.createElement("a");
        a.href = ln;
        a.textContent = getRomanIndex(i + 1);
        a.target = "_blank";
        span.appendChild(a);
        p.appendChild(span);
      });
      box.appendChild(p);
    }
    container.appendChild(box);
  }

  function fuseBlobs(blobs) {
    const merged = [];
    const used = Array(blobs.length).fill(false);
    for (let i = 0; i < blobs.length; i++) {
      if (used[i]) continue;
      let cur = blobs[i];
      for (let j = i + 1; j < blobs.length; j++) {
        if (used[j]) continue;
        if (cur.bounds.intersects(blobs[j].bounds) && cur.intersects(blobs[j])) {
          cur = cur.unite(blobs[j]);
          blobs[j].remove();
          used[j] = true;
        }
      }
      merged.push(cur);
      used[i] = true;
    }
    return merged;
  }

  let blobs = [];
  let itemsData = [];
  let positions = [];
  function render() {
    paper.project.activeLayer.removeChildren();
    container.innerHTML = "";
    blobs = [];

    const cw = container.scrollWidth;
    const ch = container.scrollHeight;

    itemsData.forEach((item, idx) => {
      blobs.push(createBlobPx(positions[idx], cw, ch));
      createTextBoxPx(item, positions[idx], cw, ch);
    });

    fuseBlobs(blobs);
    paper.view.update();
  }

  function throttle(fn, limit) {
    let busy = false;
    return (...args) => {
      if (!busy) {
        fn(...args);
        busy = true;
        setTimeout(() => (busy = false), limit);
      }
    };
  }

  window.addEventListener("resize", throttle(() => {
    resizeCanvas();
    render();
  }, 200));

  fetch("proyectos.json")
    .then((r) => r.json())
    .then((data) => {
      itemsData = data;
      positions = getPositions(itemsData);
      render();
    })
    .catch((e) => console.error(e));
});