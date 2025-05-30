window.addEventListener("DOMContentLoaded", async () => {
  // Parámetros de generación
  const TOTAL_HEIGHT_VH = 500;
  const NUM_NUBES_DEFAULT = 25;
  let NUM_NUBES;

  // Detectamos móvil por anchura
  const isMobile = window.innerWidth <= 600;

  // Tamaño base de la nube (px) y escala según dispositivo
  const BASE_SIZE_PX = isMobile ? 150 : 200; // nube más pequeña en móvil
  const MIN_SCALE = isMobile ? 0.4 : 0.6;
  const MAX_SCALE = isMobile ? 1.2 : 2.0;

  // Referencias DOM
  const canvas = document.getElementById("canvas-nubes");
  const container = document.querySelector(".container--content");
  const btnOpen = document.getElementById("open-fun");
  const panelTheme = document.getElementById("theme-panel");
  const selTheme = document.getElementById("theme-select");
  const divPickers = document.getElementById("color-pickers");
  const btnApply = document.getElementById("apply-theme");

  // Número de nubes por defecto
  NUM_NUBES = NUM_NUBES_DEFAULT;

  // Carga datos de proyectos
  const proyectos = await fetch("proyectos.json").then((r) => r.json());

  // Al principio de main.js
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      render(); // o location.reload();
    }, 300);
  });

  // --- Helper: extrae coords normalizadas de CSS --nube ---
  function getNubeCoords() {
    const nubeCSS = getComputedStyle(document.documentElement)
      .getPropertyValue("--nube")
      .trim();
    return nubeCSS
      .replace(/^polygon\(|\)$/g, "")
      .split(",")
      .map((pt) => pt.trim().split(" "))
      .map(([xs, ys]) => [parseFloat(xs) / 100, parseFloat(ys) / 100]);
  }
  const nubeCoords = getNubeCoords();

  // --- Inicializa canvas de Paper.js y ajuste en resize ---
  paper.setup(canvas);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * (TOTAL_HEIGHT_VH / 100);
    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // --- Genera semillas aleatorias con escala y proyecto asociado ---
  function generaSemillas() {
    return Array.from({ length: NUM_NUBES }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      scale: MIN_SCALE + Math.random() * (MAX_SCALE - MIN_SCALE),
      proyecto: proyectos[i % proyectos.length],
    }));
  }

  // --- Dibuja nubes y unifica intersecciones ---
  function dibujaNubes(semillas) {
    paper.project.activeLayer.removeChildren();

    // Para cada semilla, creamos su path
    const paths = semillas.map((s) => {
      const path = new paper.Path();
      // anchura y altura reales de esta nube
      const width = BASE_SIZE_PX * s.scale;
      const height = width * (10 / 16);

      nubeCoords.forEach(([px, py], i) => {
        // trasladamos el polígono para que gire alrededor de (s.x, s.y)
        // normalizamos px,py en [0,1] → luego restamos 0.5 para centrar
        const pxAbs = s.x + (px - 0.5) * width;
        const pyAbs = s.y + (py - 0.5) * height;
        if (i === 0) path.moveTo(pxAbs, pyAbs);
        else path.lineTo(pxAbs, pyAbs);
      });
      path.closed = true;
      // Obtener colores de CSS con fallback para no asignar ""
      const fill =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-2")
          .trim() || "#ffffff";
      const stroke =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-3")
          .trim() || "#000000";
      path.fillColor = fill;
      path.strokeColor = stroke;
      path.strokeWidth = 6;
      return path;
    });

    // Unir solapamientos para super-nubes
    const usados = Array(paths.length).fill(false);
    const fusionados = [];
    for (let i = 0; i < paths.length; i++) {
      if (usados[i]) continue;
      let cur = paths[i];
      for (let j = i + 1; j < paths.length; j++) {
        if (usados[j]) continue;
        if (cur.bounds.intersects(paths[j].bounds)) {
          cur = cur.unite(paths[j]);
          paths[j].remove();
          usados[j] = true;
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
    semillas.forEach((s) => {
      const div = document.createElement("div");
      div.className = "label";
      div.style.left = `${s.x}px`;
      div.style.top = `${s.y}px`;
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
      .flatMap((sheet) => {
        try {
          // Si no da error, devolvemos sus reglas
          return Array.from(sheet.cssRules);
        } catch (e) {
          // Si hay error CORS, ignoramos este sheet
          return [];
        }
      })
      // Nos quedamos solo con la regla :root
      .filter((rule) => rule.selectorText === ":root")
      // Aplanamos todas las propiedades CSS de esa regla
      .flatMap((rule) => [...rule.style])
      // Filtramos las que sean theme-*-color-1
      .filter((name) => name.startsWith("theme-") && name.endsWith("-color-1"))
      // Quitamos el sufijo para quedarnos con el prefijo de tema
      .map((name) => name.replace("-color-1", ""));

    // 2) Llenamos el <select> con cada tema detectado
    cssVars.forEach((prefijo) => {
      const option = document.createElement("option");
      option.value = prefijo;
      option.textContent = prefijo.replace("theme-", "");
      selTheme.appendChild(option);
    });

    // 1) Seleccionamos la primera paleta automáticamente
    selTheme.selectedIndex = 0;

    // 2) Disparamos el cambio para que cree los pickers
    selTheme.dispatchEvent(new Event("change"));

    // 3) (Opcional) Aplicamos directamente los colores base de esa paleta
    btnApply.click();

    // 4) Luego añadimos tu listener normal de “change” para el usuario
    selTheme.addEventListener("change", () => {
      divPickers.innerHTML = ""; // limpiamos viejos pickers
      const pref = selTheme.value; // p.ej. "theme-monochrome"

      [1, 2, 3, 4].forEach((i) => {
        const varName = `--${pref}-color-${i}`;

        // 1) Leemos el valor actual del tema, validamos o usamos blanco por defecto
        let raw = getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim();
        const safe = /^#([0-9A-F]{6})$/i.test(raw) ? raw : "#ffffff";

        // 2) Montamos el picker con un value seguro
        const pickerWrap = document.createElement("div");
        pickerWrap.innerHTML = `
  <label>
    ${varName}
    <input 
      type="color" 
      data-var="--color-${i}" 
      data-theme-var="${varName}"
      value="${safe}"
    />
  </label>
`;
        divPickers.appendChild(pickerWrap);
      }); // <-- aquí cerramos el forEach
    }); // <-- y aquí cerramos el callback de 'change'

    // 4) Al hacer click en "Aplicar", reasignamos variables y overrides
    btnApply.addEventListener("click", () => {
      const pref = selTheme.value;

      // 4.1) Reasignamos los 4 colores base del tema
      [1, 2, 3, 4].forEach((i) => {
        const themeVar = `--${pref}-color-${i}`; // variable origen
        const targetVar = `--color-${i}`; // variable activa
        const val = getComputedStyle(document.documentElement)
          .getPropertyValue(themeVar)
          .trim();
        document.documentElement.style.setProperty(targetVar, val);
      });

      // 4.2) Aplicamos overrides de cada picker
      divPickers.querySelectorAll("input[type=color]").forEach((input) => {
        // data-var = "--color-i", data-theme-var = "--theme-...-color-i"
        const tv = input.dataset["targetVar"] || input.dataset["var"];
        document.documentElement.style.setProperty(tv, input.value);
      });

      // 4.3) Re-renderiza para ver los cambios
      render();
    });

    // 5) Botón "Open Fun" muestra/oculta el panel
    btnOpen.addEventListener("click", () => {
      panelTheme.classList.toggle("hidden");
      // Si lo mostramos, disparamos 'change' para cargar pickers
      if (!panelTheme.classList.contains("hidden")) {
        selTheme.dispatchEvent(new Event("change"));
      }
    });
  }

  // --- Inicialización ---
  // --- Inicialización ---
// --- Inicialización ---
initThemeSwitcher();
// ya no necesitas volver a forzar el dispatch/change aquí
// porque lo haces dentro de initThemeSwitcher
render();
});
