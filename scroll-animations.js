import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // 1. Hero Reveal Animations
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  
  heroTl
    .from('.hero .badge', {
      opacity: 0,
      y: -20,
      delay: 0.2
    })
    .from('#hero-title', {
      opacity: 0,
      y: 40,
      duration: 1.2
    }, '-=0.6')
    .from('.hero-content p', {
      opacity: 0,
      y: 20,
      duration: 1
    }, '-=0.8')
    .from('.hero-actions', {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, '-=0.8')
    .from('.hero-visual', {
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      ease: 'back.out(1.2)'
    }, '-=1.2');

  gsap.to('.hero-svg-illustration', {
    y: 60,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // 2. Bento Grid Cards Entrance (Staggered Fade-Up)
  gsap.from('.bento-card', {
    scrollTrigger: {
      trigger: '.bento-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Stat numbers counting simulation
  ScrollTrigger.create({
    trigger: '.bento-grid',
    start: 'top 75%',
    onEnter: () => {
      document.querySelectorAll('.stat-number').forEach(stat => {
        const text = stat.textContent;
        const isPercentage = text.includes('%');
        const numVal = parseInt(text.replace(/[^0-9]/g, ''), 10);
        if (isNaN(numVal)) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: numVal,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            if (isPercentage) {
              stat.textContent = `${Math.floor(obj.val)}%`;
            } else if (text.startsWith('<')) {
              stat.textContent = `< ${Math.floor(obj.val)} Min`;
            } else {
              stat.textContent = text;
            }
          }
        });
      });
    }
  });

  // 3. Agency Section Animations
  gsap.from('.agency-description h3, .agency-description p, .agency-section .badge', {
    scrollTrigger: {
      trigger: '.agency-section',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.cap-card', {
    scrollTrigger: {
      trigger: '.agency-capabilities',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out'
  });

  // 4. FAQ Section Animations
  gsap.from('.faq-item', {
    scrollTrigger: {
      trigger: '.faq-container',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out'
  });

  // 5. Early Access Card Animations
  gsap.from('.cta-card', {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    scale: 0.95,
    y: 30,
    duration: 1,
    ease: 'power3.out'
  });
}
