/* =====================================================================
   3D SCENE — glowing core orbited by floating "documents"
   body[data-scene="full"]  home hero, big and interactive
   body[data-scene="soft"]  inner pages, smaller, in the page header
   ===================================================================== */
(() => {
  if (!window.THREE || !window.AM) return;
  const AM = window.AM, SV = AM.SV, reduced = AM.reduced;
  const mode = document.body.dataset.scene || "soft";
  const canvas = document.getElementById("scene");
  if (!canvas) return;
  const focus = AM.qs("id") && AM.svcById(AM.qs("id"));     // a service page tints the scene with its colour

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060914, 0.045);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 11);
  const world = new THREE.Group(); scene.add(world);

  const accent = new THREE.Color(focus ? focus.color : "#2ee6a8");
  const ambient = new THREE.AmbientLight(0x8899ff, 0.35); scene.add(ambient);
  const l1 = new THREE.PointLight(accent, 2.2, 30); l1.position.set(-4, 3, 5); scene.add(l1);
  const l2 = new THREE.PointLight(0xf5c46b, 2.0, 30); l2.position.set(5, -2, 4); scene.add(l2);
  const l3 = new THREE.PointLight(0x8b7bff, 1.4, 30); l3.position.set(0, 5, -4); scene.add(l3);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, 1),
    new THREE.MeshStandardMaterial({ color: 0x0d1630, metalness: .9, roughness: .15, flatShading: true, emissive: 0x0b3b2e, emissiveIntensity: .6 })
  );
  world.add(core);
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.9, 1)),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: .45 })
  );
  world.add(shell);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(2.4, 32, 32), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: .05, side: THREE.BackSide }));
  world.add(halo);
  const rings = [0xf5c46b, accent.getHex(), 0x8b7bff].map((c, i) => {
    const r = new THREE.Mesh(new THREE.TorusGeometry(2.7 + i * .55, .012, 8, 160), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .55 - i * .12 }));
    r.rotation.set(Math.PI / 2 + (i - 1) * .5, i * .4, 0);
    world.add(r); return r;
  });

  function docTexture(s, i) {
    const c = document.createElement("canvas"); c.width = 256; c.height = 340;
    const g = c.getContext("2d");
    const grd = g.createLinearGradient(0, 0, 256, 340);
    grd.addColorStop(0, "#141d3a"); grd.addColorStop(1, "#0a0f22");
    g.fillStyle = grd; g.fillRect(0, 0, 256, 340);
    g.strokeStyle = s.color; g.lineWidth = 4; g.strokeRect(2, 2, 252, 336);
    g.fillStyle = s.color; g.fillRect(176, 22, 60, 8);
    g.font = "600 28px 'Noto Kufi Arabic', sans-serif"; g.textAlign = "right"; g.direction = "rtl";
    wrap(g, s.ar, 236, 80, 214, 40);
    g.direction = "ltr"; g.textAlign = "left";
    g.fillStyle = "rgba(255,255,255,.18)";
    for (let k = 0; k < 5; k++) g.fillRect(20, 196 + k * 20, 216 - (k % 3) * 40, 6);
    g.strokeStyle = s.color; g.lineWidth = 3; g.globalAlpha = .8;
    g.beginPath(); g.arc(200, 300, 22, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(200, 300, 14, 0, Math.PI * 2); g.stroke();
    g.globalAlpha = 1; g.font = "700 14px Manrope, sans-serif"; g.fillStyle = s.color;
    g.fillText(AM.pad(i + 1), 20, 312);
    const tx = new THREE.CanvasTexture(c); tx.anisotropy = 4; return tx;
  }
  function wrap(g, text, x, y, maxW, lh) {
    const words = text.split(" "); let line = "";
    g.fillStyle = "#eef2ff";
    words.forEach(w => {
      const test = line ? line + " " + w : w;
      if (g.measureText(test).width > maxW && line) { g.fillText(line, x, y); line = w; y += lh; }
      else line = test;
    });
    g.fillText(line, x, y);
  }

  const docs = [];
  const docGeo = new THREE.BoxGeometry(1.05, 1.4, .03);
  const list = focus ? [focus, ...SV.filter(s => s !== focus).slice(0, 5)] : SV;
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    list.forEach((s, i) => {
      const tex = docTexture(s, SV.indexOf(s));
      const side = new THREE.MeshStandardMaterial({ color: new THREE.Color(s.color), metalness: .4, roughness: .4, emissive: new THREE.Color(s.color), emissiveIntensity: .25 });
      const face = new THREE.MeshStandardMaterial({ map: tex, metalness: .2, roughness: .5, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: .55 });
      const m = new THREE.Mesh(docGeo, [side, side, side, side, face, face]);
      const pivot = new THREE.Group();
      pivot.rotation.set((Math.random() - .5) * 1.1, 0, (Math.random() - .5) * .8);
      const radius = 3.0 + (i % 3) * .6;
      m.userData = { a: (i / list.length) * Math.PI * 2, speed: .08 + Math.random() * .07, radius, bob: Math.random() * 6, spin: (Math.random() - .5) * .6 };
      if (focus && i === 0) m.scale.setScalar(1.35);
      pivot.add(m); world.add(pivot); docs.push(m);
    });
  });

  const N = innerWidth < 760 ? 600 : (mode === "full" ? 1600 : 900);
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const pal = [accent.getHex(), 0xf5c46b, 0x8b7bff, 0xffffff].map(c => new THREE.Color(c));
  for (let i = 0; i < N; i++) {
    const r = 4 + Math.random() * 22, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * .6, r * Math.sin(ph) * Math.sin(th) - 4], i * 3);
    const c = pal[(Math.random() * pal.length) | 0]; col.set([c.r, c.g, c.b], i * 3);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: .05, vertexColors: true, transparent: true, opacity: .85, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(stars);

  // the object sits opposite the text: right in English, left in Arabic
  let baseX = 0, baseY = 0;
  const side = () => {
    const wide = innerWidth > 960, AR = AM.isAR();
    if (mode === "full") { baseX = wide ? (AR ? -3.9 : 3.9) : 0; baseY = 0; world.scale.setScalar(wide ? .9 : .8); }
    else { baseX = wide ? (AR ? -5.6 : 5.6) : 0; baseY = wide ? .5 : 1.6; world.scale.setScalar(wide ? .6 : .55); }
  };
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    side();
  }
  addEventListener("resize", resize); resize();
  AM.onLang.push(side);

  function sceneTheme() {
    const L = AM.isLight();
    scene.fog.color.set(L ? 0xf5f1e8 : 0x060914);
    ambient.intensity = L ? 0.95 : 0.35;
    core.material.color.set(L ? 0xdff3ea : 0x0d1630);
    core.material.emissive.set(L ? 0x0b5c45 : 0x0b3b2e);
    core.material.emissiveIntensity = L ? 0.22 : 0.6;
    shell.material.opacity = L ? 0.6 : 0.45;
    stars.material.blending = L ? THREE.NormalBlending : THREE.AdditiveBlending;
    stars.material.opacity = L ? 0.5 : 0.85;
    stars.material.size = L ? 0.06 : 0.05;
    stars.material.needsUpdate = true;
  }
  AM.onTheme.push(sceneTheme); sceneTheme();

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener("pointermove", e => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; }, { passive: true });
  let scrollP = 0;
  addEventListener("scroll", () => { scrollP = Math.min(1, scrollY / (mode === "full" ? innerHeight : innerHeight * .6)); }, { passive: true });

  const clock = new THREE.Clock();
  let visible = true;
  document.addEventListener("visibilitychange", () => (visible = !document.hidden));
  let wx = baseX;
  const strength = () => (innerWidth > 960 ? 1 : .3) * (mode === "full" ? 1 : .6);

  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const tm = clock.getElapsedTime(), sp = reduced ? .15 : 1;
    mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
    wx += (baseX * (1 - scrollP * .6) - wx) * .06;
    world.position.x = wx;
    world.position.y = baseY + scrollP * 1.5;
    world.rotation.y = mouse.x * .6 + tm * .05 * sp + scrollP * 1.2;
    world.rotation.x = mouse.y * .35 + scrollP * .35;
    camera.position.z = 11 + scrollP * 3;
    core.rotation.x = tm * .25 * sp; core.rotation.y = tm * .35 * sp;
    shell.rotation.y = -tm * .15 * sp; shell.rotation.z = tm * .1 * sp;
    core.scale.setScalar(1 + Math.sin(tm * 2) * .03);
    halo.material.opacity = .04 + Math.sin(tm * 1.5) * .02;
    rings.forEach((r, i) => (r.rotation.z = tm * (.1 + i * .05) * (i % 2 ? -1 : 1) * sp));
    docs.forEach(m => {
      const u = m.userData;
      u.a += u.speed * .01 * sp;
      m.position.set(Math.cos(u.a) * u.radius, Math.sin(tm * .8 + u.bob) * .25, Math.sin(u.a) * u.radius);
      m.lookAt(camera.position);
      m.rotateY(Math.sin(tm * .5 + u.bob) * .25 + u.spin);
    });
    stars.rotation.y = tm * .01 * sp;
    canvas.style.opacity = strength() * (1 - scrollP * (AM.isLight() ? .85 : .75));
    renderer.render(scene, camera);
  })();
})();
