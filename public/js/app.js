document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('[data-action="add-to-order"]');
  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.add('btn-success');
      btn.textContent = 'Added!';
      setTimeout(() => {
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-primary');
        btn.textContent = 'Add to order';
      }, 1200);
    });
  });
});
