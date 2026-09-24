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
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Form handling
  // Same Apps Script web app used for the February event. Its doPost saves the row
  // to Google Sheets and sends the confirmation email (see email-confirmation/anniversary-apps-script.gs).
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwKLy62El6ur3lf3UgewWtU3keHoaEbem8lPMIzGza9fzCoc2nVWn8myGl5qPTUGgq9/exec';
  const form = document.getElementById('registrationForm');
  const statusMsg = document.getElementById('form-status');
  const submitBtn = document.getElementById('submitBtn');
  const submitLabel = submitBtn.innerText;

  const emailInput = document.getElementById('f-email');
  const contactInput = document.getElementById('f-contact');
  const birthdayInput = document.getElementById('f-birthday');
  const ageInput = document.getElementById('f-age');
  const barangayInput = document.getElementById('f-barangay');
  const cityInput = document.getElementById('f-city');
  const provinceInput = document.getElementById('f-province');
  const barangayHint = document.getElementById('f-barangay-hint');
  const barangayList = document.getElementById('barangayList');

  const NA = 'N/A';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Capitalizes the first letter of every word (space-, hyphen- or apostrophe-
  // separated) and lowercases the rest, so "juan DELA cruz" becomes "Juan Dela Cruz".
  // Same rule as the QualiCheck CMS patient registration.
  function toTitleCase(value) {
    return (value || '').trim().replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.replace(/(^|[-'])(\p{L})(\p{L}*)/gu, (m, sep, first, rest) => sep + first.toUpperCase() + rest.toLowerCase()))
      .join(' ');
  }

  // Birthday → age. Same checks as the QualiCheck CMS registration.
  function todayISO() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  birthdayInput.max = todayISO();

  // Chrome briefly reports half-typed years like "0019-05-15"; a 4-digit
  // year from 1900 on means the whole date has actually been entered.
  function isBirthdayValid() {
    const value = birthdayInput.value;
    if (!value) return false;
    const year = Number(value.slice(0, 4));
    return year >= 1900 && !Number.isNaN(new Date(value).getTime()) && value <= todayISO();
  }

  function calcAge(value) {
    const [y, m, d] = value.split('-').map(Number);
    const now = new Date();
    let age = now.getFullYear() - y;
    const hadBirthday = now.getMonth() + 1 > m || (now.getMonth() + 1 === m && now.getDate() >= d);
    if (!hadBirthday) age -= 1;
    return age;
  }

  birthdayInput.addEventListener('input', () => {
    // Chrome lets the year grow past 4 digits ("19905"); restart it instead
    const [year, month, day] = birthdayInput.value.split('-');
    if (year && month && day && year.length > 4) {
      birthdayInput.value = year.slice(-1).padStart(4, '0') + '-' + month + '-' + day;
    }
    ageInput.value = isBirthdayValid() ? calcAge(birthdayInput.value) : '';
    if (isBirthdayValid()) setFieldError(birthdayInput, false);
  });
  birthdayInput.addEventListener('blur', () => {
    setFieldError(birthdayInput, birthdayInput.value !== '' && !isBirthdayValid());
  });

  const titleCaseInputs = Array.from(form.querySelectorAll('[data-titlecase]'));
  function applyTitleCase(input) {
    if (input.readOnly) return; // leave "N/A" as-is
    input.value = toTitleCase(input.value);
  }
  titleCaseInputs.forEach(input => input.addEventListener('blur', () => applyTitleCase(input)));

  // "No middle name" / "No email": fill the field with N/A and lock it
  form.querySelectorAll('[data-na-for]').forEach(box => {
    const input = document.getElementById(box.dataset.naFor);
    box.addEventListener('change', () => {
      input.value = box.checked ? NA : '';
      input.readOnly = box.checked;
      input.classList.toggle('is-na', box.checked);
      setFieldError(input, false);
      if (!box.checked) input.focus();
      checkForm();
    });
  });

  // Contact number: digits only, exactly 11
  contactInput.addEventListener('input', () => {
    const digits = contactInput.value.replace(/\D/g, '').slice(0, 11);
    if (digits !== contactInput.value) contactInput.value = digits;
  });

  function isEmailValid() {
    return emailInput.value === NA || EMAIL_RE.test(emailInput.value.trim());
  }
  function isContactValid() {
    return /^\d{11}$/.test(contactInput.value);
  }

  function setFieldError(input, show) {
    input.classList.toggle('invalid', show);
    const error = document.getElementById(input.id + '-error');
    if (error) error.classList.toggle('show', show);
  }

  // Show the email/contact message once the person leaves the field
  emailInput.addEventListener('blur', () => setFieldError(emailInput, emailInput.value !== '' && !isEmailValid()));
  contactInput.addEventListener('blur', () => setFieldError(contactInput, contactInput.value !== '' && !isContactValid()));
  emailInput.addEventListener('input', () => { if (isEmailValid()) setFieldError(emailInput, false); });
  contactInput.addEventListener('input', () => { if (isContactValid()) setFieldError(contactInput, false); });

  // Barangay suggestions (data in js/ph-address-book.js). Picking one also records
  // the city and province; free text is still accepted for unlisted areas.
  let suggestions = [];
  let activeIndex = -1;

  function closeSuggestions() {
    suggestions = [];
    activeIndex = -1;
    barangayList.hidden = true;
    barangayList.innerHTML = '';
    barangayInput.setAttribute('aria-expanded', 'false');
  }

  function renderSuggestions() {
    if (!suggestions.length) { closeSuggestions(); return; }
    barangayList.innerHTML = '';
    suggestions.forEach((item, i) => {
      const li = document.createElement('li');
      li.className = 'ac-option' + (i === activeIndex ? ' active' : '');
      li.setAttribute('role', 'option');
      li.dataset.index = i;
      const name = document.createElement('span');
      name.textContent = item.barangay;
      const sub = document.createElement('span');
      sub.className = 'ac-option-sub';
      sub.textContent = item.city + ', ' + item.province;
      li.append(name, sub);
      barangayList.appendChild(li);
    });
    barangayList.hidden = false;
    barangayInput.setAttribute('aria-expanded', 'true');
  }

  function selectSuggestion(index) {
    const item = suggestions[index];
    if (!item) return;
    barangayInput.value = item.barangay;
    cityInput.value = item.city;
    provinceInput.value = item.province;
    barangayHint.textContent = item.city + ', ' + item.province;
    closeSuggestions();
    checkForm();
  }

  barangayInput.addEventListener('input', () => {
    // Typing again means the earlier pick no longer applies
    cityInput.value = '';
    provinceInput.value = '';
    barangayHint.textContent = '';
    const search = window.PHAddressBook && window.PHAddressBook.searchBarangays;
    suggestions = search ? search(barangayInput.value) : [];
    activeIndex = -1;
    renderSuggestions();
  });

  barangayInput.addEventListener('keydown', (e) => {
    if (barangayList.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      activeIndex = (activeIndex + step + suggestions.length) % suggestions.length;
      renderSuggestions();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectSuggestion(activeIndex >= 0 ? activeIndex : 0);
    } else if (e.key === 'Escape') {
      closeSuggestions();
    }
  });

  // mousedown (not click) so the input doesn't blur and close the list first
  barangayList.addEventListener('mousedown', (e) => {
    const option = e.target.closest('.ac-option');
    if (!option) return;
    e.preventDefault();
    selectSuggestion(Number(option.dataset.index));
  });

  barangayInput.addEventListener('blur', () => setTimeout(closeSuggestions, 150));

  function isFormComplete() {
    const filled = Array.from(form.querySelectorAll('input[required]:not([type="radio"]), select[required]'))
      .every(input => input.value.trim() !== '');
    const packageChosen = !!form.querySelector('input[name="Package"]:checked');
    return filled && packageChosen && isBirthdayValid() && isEmailValid() && isContactValid();
  }

  function checkForm() {
    submitBtn.disabled = !isFormComplete();
  }

  form.addEventListener('input', checkForm);
  form.addEventListener('change', checkForm);

  // Run initial check (in case browser autofills)
  checkForm();

  function showError(message) {
    statusMsg.style.color = 'var(--dark-red)';
    statusMsg.style.background = 'rgba(240, 86, 74, 0.1)';
    statusMsg.innerText = message;
    submitBtn.disabled = false;
    submitBtn.innerText = submitLabel;
  }

  function resetForm() {
    form.reset();
    form.querySelectorAll('[data-na-for]').forEach(box => {
      const input = document.getElementById(box.dataset.naFor);
      input.readOnly = false;
      input.classList.remove('is-na');
    });
    barangayHint.textContent = '';
    cityInput.value = '';
    provinceInput.value = '';
  }

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    titleCaseInputs.forEach(applyTitleCase);
    if (!isFormComplete()) {
      setFieldError(birthdayInput, !isBirthdayValid());
      setFieldError(emailInput, !isEmailValid());
      setFieldError(contactInput, !isContactValid());
      showError('Please complete all fields.');
      return;
    }

    const hasEmail = emailInput.value !== NA;

    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending...';
    statusMsg.innerText = '';
    statusMsg.style.background = '';
    statusMsg.style.color = '';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => response.text())
      .then(text => {
        let result = null;
        try { result = JSON.parse(text); } catch (err) { /* non-JSON response: treat as saved */ }
        if (result && result.result === 'error') {
          throw new Error(result.error || 'Registration failed');
        }

        document.getElementById('modalMessage').textContent = hasEmail
          ? 'We sent a confirmation to your email. Please check your inbox or spam folder. See you on October 16, 2026!'
          : 'Your slot is saved. See you on October 16, 2026!';
        document.getElementById('successModal').classList.add('show');

        resetForm();
        submitBtn.innerText = submitLabel;
        submitBtn.disabled = true;
      })
      .catch(error => {
        showError('❌ Something went wrong. Please try again.');
        console.error('Error!', error && error.message ? error.message : error);
      });
  });

  // Modal functionality
  const modal = document.getElementById('successModal');

  document.getElementById('modalClose').addEventListener('click', function () {
    modal.classList.remove('show');
  });

  // Close modal when clicking outside
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.classList.remove('show');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') modal.classList.remove('show');
  });

  // Register another participant
  document.getElementById('registerAnother').addEventListener('click', function () {
    modal.classList.remove('show');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
