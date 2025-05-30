window.addEventListener("DOMContentLoaded", async () => {
  // Parámetros de generación
  const TOTAL_HEIGHT_VH = 500;
  const NUM_NUBES = 25;
  const BASE_SIZE_PX = 200;      // tamaño base de nube para scale=1
  const MIN_SCALE = 0.6;
  const MAX_SCALE = 2.0;

  // Referencias DOM
  const canvas        = document.getElementById("canvas-nubes");
  const container     = document.querySelector(".container--content");
  const btnOpen       = document.getElementById("open-fun");
  const panelTheme    = document.getElementById("theme-panel");
  const selTheme      = document.getElementById("theme-select");
  const divPickers    = document.getElementById("color-pickers");
  const btnApply      = document.getElementById("apply-theme");

  // Carga datos de proyectos
  const proyectos = await fetch("proyectos.json").then(r => r.json());

  // --- Helper: extrae coords normalizadas de CSS --nube ---
  function getNubeCoords() {
    const nubeCSS = getComputedStyle(document.documentElement)
                      .getPropertyValue("--nube").trim();
    return nubeCSS
      .replace(/^polygon\(|\)$/g, "")
      .split(",")
      .map(pt => pt.trim().split(" "))
      .map(([xs, ys]) => [parseFloat(xs)/100, parseFloat(ys)/100]);
  }
  const nubeCoords = getNubeCoords();

  // --- Inicializa canvas de Paper.js y ajuste en resize ---
  paper.setup(canvas);
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight * (TOTAL_HEIGHT_VH/100);
    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // --- Genera semillas aleatorias con escala y proyecto asociado ---
  function generaSemillas() {
    return Array.from({ length: NUM_NUBES }, (_, i) => {
      return {
        x      : Math.random()*canvas.width,
        y      : Math.random()*canvas.height,
        scale  : MIN_SCALE + Math.random()*(MAX_SCALE-MIN_SCALE),
        proyecto: proyectos[i % proyectos.length]
      };
    });
  }

  // --- Dibuja nubes y unifica intersecciones ---
  function dibujaNubes(semillas) {
    paper.project.activeLayer.removeChildren();
    const paths = semillas.map(s => {
      const path = new paper.Path();
      nubeCoords.forEach(([px,py], idx) => {
        const pxAbs = s.x + px*BASE_SIZE_PX*s.scale;
        const pyAbs = s.y + py*(BASE_SIZE_PX*10/16)*s.scale;
        idx === 0 ? path.moveTo(pxAbs, pyAbs) : path.lineTo(pxAbs, pyAbs);
      });
      path.closed = true;
      path.fillColor   = getComputedStyle(document.documentElement)
                           .getPropertyValue("--color-2").trim();
      path.strokeColor = getComputedStyle(document.documentElement)
                           .getPropertyValue("--color-3").trim();
      path.strokeWidth = 6;
      return path;
    });

    // Unir solapamientos para super-nubes
    const usados = Array(paths.length).fill(false);
    const fusionados = [];
    for (let i = 0; i < paths.length; i++) {
      if (usados[i]) continue;
      let cur = paths[i];
      for (let j = i+1; j < paths.length; j++) {
        if (usados[j]) continue;
        if (cur.bounds.intersects(paths[j].bounds)) {
          cur = cur.unite(paths[j]);
          paths[j].remove(); usados[j] = true;
        }
      }
      fusionados.push(cur);
      usados[i] = true;
    }
    paper.view.update();
  }

  // --- Coloca etiquetas centradas en cada semilla ---
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
        a.target = "_blank";
        a.textContent = texto;
        div.appendChild(a);
      } else {
        div.textContent = texto;
      }
      container.appendChild(div);
    });
  }

  // --- Render completo: nubes + labels ---
  function render() {
    const semillas = generaSemillas();
    dibujaNubes(semillas);
    pintaLabels(semillas);
  }

// --- Theme switcher: lista de paletas en :root ---
// --- Theme switcher: lista de paletas en :root ---
function initThemeSwitcher() {
  // 1) Buscamos todas las variables de tema en :root
  //    Protegemos el acceso a cssRules con try/catch para evitar SecurityError.
  const cssVars = Array.from(document.styleSheets)
    .flatMap(sheet => {
      try {
        // Si no da error, devolvemos sus reglas
        return Array.from(sheet.cssRules);
      } catch (e) {
        // Si hay error CORS, ignoramos este sheet
        return [];
      }
    })
    // Nos quedamos solo con la regla :root
    .filter(rule => rule.selectorText === ':root')
    // Aplanamos todas las propiedades CSS de esa regla
    .flatMap(rule => [...rule.style])
    // Filtramos las que sean theme-*-color-1
    .filter(name => name.startsWith('theme-') && name.endsWith('-color-1'))
    // Quitamos el sufijo para quedarnos con el prefijo de tema
    .map(name => name.replace('-color-1', ''));

  // 2) Llenamos el <select> con cada tema detectado
  cssVars.forEach(prefijo => {
    const option = document.createElement('option');
    option.value = prefijo;                       // e.g. "theme-monochrome"
    option.textContent = prefijo.replace('theme-', ''); // e.g. "monochrome"
    selTheme.appendChild(option);
  });

  // 3) Al cambiar la selección, creamos 4 color pickers
  selTheme.addEventListener('change', () => {
    divPickers.innerHTML = '';    // limpiamos viejos pickers
    const pref = selTheme.value;  // p.ej. "theme-monochrome"

    [1, 2, 3, 4].forEach(i => {
      const varName = `--${pref}-color-${i}`; // "--theme-monochrome-color-1"
      const pickerWrap = document.createElement('div');
      pickerWrap.innerHTML = `
        <label>${varName}</label>
        <input 
          type="color" 
          data-var="--color-${i}" 
          data-theme-var="${varName}"
          value="${getComputedStyle(document.documentElement)
                    .getPropertyValue(varName).trim()}" 
        />
      `;
      divPickers.appendChild(pickerWrap);
    });
  });

  // 4) Al hacer click en "Aplicar", reasignamos variables y overrides
  btnApply.addEventListener('click', () => {
    const pref = selTheme.value;

    // 4.1) Reasignamos los 4 colores base del tema
    [1, 2, 3, 4].forEach(i => {
      const themeVar  = `--${pref}-color-${i}`; // variable origen
      const targetVar = `--color-${i}`;          // variable activa
      const val = getComputedStyle(document.documentElement)
                    .getPropertyValue(themeVar).trim();
      document.documentElement.style.setProperty(targetVar, val);
    });

    // 4.2) Aplicamos overrides de cada picker
    divPickers.querySelectorAll('input[type=color]').forEach(input => {
      // data-var = "--color-i", data-theme-var = "--theme-...-color-i"
      const tv = input.dataset['targetVar'] || input.dataset['var'];
      document.documentElement.style.setProperty(tv, input.value);
    });

    // 4.3) Re-renderiza para ver los cambios
    render();
  });

  // 5) Botón "Open Fun" muestra/oculta el panel
  btnOpen.addEventListener('click', () => {
    panelTheme.classList.toggle('hidden');
    // Si lo mostramos, disparamos 'change' para cargar pickers
    if (!panelTheme.classList.contains('hidden')) {
      selTheme.dispatchEvent(new Event('change'));
    }
  });
}

  // --- Inicialización ---
  initThemeSwitcher();
  render();
});