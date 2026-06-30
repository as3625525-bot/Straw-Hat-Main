/**
 * Animations - Animation Controllers
 */

const Animations = {
  /**
   * Initialize background animations
   */
  initBackground() {
    // Create animated background
    const bg = document.createElement('div');
    bg.className = 'bg-animated';
    bg.innerHTML = `
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    `;
    document.body.prepend(bg);

    // Create grid lines
    const grid = document.createElement('div');
    grid.className = 'grid-lines';
    document.body.prepend(grid);

    // Create particles
    const particles = document.createElement('div');
    particles.className = 'particles';
    for (let i = 0; i < 10; i++) {
      particles.innerHTML += '<div class="particle"></div>';
    }
    document.body.prepend(particles);
  },

  /**
   * Add ripple effect to element
   */
  addRipple(element) {
    element.classList.add('ripple');
    
    element.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  },

  /**
   * Stagger animate children
   */
  staggerChildren(parent, delay = 100) {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        child.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, index * delay);
    });
  },

  /**
   * Animate counter
   */
  animateCounter(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current);
      }
    }, 16);
  },

  /**
   * Intersection Observer for scroll animations
   */
  observeElements(selector, animationClass = 'slide-up') {
    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  },

  /**
   * Page transition
   */
  async pageTransition(url) {
    const main = document.querySelector('main') || document.body;
    main.classList.add('page-exit');
    
    await Utils.wait(300);
    window.location.href = url;
  },

  /**
   * Shake animation for errors
   */
  shake(element) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'shake 0.5s ease-in-out';
  },

  /**
   * Pop animation
   */
  pop(element) {
    element.classList.add('pop');
    setTimeout(() => element.classList.remove('pop'), 300);
  },

  /**
   * Typewriter effect
   */
  typewriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    return new Promise(resolve => {
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }
};

// Add shake keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Animations;
} else {
  window.Animations = Animations;
}
