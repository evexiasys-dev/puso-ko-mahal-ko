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

  // Hero CTA button - scroll to registration
  document.getElementById('heroCTA')?.addEventListener('click', function () {
    document.querySelector('.registration-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Smooth scroll for hero CTA button to registration section
  document.getElementById('heroCTA')?.addEventListener('click', function () {
    document.getElementById('news-banner-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Form handling
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwKLy62El6ur3lf3UgewWtU3keHoaEbem8lPMIzGza9fzCoc2nVWn8myGl5qPTUGgq9/exec';
  const form = document.getElementById('registrationForm');
  const statusMsg = document.getElementById('form-status');
  const submitBtn = document.getElementById('submitBtn');

  // Collect required inputs (including selects and radios)
  const requiredInputs = Array.from(form.querySelectorAll('input[required], select[required]'));

  // Improve radio checking: build unique set of radio group names
  function checkForm() {
    let isComplete = true;

    // Check non-radio inputs
    requiredInputs.forEach(input => {
      if (input.type === 'radio') return;
      if (!input.value || !input.value.toString().trim()) isComplete = false;
    });

    // Check radio groups
    const radioNames = new Set(requiredInputs.filter(i => i.type === 'radio').map(i => i.name));
    radioNames.forEach(name => {
      if (!form.querySelector(`input[name="${name}"]:checked`)) isComplete = false;
    });

    submitBtn.disabled = !isComplete;
  }

  form.addEventListener('input', checkForm);
  form.addEventListener('change', checkForm);

  // Run initial check (in case browser autofills)
  checkForm();

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    statusMsg.innerText = "";
    statusMsg.style.background = '';
    statusMsg.style.color = '';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => {
        // Show success modal
        const modal = document.getElementById('successModal');
        modal.classList.add('show');

        // Reset form
        form.reset();
        submitBtn.innerText = "PRE-REGISTER NOW";
        submitBtn.disabled = true;
      })
      .catch(error => {
        statusMsg.style.color = "var(--primary-red)";
        statusMsg.style.background = "rgba(230, 57, 70, 0.1)";
        statusMsg.innerText = "❌ Error! Please try again.";
        submitBtn.disabled = false;
        submitBtn.innerText = "PRE-REGISTER NOW";
        console.error('Error!', error && error.message ? error.message : error);
      });
  });

  // Modal functionality
  const modal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalClose');
  const registerAnother = document.getElementById('registerAnother');

  // Close modal when X is clicked
  modalClose.addEventListener('click', function () {
    modal.classList.remove('show');
  });

  // Close modal when clicking outside
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.classList.remove('show');
    }
  });

  // Register another participant
  registerAnother.addEventListener('click', function () {
    modal.classList.remove('show');
    // Scroll to form
    document.getElementById('registrationForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});