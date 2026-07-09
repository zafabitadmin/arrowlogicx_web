import { init3DCanvas } from './3d-canvas.js';
import { initScrollAnimations } from './scroll-animations.js';

document.addEventListener('DOMContentLoaded', () => {
  setupStickyHeader();
  setupMobileNavigation();
  setupFAQAccordion();
  setupSignupForm();
  setupScrollToTop();
  setupLocationRequest();

  // Initialize premium visual effects
  init3DCanvas();
  initScrollAnimations();
});

/* ── Sticky Header ── */
function setupStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Nav ── */
function setupMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu-list');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

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

  // Active link tracking
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -65% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ── FAQ Accordion ── */
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');
    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close others
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          other.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-body').style.maxHeight = null;
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

/* ── Signup Form ── */
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

    if (!email) {
      feedback.textContent = 'Please enter your email.';
      feedback.classList.add('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.classList.add('error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    if (btnText) btnText.textContent = 'Joining...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    setTimeout(() => {
      feedback.textContent = "You're on the list. We'll be in touch.";
      feedback.classList.add('success');
      emailInput.value = '';

      if (btnText) btnText.textContent = 'Join Waitlist';
      if (btnSpinner) btnSpinner.style.display = 'none';
      submitBtn.disabled = false;

      setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'form-message';
      }, 5000);
    }, 1000);
  });
}

/* ── Scroll to Top ── */
function setupScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Location Request Form ── */
function setupLocationRequest() {
  const form = document.getElementById('location-request-form');
  const feedback = document.getElementById('location-form-feedback');
  const input = document.getElementById('location-input');

  if (!form || !feedback || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = input.value.trim();

    feedback.className = 'form-message';
    feedback.textContent = '';

    if (!location) {
      feedback.textContent = 'Please enter a neighborhood name.';
      feedback.classList.add('error');
      return;
    }

    const btn = form.querySelector('button');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      feedback.textContent = `Thanks! We've noted your interest in ${location}.`;
      feedback.classList.add('success');
      input.value = '';
      btn.textContent = 'Request';
      btn.disabled = false;

      setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'form-message';
      }, 5000);
    }, 800);
  });
}

