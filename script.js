document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => button.style.boxShadow = '0 18px 40px rgba(63, 171, 255, 0.25)');
    button.addEventListener('mouseleave', () => button.style.boxShadow = 'none');
  });
});
