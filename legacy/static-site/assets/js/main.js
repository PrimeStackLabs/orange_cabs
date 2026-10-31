/**
 * ORANGE CABS — LUXURY 3D CORPORATE MOBILITY
 * Core Interactive & 3D Physics Engine
 * Developed by primepro.ai
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  init3DCardTilt();
  initFleetFilter();
  initCorporateCalculator();
  initFAQAccordion();
  initModals();
  initCounters();
});

/* ==========================================================================
   1. NAVBAR STICKY & ACTIVE STATE
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const isOpen = navLinks.classList.contains('mobile-open');
    toggleBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close when clicking link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

/* ==========================================================================
   2. THREE.JS 3D CYBERNETIC HIGHWAY & TELEMETRY PARTICLES
   ========================================================================== */
function initThreeJSHero() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 10);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const orangeLight = new THREE.PointLight(0xff5e00, 3, 30);
  orangeLight.position.set(5, 5, 5);
  scene.add(orangeLight);

  // Highway Grid Planes (Upper and Lower 3D Grid)
  const gridHelper = new THREE.GridHelper(50, 40, 0xff5e00, 0x1f293d);
  gridHelper.position.y = -2;
  scene.add(gridHelper);

  // Floating Cybernetic Nodes (Particles representing fleet telematics)
  const particleCount = 280;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorOrange = new THREE.Color(0xff5e00);
  const colorGold = new THREE.Color(0xfdba74);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 35;
    positions[i * 3 + 1] = Math.random() * 12 - 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

    const chosenColor = Math.random() > 0.6 ? colorOrange : (Math.random() > 0.5 ? colorGold : colorWhite);
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);

  // Dynamic Neon Light Beams (simulating high-speed corporate transit)
  const linesGroup = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const lineGeo = new THREE.BufferGeometry();
    const zStart = (Math.random() - 0.5) * 40;
    const xPos = (Math.random() - 0.5) * 20;
    const yPos = -1.9 + Math.random() * 0.2;
    const length = 4 + Math.random() * 8;

    const linePoints = new Float32Array([
      xPos, yPos, zStart,
      xPos, yPos, zStart + length
    ]);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePoints, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: Math.random() > 0.3 ? 0xff5e00 : 0xffa043,
      transparent: true,
      opacity: 0.4 + Math.random() * 0.4,
      linewidth: 2
    });

    const line = new THREE.Line(lineGeo, lineMat);
    linesGroup.add(line);
  }
  scene.add(linesGroup);

  // Mouse Parallax Physics
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 100;
    mouseY = (e.clientY - window.innerHeight / 2) / 100;
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 0.5;
    camera.position.y = 3 - targetY * 0.3;
    camera.lookAt(0, 0, -5);

    // Scroll highway forward
    gridHelper.position.z = (elapsedTime * 4) % 2.5;

    // Move lines forward to create speed illusion
    linesGroup.children.forEach((l, idx) => {
      l.position.z += 0.12 + (idx % 3) * 0.04;
      if (l.position.z > 25) {
        l.position.z = -25;
      }
    });

    // Gentle particle swirl
    particles.rotation.y = elapsedTime * 0.03;
    particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ==========================================================================
   3. TRUE 3D TILT PHYSICS FOR CARDS
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.fleet-card-3d, .service-card-3d');

  cards.forEach(card => {
    // Add specular shine element if not present
    if (!card.querySelector('.card-shine')) {
      const shine = document.createElement('div');
      shine.className = 'card-shine';
      card.appendChild(shine);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max rotation: 12 degrees
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   4. FLEET FILTERING LOGIC
   ========================================================================== */
function initFleetFilter() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.fleet-card-3d');

  if (!chips.length || !cards.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE CORPORATE FARE & FLEET ESTIMATOR CALCULATOR
   ========================================================================== */
function initCorporateCalculator() {
  const vehicleSelect = document.getElementById('calc-vehicle');
  const distanceRange = document.getElementById('calc-distance');
  const distanceVal = document.getElementById('calc-distance-val');
  const fleetCountRange = document.getElementById('calc-count');
  const fleetCountVal = document.getElementById('calc-count-val');
  const shiftSelect = document.getElementById('calc-shifts');

  const costDisplay = document.getElementById('calc-total-cost');
  const summaryVehicle = document.getElementById('calc-sum-vehicle');
  const summaryVehicles = document.getElementById('calc-sum-vehicles');
  const summaryDistance = document.getElementById('calc-sum-distance');
  const summaryEco = document.getElementById('calc-sum-eco');
  const whatsappCalcBtn = document.getElementById('calc-whatsapp-btn');

  if (!vehicleSelect || !distanceRange) return;

  // Base pricing rate card per km for corporate transport
  const rates = {
    'ev': { ratePerKm: 16, baseDaily: 1200, name: 'Electric Sedan (EV 4-Seater)', eco: '100% Zero-Emission (Est. 450kg CO₂ Saved/mo)' },
    'cng': { ratePerKm: 14, baseDaily: 1100, name: 'Eco CNG Sedan (4-Seater)', eco: 'Low Emission Clean Fuel' },
    'sedan': { ratePerKm: 15, baseDaily: 1150, name: 'Executive Sedan (Dzire / Etios)', eco: 'Euro 6 Compliant' },
    'suv': { ratePerKm: 22, baseDaily: 1800, name: 'SUV / MUV (Innova Crysta / Ertiga)', eco: 'High Capacity Efficient' },
    'tempo': { ratePerKm: 28, baseDaily: 2600, name: 'Tempo Traveller (12-17 Seater)', eco: 'Group Shared Commute' },
    'coach': { ratePerKm: 48, baseDaily: 4800, name: 'Luxury Coach (35-45 Seater)', eco: 'Reduces 35 Private Cars' },
    'bus': { ratePerKm: 55, baseDaily: 5500, name: 'Staff Bus (50+ Seater)', eco: 'Reduces 50 Private Cars' }
  };

  function updateCalculator() {
    const selectedType = vehicleSelect.value;
    const distance = parseInt(distanceRange.value, 10);
    const count = parseInt(fleetCountRange.value, 10);
    const shifts = parseInt(shiftSelect.value, 10);

    distanceVal.textContent = `${distance} km / day`;
    fleetCountVal.textContent = `${count} vehicle${count > 1 ? 's' : ''}`;

    const config = rates[selectedType] || rates['sedan'];

    // Monthly calculation (26 working days)
    const dailyPerVehicle = config.baseDaily + (distance * config.ratePerKm * shifts);
    const monthlyTotal = Math.round(dailyPerVehicle * count * 26);

    costDisplay.innerHTML = `₹${monthlyTotal.toLocaleString('en-IN')} <small>/ month</small>`;
    summaryVehicle.textContent = config.name;
    summaryVehicles.textContent = `${count} Fleet Unit${count > 1 ? 's' : ''} (${shifts} Shift${shifts > 1 ? 's' : ''})`;
    summaryDistance.textContent = `${distance} km daily per cab`;
    summaryEco.textContent = config.eco;

    // Prefill WhatsApp link
    const msg = encodeURIComponent(
      `Hello Orange Cabs Team! I calculated an enterprise mobility estimate:\n` +
      `• Vehicle Type: ${config.name}\n` +
      `• Fleet Size: ${count} vehicle(s)\n` +
      `• Daily Distance: ${distance} km\n` +
      `• Shifts per day: ${shifts}\n` +
      `• Estimated Budget: ₹${monthlyTotal.toLocaleString('en-IN')}/mo\n` +
      `Please provide a customized corporate proposal and contract pricing.`
    );
    whatsappCalcBtn.href = `https://wa.me/919742588995?text=${msg}`;
  }

  vehicleSelect.addEventListener('change', updateCalculator);
  distanceRange.addEventListener('input', updateCalculator);
  fleetCountRange.addEventListener('input', updateCalculator);
  shiftSelect.addEventListener('change', updateCalculator);

  updateCalculator();
}

/* ==========================================================================
   6. FAQ ACCORDION INTERACTION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(f => f.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. MODALS (Quote & Fleet Specs)
   ========================================================================== */
function initModals() {
  const triggers = document.querySelectorAll('[data-modal-target]');
  const overlays = document.querySelectorAll('.modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = (modal) => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(m => closeModal(m));
    }
  });

  // Modal spec openers from vehicle cards
  const specBtns = document.querySelectorAll('.btn-card-specs');
  const specModal = document.getElementById('modal-fleet-specs');
  const specTitle = document.getElementById('spec-modal-title');
  const specDesc = document.getElementById('spec-modal-desc');

  specBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.fleet-card-3d');
      if (!card || !specModal) return;

      const name = card.querySelector('.fleet-vehicle-name').textContent;
      const desc = card.querySelector('.fleet-vehicle-desc').textContent;

      if (specTitle) specTitle.textContent = name;
      if (specDesc) specDesc.textContent = desc;

      specModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
}

/* ==========================================================================
   8. ANIMATED STAT COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 1800;
        const stepTime = 20;
        const step = target / (duration / stepTime);

        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            el.textContent = target + (el.getAttribute('data-suffix') || '');
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(count) + (el.getAttribute('data-suffix') || '');
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}
