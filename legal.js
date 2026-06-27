import { init3DCanvas } from './3d-canvas.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Background 3D Canvas
  init3DCanvas();

  // Setup Deletion Form Submission Handler
  setupDeletionForm();
});

/**
 * Handle Deletion Form Validation & Simulated Submission
 */
function setupDeletionForm() {
  const form = document.getElementById('data-deletion-form');
  const feedback = document.getElementById('deletion-form-feedback');
  
  if (!form || !feedback) return;

  const nameInput = document.getElementById('del-name');
  const emailInput = document.getElementById('del-email');
  const phoneInput = document.getElementById('del-phone');
  const roleSelect = document.getElementById('del-type');
  const confirmCheck = document.getElementById('del-confirm');
  const submitBtn = document.getElementById('del-submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset styles
    feedback.className = 'form-message';
    feedback.textContent = '';

    // Validate inputs
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const role = roleSelect.value;
    const isConfirmed = confirmCheck.checked;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !phone || !role) {
      showError('Please fill out all required fields.');
      return;
    }

    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (!isConfirmed) {
      showError('You must confirm the deletion terms by ticking the checkbox.');
      return;
    }

    // Success flow - simulated API request
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing request...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Clear form inputs
      nameInput.value = '';
      emailInput.value = '';
      phoneInput.value = '';
      roleSelect.value = '';
      confirmCheck.checked = false;
      
      const reasonInput = document.getElementById('del-reason');
      if (reasonInput) reasonInput.value = '';

      // Feedback message
      feedback.textContent = 'Data Deletion Request Registered. Check your email to confirm the request.';
      feedback.classList.add('success');
      
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Clear success feedback after 10 seconds
      setTimeout(() => {
        if (feedback.classList.contains('success')) {
          feedback.textContent = '';
          feedback.className = 'form-message';
        }
      }, 10000);
    }, 1500);
  });

  function showError(msg) {
    feedback.textContent = msg;
    feedback.classList.add('error');
  }
}
