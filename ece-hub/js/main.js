(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Electronic components ---------- */

  const grid = $("parts-grid");
  const search = $("search");
  const filters = $("filters");
  const cats = ["All", ...Object.keys(CATEGORIES)];
  let activeCat = "All";

  function renderFilters() {
    filters.innerHTML = cats
      .map((c) => `<button type="button" class="chip${c === activeCat ? " on" : ""}" data-cat="${c}" style="--c:${CATEGORIES[c] || "#18163a"}">${c}</button>`)
      .join("");
  }

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    renderFilters();
    renderParts();
  });

  function renderParts() {
    const q = search.value.trim().toLowerCase();
    const list = PARTS.filter((p) =>
      (activeCat === "All" || p.cat === activeCat) &&
      (p.name + " " + p.use).toLowerCase().includes(q)
    );

    grid.innerHTML = list.length
      ? list.map((p, i) => `
        <article class="part" style="--c:${CATEGORIES[p.cat]};--i:${i * 40}ms">
          <span class="badge">${p.sym}</span>
          <h3>${p.name}</h3>
          <p>${p.use}</p>
          <div class="meta"><span>${p.cat}</span><span class="val">${p.val}</span></div>
        </article>`).join("")
      : '<p class="muted">No parts match. Try a different word.</p>';
  }

  search.addEventListener("input", renderParts);

  /* ---------- Logic gates ---------- */

  const BUBBLE_GATES = ["NOT", "NAND", "NOR", "XNOR"];
  const gateState = { a: 0, b: 0 };
  let activeGate = 0;

  // Gate symbol drawn as SVG. Wires light up green when the output is 1.
  function gateSVG(g, y) {
    const body = g.name === "NOT"
      ? "M16 12V52L54 32Z"
      : g.name.endsWith("AND")
        ? "M16 12H34A20 20 0 0 1 34 52H16Z"
        : "M16 12Q36 12 54 32Q36 52 16 52Q26 32 16 12Z";
    const bubble = BUBBLE_GATES.includes(g.name);
    const inputs = g.n === 2 ? [22, 42] : [32];
    const extraCurve = g.name.startsWith("X") ? '<path d="M8 12Q28 32 8 52"/>' : "";

    return `
      <svg class="gate-svg" viewBox="0 0 80 64" aria-hidden="true">
        ${inputs.map((iy) => `<line class="wire" x1="0" y1="${iy}" x2="18" y2="${iy}"/>`).join("")}
        <path class="body" d="${body}"/>
        ${extraCurve}
        ${bubble ? '<circle class="bubble" cx="58" cy="32" r="4"/>' : ""}
        <line class="wire out${y ? " on" : ""}" x1="${bubble ? 62 : 54}" y1="32" x2="80" y2="32"/>
      </svg>`;
  }

  function renderGate() {
    const g = GATES[activeGate];
    const b = g.n === 2 ? gateState.b : 0;
    const y = g.fn(gateState.a, b);

    document.querySelectorAll("#gate-tabs .chip").forEach((el, i) =>
      el.classList.toggle("on", i === activeGate)
    );

    const labels = g.n === 2 ? ["A", "B"] : ["A"];
    $("inputs").innerHTML = labels
      .map((k) => {
        const key = k.toLowerCase();
        return `<button type="button" class="in-btn${gateState[key] ? " on" : ""}" data-in="${key}" aria-label="Input ${k}">
          <small>${k}</small>${gateState[key]}
        </button>`;
      })
      .join("");

    $("gate-svg").innerHTML = gateSVG(g, y);

    const lamp = $("lamp");
    lamp.textContent = `Y=${y}`;
    lamp.classList.toggle("on", y === 1);

    $("gate-name").textContent = `${g.name} gate`;
    $("gate-expr").textContent = g.expr;
    $("gate-use").textContent = g.use;
    $("gate-ex").textContent = g.ex;

    const rows = g.n === 2 ? [[0, 0], [0, 1], [1, 0], [1, 1]] : [[0], [1]];
    $("truth-head").innerHTML = `<tr>${(g.n === 2 ? ["A", "B", "Y"] : ["A", "Y"]).map((h) => `<th>${h}</th>`).join("")}</tr>`;
    $("truth-body").innerHTML = rows
      .map((r) => {
        const isCurrent = r[0] === gateState.a && (g.n === 1 || r[1] === gateState.b);
        return `<tr class="${isCurrent ? "hit" : ""}">${r.map((v) => `<td>${v}</td>`).join("")}<td>${g.fn(...r)}</td></tr>`;
      })
      .join("");
  }

  function setupLogic() {
    $("gate-tabs").innerHTML = GATES
      .map((g, i) => `<button type="button" class="chip" data-i="${i}">${g.name}</button>`)
      .join("");

    $("gate-tabs").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      activeGate = Number(btn.dataset.i);
      renderGate();
    });

    $("inputs").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      gateState[btn.dataset.in] ^= 1;
      renderGate();
    });

    renderGate();
  }

  /* ---------- VLSI roadmap ---------- */

  function renderRoadmap() {
    $("timeline").innerHTML = ROADMAP.map((s, i) => `
      <li class="step reveal" style="--c:${s.c};--d:${i * 0.12}s">
        <span class="step-no">${i + 1}</span>
        <div class="step-body">
          <h3>${s.title}</h3>
          <p class="muted">${s.sum}</p>
          <ul>${s.topics.map((t) => `<li>${t}</li>`).join("")}</ul>
          <p class="tline">Tools: ${s.tools}</p>
        </div>
      </li>`).join("");
  }

  /* ---------- 3D component lab (Three.js) ---------- */

  const mat = (color, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1, ...extra });

  const cyl = (r, h, color) =>
    new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32), mat(color));

  function resistor() {
    const g = new THREE.Group();
    const body = cyl(0.4, 2, 0xd9b382);
    body.rotation.z = Math.PI / 2;
    g.add(body);

    // Colour bands for 1 kΩ ±5%: brown, black, red, gold
    [0x7a3e14, 0x111111, 0xd62828, 0xd4af37].forEach((c, i) => {
      const band = cyl(0.41, 0.16, c);
      band.rotation.z = Math.PI / 2;
      band.position.x = -0.6 + i * 0.4;
      g.add(band);
    });

    [-1.75, 1.75].forEach((x) => {
      const lead = cyl(0.05, 1.5, 0xc0c0c0);
      lead.rotation.z = Math.PI / 2;
      lead.position.x = x;
      g.add(lead);
    });
    return g;
  }

  function capacitor() {
    const g = new THREE.Group();
    const disc = cyl(0.9, 0.35, 0xe0892b);
    disc.position.y = 0.6;
    g.add(disc);

    [-0.3, 0.3].forEach((x) => {
      const lead = cyl(0.04, 2, 0xc0c0c0);
      lead.position.set(x, -0.4, 0);
      g.add(lead);
    });
    return g;
  }

  function inductor() {
    const g = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.07, 12, 32),
        mat(0xb87333, { metalness: 0.6, roughness: 0.3 })
      );
      ring.rotation.y = Math.PI / 2;
      ring.position.x = -0.8 + i * 0.23;
      g.add(ring);
    }

    [-1.2, 1.2].forEach((x) => {
      const lead = cyl(0.04, 0.8, 0xc0c0c0);
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
      mat(0xff4040, { transparent: true, opacity: 0.8, emissive: 0x551010 })
    );
    dome.position.y = 0.1;
    g.add(dome, cyl(0.75, 0.2, 0xb22222));

    // The anode (+) lead is the longer one
    const anode = cyl(0.05, 2, 0xc0c0c0);
    anode.position.set(0.2, -1.1, 0);
    const cathode = cyl(0.05, 1.4, 0xc0c0c0);
    cathode.position.set(-0.2, -0.8, 0);
    g.add(anode, cathode);
    return g;
  }

  function dipIC() {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.4), mat(0x1d1f23, { roughness: 0.7 })));

    // Notch that marks pin 1
    const notch = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), mat(0xaaaaaa));
    notch.position.set(-0.4, 0.27, -1.0);
    g.add(notch);

    const pinMat = mat(0xc0c0c0, { metalness: 0.8, roughness: 0.3 });
    for (let i = 0; i < 4; i++) {
      const z = -0.9 + i * 0.6;
      [-0.6, 0.6].forEach((x) => {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), pinMat);
        pin.position.set(x, -0.55, z);
        g.add(pin);
      });
    }
    return g;
  }

  function initViewer() {
    const host = $("viewer");
    const buttons = $("model-buttons");

    if (typeof THREE === "undefined") {
      host.innerHTML = '<p class="muted" style="padding:24px">The 3D viewer needs an internet connection to load Three.js.</p>';
      return;
    }

    const models = { Resistor: resistor, Capacitor: capacitor, Inductor: inductor, LED: led, "DIP-8 IC": dipIC };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 4, 5);
    const fill = new THREE.DirectionalLight(0xfbbf24, 0.4);
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
      buttons.querySelectorAll(".chip").forEach((b) => b.classList.toggle("on", b.dataset.name === name));
    }

    buttons.innerHTML = Object.keys(models)
      .map((name) => `<button type="button" class="chip" data-name="${name}">${name}</button>`)
      .join("");
    buttons.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) show(btn.dataset.name);
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

    (function animate() {
      requestAnimationFrame(animate);
      if (!dragging && !reduceMotion) pivot.rotation.y += 0.005;
      renderer.render(scene, camera);
    })();

    show("Resistor");
  }

  /* ---------- Scroll reveal ---------- */

  function revealOnScroll() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Start ---------- */

  renderFilters();
  renderParts();
  setupLogic();
  renderRoadmap();
  initViewer();
  revealOnScroll();
})();
