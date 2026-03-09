// Account registration and authentication functionality

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('accountForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        setupRegisterForm(registerForm);
    }

    if (loginForm) {
        setupLoginForm(loginForm);
    }
});

function setupRegisterForm(form) {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match.';
            errorMessage.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (password.length < 8) {
            errorMessage.textContent = 'Password must be at least 8 characters long.';
            errorMessage.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: password,
            businessName: document.getElementById('businessName')?.value ?? '',
            phone: document.getElementById('phone')?.value ?? ''
        };

        try {
            const response = await fetch('/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                successMessage.textContent = 'Account created successfully! You can now log in.';
                successMessage.style.display = 'block';
                form.reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                errorMessage.textContent = data.message || 'Error creating account. Please try again.';
                errorMessage.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

function setupLoginForm(form) {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                successMessage.textContent = 'Login successful! Redirecting...';
                successMessage.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Redirect to account dashboard after successful login
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                errorMessage.textContent = data.message || 'Login failed. Please check your credentials.';
                errorMessage.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}
