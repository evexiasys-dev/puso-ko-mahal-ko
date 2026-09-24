document.addEventListener('DOMContentLoaded', function () {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for scroll indicator
  document.querySelector('.scroll-indicator')?.addEventListener('click', function () {
    document.querySelector('.hero')?.scrollIntoView({ behavior: 'smooth' });
  });
});