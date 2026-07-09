import * as THREE from 'three';

export function init3DCanvas() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 32;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Geometry: Create a floating wave of particles
  const particleCount = 350;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const initialPositions = [];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 85;
    const y = (Math.random() - 0.5) * 55;
    const z = (Math.random() - 0.5) * 35;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    initialPositions.push({ 
      x, 
      y, 
      z, 
      speed: 0.15 + Math.random() * 0.5, 
      offset: Math.random() * Math.PI * 2 
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Custom circular canvas texture for soft glow Violet & Teal particles
  const createParticleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    // 50/50 chance for electric sky blue vs neon green glow
    if (Math.random() > 0.5) {
      grad.addColorStop(0.35, 'rgba(14, 165, 233, 0.45)'); // Sky Blue
    } else {
      grad.addColorStop(0.35, 'rgba(6, 228, 135, 0.45)'); // Neon Green
    }
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    
    return new THREE.CanvasTexture(canvas);
  };

  // Material
  const material = new THREE.PointsMaterial({
    size: 0.5,
    map: createParticleTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  // Points Mesh
  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Constellation wireframe connectors styled under Indigo colorway
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x06e487,
    transparent: true,
    opacity: 0.05
  });
  
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = [];
  
  const lineCount = 100;
  for (let i = 0; i < lineCount; i++) {
    const idxA = Math.floor(Math.random() * particleCount);
    let idxB = Math.floor(Math.random() * particleCount);
    while (idxA === idxB) {
      idxB = Math.floor(Math.random() * particleCount);
    }
    linePositions.push(positions[idxA * 3], positions[idxA * 3 + 1], positions[idxA * 3 + 2]);
    linePositions.push(positions[idxB * 3], positions[idxB * 3 + 1], positions[idxB * 3 + 2]);
  }
  
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // Interaction States
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  
  let scrollY = 0;
  let targetScrollY = 0;

  // Listeners
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollY = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;
    scrollY += (targetScrollY - scrollY) * 0.08;

    camera.position.x = mouseX * 2.5;
    camera.position.y = mouseY * 2.5 + scrollY * -3.5;
    camera.lookAt(scene.position);

    const positionAttr = geometry.attributes.position;
    
    for (let i = 0; i < particleCount; i++) {
      const p = initialPositions[i];
      const waveX = Math.sin(elapsedTime * p.speed + p.offset) * 0.15;
      const waveY = Math.cos(elapsedTime * p.speed + p.offset) * 0.15;

      positionAttr.setXY(
        i, 
        p.x + waveX + (mouseX * 0.2), 
        p.y + waveY + (mouseY * 0.2)
      );
    }
    positionAttr.needsUpdate = true;

    particleSystem.rotation.y = elapsedTime * 0.015 + scrollY * 0.35;
    particleSystem.rotation.x = elapsedTime * 0.007;
    
    lines.rotation.y = particleSystem.rotation.y;
    lines.rotation.x = particleSystem.rotation.x;

    renderer.render(scene, camera);
  }

  animate();
}
