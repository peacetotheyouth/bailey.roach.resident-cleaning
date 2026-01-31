// Booking form functionality

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('bookingForm');
    const serviceSelect = document.getElementById('serviceId');
    const dateInput = document.getElementById('bookingDate');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];

    // Load services
    try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        if (data.success) {
            data.services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = `${service.name} - $${service.price}`;
                serviceSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading services:', error);
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide previous messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            serviceId: document.getElementById('serviceId').value,
            bookingDate: document.getElementById('bookingDate').value,
            bookingTime: document.getElementById('bookingTime').value,
            notes: document.getElementById('notes').value
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to confirmation page
                window.location.href = `/confirmation/${data.bookingId}`;
            } else {
                // Show error message
                errorMessage.textContent = data.message || 'Error creating booking. Please try again.';
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
});
