(function () {
  "use strict";

  /* ---------- Electronic components ---------- */

  const listEl = document.getElementById("parts-list");
  const searchEl = document.getElementById("search");
  const filtersEl = document.getElementById("filters");
  const categories = ["All", ...new Set(PARTS.map((p) => p.category))];
  let activeCategory = "All";

  function renderFilters() {
    filtersEl.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (cat === activeCategory ? " is-active" : "");
      btn.textContent = cat;
      btn.setAttribute("aria-pressed", String(cat === activeCategory));
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderFilters();
        renderParts();
      });
      filtersEl.appendChild(btn);
    });
  }

  function renderParts() {
    const q = searchEl.value.trim().toLowerCase();
    const shown = PARTS.filter((p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(q) || p.use.toLowerCase().includes(q))
    );

    listEl.innerHTML = shown.length ? "" : '<p class="muted">No parts match that search.</p>';
    shown.forEach((p) => {
      const row = document.createElement("div");
      row.className = "part";
      row.setAttribute("role", "listitem");
      row.innerHTML = `
        <span class="symbol">${p.symbol}</span>
        <div>
          <h3>${p.name}</h3>
          <p>${p.use}</p>
        </div>
        <span class="cat">${p.category}</span>
        <span class="typical">${p.typical}</span>`;
      listEl.appendChild(row);
    });
  }

  /* ---------- VLSI roadmap ---------- */

  function renderRoadmap() {
    document.getElementById("timeline").innerHTML = ROADMAP.map((step, i) => `
      <li class="step">
        <span class="step-no">${i + 1}</span>
        <div>
          <h3>${step.title}</h3>
          <p class="muted">${step.summary}</p>
          <ul>${step.topics.map((t) => `<li>${t}</li>`).join("")}</ul>
          <p class="tools-line"><strong>Tools:</strong> ${step.tools}</p>
        </div>
      </li>`).join("");
  }

  /* ---------- 3D component lab (Three.js) ---------- */

  function material(color, extra = {}) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.1, ...extra });
  }

  function cylinder(radius, height, color) {
    return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 32), material(color));
  }

  function resistor() {
    const g = new THREE.Group();
    const body = cylinder(0.4, 2, 0xd9b382);
    body.rotation.z = Math.PI / 2;
    g.add(body);

    // Color bands for 1 kΩ ±5%: brown, black, red, gold
    [0x7a3e14, 0x111111, 0xd62828, 0xd4af37].forEach((color, i) => {
      const band = cylinder(0.41, 0.16, color);
      band.rotation.z = Math.PI / 2;
      band.position.x = -0.6 + i * 0.4;
      g.add(band);
    });

    [-1.75, 1.75].forEach((x) => {
      const lead = cylinder(0.05, 1.5, 0xc0c0c0);
      lead.rotation.z = Math.PI / 2;
      lead.position.x = x;
      g.add(lead);
    });
    return g;
  }

  function capacitor() {
    const g = new THREE.Group();
    const disc = cylinder(0.9, 0.35, 0xe0892b);
    disc.position.y = 0.6;
    g.add(disc);

    [-0.3, 0.3].forEach((x) => {
      const lead = cylinder(0.04, 2, 0xc0c0c0);
      lead.position.set(x, -0.4, 0);
      g.add(lead);
    });
    return g;
  }

  function inductor() {
    const g = new THREE.Group();
    const copper = { metalness: 0.6, roughness: 0.3 };
    for (let i = 0; i < 8; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.07, 12, 32),
        material(0xb87333, copper)
      );
      ring.rotation.y = Math.PI / 2;
      ring.position.x = -0.8 + i * 0.23;
      g.add(ring);
    }

    [-1.2, 1.2].forEach((x) => {
      const lead = cylinder(0.04, 0.8, 0xc0c0c0);
      lead.rotation.z = Math.PI / 2;
      lead.position.x = x;
      g.add(lead);
    });
    return g;
  }

  function led() {
    const g = new THREE.Group();
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      material(0xff4040, { transparent: true, opacity: 0.8, emissive: 0x551010 })
    );
    dome.position.y = 0.1;
    g.add(dome);

    g.add(cylinder(0.75, 0.2, 0xb22222));

    // The anode (+) lead is longer than the cathode (-) lead
    const anode = cylinder(0.05, 2, 0xc0c0c0);
    anode.position.set(0.2, -1.1, 0);
    g.add(anode);

    const cathode = cylinder(0.05, 1.4, 0xc0c0c0);
    cathode.position.set(-0.2, -0.8, 0);
    g.add(cathode);
    return g;
  }

  function dipIC() {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.4), material(0x1d1f23, { roughness: 0.7 })));

    // Notch that marks pin 1
    const notch = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), material(0xaaaaaa));
    notch.position.set(-0.4, 0.27, -1.0);
    g.add(notch);

    const pinMaterial = material(0xc0c0c0, { metalness: 0.8, roughness: 0.3 });
    for (let i = 0; i < 4; i++) {
      const z = -0.9 + i * 0.6;
      [-0.6, 0.6].forEach((x) => {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), pinMaterial);
        pin.position.set(x, -0.55, z);
        g.add(pin);
      });
    }
    return g;
  }

  function initViewer() {
    const host = document.getElementById("viewer");
    const buttons = document.getElementById("model-buttons");

    if (typeof THREE === "undefined") {
      host.innerHTML = '<p class="muted">The 3D viewer needs an internet connection to load Three.js.</p>';
      return;
    }

    const models = {
      Resistor: resistor,
      Capacitor: capacitor,
      Inductor: inductor,
      LED: led,
      "DIP-8 IC": dipIC
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a2019);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 4, 5);
    const fill = new THREE.DirectionalLight(0xffe2b8, 0.35);
    fill.position.set(-4, -2, -3);
    scene.add(key, fill);

    const pivot = new THREE.Group();
    scene.add(pivot);
    let current = null;

    function show(name) {
      if (current) pivot.remove(current);
      current = models[name]();
      pivot.add(current);
      pivot.rotation.set(0.25, -0.6, 0);
      camera.position.z = 6;
      buttons.querySelectorAll("button").forEach((b) =>
        b.classList.toggle("is-active", b.textContent === name)
      );
    }

    Object.keys(models).forEach((name) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = name;
      btn.addEventListener("click", () => show(name));
      buttons.appendChild(btn);
    });

    // Drag to rotate, scroll to zoom
    const canvas = renderer.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener("pointerdown", (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      pivot.rotation.y += (e.clientX - lastX) * 0.01;
      pivot.rotation.x += (e.clientY - lastY) * 0.01;
      lastX = e.clientX;
      lastY = e.clientY;
    });
    ["pointerup", "pointercancel"].forEach((type) =>
      canvas.addEventListener(type, () => { dragging = false; })
    );
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.004, 3, 10);
    }, { passive: false });

    function resize() {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    // Slow auto-rotation, disabled when the user prefers reduced motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (function animate() {
      requestAnimationFrame(animate);
      if (!dragging && !reduceMotion) pivot.rotation.y += 0.004;
      renderer.render(scene, camera);
    })();

    show("Resistor");
  }

  /* ---------- Start ---------- */

  searchEl.addEventListener("input", renderParts);
  renderFilters();
  renderParts();
  renderRoadmap();
  initViewer();
})();
