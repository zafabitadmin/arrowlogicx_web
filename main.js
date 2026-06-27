import { init3DCanvas } from './3d-canvas.js';
import { initScrollAnimations } from './scroll-animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Background 3D Canvas
  init3DCanvas();
  
  // Initialize GSAP Scroll Animations
  initScrollAnimations();

  // Setup UI Interactions
  setupStickyHeader();
  setupMobileNavigation();
  setupFAQAccordion();
  setupKochiMapTooltips();
  setupSignupForm();
  
  // Setup Bento-Specific Micro-animations
  setupBentoApiSimulator();
  setupBentoAppMockInteractions();
});

/**
 * Sticky Header Effect on Scroll
 */
function setupStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/**
 * Mobile Navigation Drawer & Scroll Tracking active states
 */
function setupMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu-list');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      toggleBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link') || e.target.classList.contains('btn')) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Active Link Tracking based on scroll viewport intersection
  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -65% 0px'
  });

  sections.forEach(section => activeLinkObserver.observe(section));
}

/**
 * FAQ Accordion Expand & Height Calculations
 */
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Kochi Region Map Pulses and Tooltips
 */
function setupKochiMapTooltips() {
  const mapContainer = document.querySelector('.kochi-visual-map');
  const pulses = document.querySelectorAll('.map-location-pulse');
  const tooltip = document.getElementById('map-region-tooltip');

  if (!mapContainer || !tooltip) return;

  pulses.forEach(pulse => {
    const showTooltip = () => {
      const name = pulse.getAttribute('data-name');
      const top = pulse.offsetTop;
      const left = pulse.offsetLeft;

      tooltip.textContent = `${name} Active`;
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.style.opacity = '1';
    };

    const hideTooltip = () => {
      tooltip.style.opacity = '0';
    };

    pulse.addEventListener('mouseenter', showTooltip);
    pulse.addEventListener('mouseleave', hideTooltip);
    
    pulse.addEventListener('click', (e) => {
      e.stopPropagation();
      showTooltip();
    });
  });

  document.addEventListener('click', () => {
    tooltip.style.opacity = '0';
  });
}

/**
 * Lead Early Access Registration
 */
function setupSignupForm() {
  const form = document.getElementById('early-access-form');
  const feedback = document.getElementById('signup-form-feedback');
  const emailInput = document.getElementById('email-input');

  if (!form || !feedback || !emailInput) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    feedback.className = 'form-message';
    feedback.textContent = '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      feedback.textContent = 'Please enter your email.';
      feedback.classList.add('error');
      return;
    }

    if (!emailRegex.test(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.classList.add('error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Securing Access...';
    submitBtn.disabled = true;

    setTimeout(() => {
      feedback.textContent = 'Success! Welcome to the early access pool.';
      feedback.classList.add('success');
      
      emailInput.value = '';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      setTimeout(() => {
        if (feedback.classList.contains('success')) {
          feedback.textContent = '';
          feedback.className = 'form-message';
        }
      }, 5000);
    }, 1200);
  });
}

/**
 * Bento Box: Verification Steps API Simulator Loop
 */
function setupBentoApiSimulator() {
  const steps = [
    document.getElementById('api-step-1'),
    document.getElementById('api-step-2'),
    document.getElementById('api-step-3')
  ];

  if (!steps[0]) return;

  let currentStepIndex = 0;

  const runSimulationStep = () => {
    // If resetting at end of cycle
    if (currentStepIndex === 0) {
      steps.forEach(step => step.classList.remove('checked'));
    }

    if (currentStepIndex < steps.length) {
      steps[currentStepIndex].classList.add('checked');
      currentStepIndex++;
      // Progress to next step in 1.5 seconds
      setTimeout(runSimulationStep, 1500);
    } else {
      // Loop reset: wait 3 seconds before restarting cycle
      currentStepIndex = 0;
      setTimeout(runSimulationStep, 3000);
    }
  };

  // Start loop with initial delay
  setTimeout(runSimulationStep, 1000);
}

/**
 * Bento Box: Interactive Mobile App Mockup Click Handlers
 */
function setupBentoAppMockInteractions() {
  const cleanBtn = document.getElementById('mock-service-cleaning');
  const cookBtn = document.getElementById('mock-service-cooking');
  const listContainer = document.getElementById('mock-cleaners-list');
  const bookingBtn = document.getElementById('mock-booking-btn');

  if (!cleanBtn || !cookBtn || !listContainer) return;

  const cleanersData = {
    cleaning: [
      { name: 'Deepa P.', region: 'Vazhakkala', distance: '0.8 km', rating: '4.8', active: true },
      { name: 'Jincy M.', region: 'Edappally', distance: '1.5 km', rating: '4.7', active: false }
    ],
    cooking: [
      { name: 'Ammu S.', region: 'Kakkanad', distance: '1.2 km', rating: '4.9', active: true },
      { name: 'Reetha K.', region: 'Thrikkakara', distance: '2.1 km', rating: '4.6', active: false }
    ]
  };

  const updateList = (serviceType) => {
    listContainer.innerHTML = '';
    const pool = cleanersData[serviceType];

    pool.forEach(cleaner => {
      const item = document.createElement('div');
      item.className = 'app-maid-item';
      
      const avatarColor = serviceType === 'cleaning' ? '#14b8a6' : '#6366f1';
      
      item.innerHTML = `
        <div class="app-maid-info">
          <div class="app-maid-avatar" style="background:${avatarColor};"></div>
          <div class="app-maid-details">
            <span class="app-maid-name">${cleaner.name}</span>
            <span class="app-maid-meta">${cleaner.region} • ${cleaner.distance}</span>
          </div>
        </div>
        <div class="app-maid-rating">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          ${cleaner.rating}
        </div>
      `;
      listContainer.appendChild(item);
    });
  };

  cleanBtn.addEventListener('click', () => {
    cleanBtn.classList.add('active');
    cookBtn.classList.remove('active');
    updateList('cleaning');
  });

  cookBtn.addEventListener('click', () => {
    cookBtn.classList.add('active');
    cleanBtn.classList.remove('active');
    updateList('cooking');
  });

  // Mock booking click indicator
  bookingBtn.addEventListener('click', () => {
    const activeCleaner = listContainer.querySelector('.app-maid-name').textContent;
    bookingBtn.textContent = `Matching with ${activeCleaner}...`;
    bookingBtn.style.opacity = '0.8';
    bookingBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      bookingBtn.textContent = 'Matched Successfully!';
      bookingBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)';
      
      setTimeout(() => {
        bookingBtn.textContent = 'Instant Match';
        bookingBtn.style.background = '';
        bookingBtn.style.opacity = '';
        bookingBtn.style.pointerEvents = '';
      }, 2500);
    }, 1500);
  });
}
