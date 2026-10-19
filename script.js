document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressText = document.querySelector('[data-progress]');
  const ringFill = document.querySelector('.loader__ring-fill');
  const hello = document.querySelector('.loader__hello');
  const revealElements = document.querySelectorAll('[data-reveal]');
  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const revealOnScroll = () => {
    if (revealElements.length > 0 && !prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealElements.forEach((element) => observer.observe(element));
    } else {
      revealElements.forEach((element) => element.classList.add('is-visible'));
    }
  };

  const runLoader = () => {
    if (!progressText || !ringFill || !hello) {
      document.body.classList.add('loaded');
      revealOnScroll();
      return;
    }

    if (prefersReducedMotion) {
      progressText.textContent = '100%';
      ringFill.style.strokeDashoffset = '0';
      hello.classList.add('is-visible');
      window.setTimeout(() => {
        document.body.classList.add('loaded');
        revealOnScroll();
      }, 250);
      return;
    }

    const totalLength = 296;
    let current = 0;
    const tick = () => {
      current += Math.random() * 12 + 8;
      const value = Math.min(current, 100);
      const offset = totalLength - (value / 100) * totalLength;
      ringFill.style.strokeDashoffset = String(offset);
      progressText.textContent = `${Math.round(value).toString().padStart(2, '0')}%`;

      if (value >= 100) {
        hello.classList.add('is-visible');
        window.setTimeout(() => {
          document.body.classList.add('loaded');
          revealOnScroll();
        }, 600);
        return;
      }

      window.setTimeout(tick, 120);
    };

    window.setTimeout(tick, 180);
  };

  runLoader();

  const buttonHover = document.querySelectorAll('.button');
  buttonHover.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      button.style.boxShadow = '0 16px 26px rgba(16, 16, 15, 0.08)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.boxShadow = 'none';
    });
  });
});
