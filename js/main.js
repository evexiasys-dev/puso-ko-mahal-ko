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
        statusMsg.style.color = "var(--primary-green)";
        statusMsg.style.background = "rgba(76, 175, 80, 0.1)";
        statusMsg.innerText = "✅ Success! You are registered.";
        submitBtn.innerText = "Registered Successfully";
        form.reset();
        // After reset, keep button disabled until form is filled again
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
});
