/* ============================================
   NOVA/3D — Hero 3D scene (Three.js, vanilla)
   Animated torus knot + orbiting icospheres
   ============================================ */
(function () {
  const canvas = document.getElementById('scene3d');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Lights — cyan + amber rim
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const cyan = new THREE.PointLight(0x22e5ff, 1.2, 100);
  cyan.position.set(5, 5, 5);
  scene.add(cyan);
  const amber = new THREE.PointLight(0xffaa3d, 1, 100);
  amber.position.set(-5, -3, -2);
  scene.add(amber);

  // Core: torus knot with metallic cyan material
  const knotGeo = new THREE.TorusKnotGeometry(1, 0.32, 220, 32);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x22e5ff,
    emissive: 0x0a8fa8,
    emissiveIntensity: 0.4,
    roughness: 0.15,
    metalness: 0.9,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  knot.scale.setScalar(1.6);
  scene.add(knot);

  // Orbiters — 8 amber icospheres
  const orbiters = new THREE.Group();
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0xffaa3d,
    emissive: 0xff8a00,
    emissiveIntensity: 1.2,
  });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = 3.2;
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), orbMat);
    m.position.set(Math.cos(a) * r, Math.sin(a * 1.5) * 0.6, Math.sin(a) * r);
    orbiters.add(m);
  }
  scene.add(orbiters);

  // Starfield
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1500;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 30 + Math.random() * 20;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(p) * Math.cos(t);
    positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
    positions[i * 3 + 2] = r * Math.cos(p);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.8 }));
  scene.add(stars);

  // Animation loop with subtle float
  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    knot.rotation.x = t * 0.15;
    knot.rotation.y = t * 0.25;
    knot.position.y = Math.sin(t * 1.4) * 0.15; // float
    orbiters.rotation.y = t * 0.3;
    stars.rotation.y = t * 0.02;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
