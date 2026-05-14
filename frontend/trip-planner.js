// Trip Planner JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('start-date').min = today;
  document.getElementById('end-date').min = today;

  // Update end date minimum when start date changes
  document.getElementById('start-date').addEventListener('change', function() {
    document.getElementById('end-date').min = this.value;
  });

  // Add place button functionality
  document.getElementById('add-place-btn').addEventListener('click', addPlace);

  // Form submission
  document.getElementById('trip-form').addEventListener('submit', handleTripSubmission);
});

function addPlace() {
  const placesContainer = document.getElementById('places-container');
  const placeDiv = document.createElement('div');
  placeDiv.className = 'place-input';
  placeDiv.innerHTML = `
    <input type="text" class="place-name" placeholder="Place name">
    <input type="text" class="place-address" placeholder="Address (optional)">
    <button type="button" class="remove-place" onclick="removePlace(this)">Remove</button>
  `;
  placesContainer.appendChild(placeDiv);
}

function removePlace(button) {
  const placeDiv = button.parentElement;
  if (document.querySelectorAll('.place-input').length > 1) {
    placeDiv.remove();
  }
}

async function handleTripSubmission(event) {
  event.preventDefault();
  
  // Get form data
  const formData = {
    tripName: document.getElementById('trip-name').value,
    destination: document.getElementById('destination').value,
    startDate: document.getElementById('start-date').value,
    endDate: document.getElementById('end-date').value,
    budget: parseFloat(document.getElementById('budget').value) || 0,
    notes: document.getElementById('notes').value,
    places: []
  };

  // Collect places data
  const placeInputs = document.querySelectorAll('.place-input');
  placeInputs.forEach(placeDiv => {
    const nameInput = placeDiv.querySelector('.place-name');
    const addressInput = placeDiv.querySelector('.place-address');
    
    if (nameInput.value.trim()) {
      formData.places.push({
        name: nameInput.value.trim(),
        address: addressInput.value.trim() || ''
      });
    }
  });

  // Validate form
  if (!formData.tripName || !formData.destination || !formData.startDate || !formData.endDate) {
    alert('Please fill in all required fields');
    return;
  }

  if (new Date(formData.startDate) >= new Date(formData.endDate)) {
    alert('End date must be after start date');
    return;
  }

  // For demo purposes, use a default user ID (in real app, get from authentication)
  formData.userId = 'demo-user-123';

  try {
    // Save trip to backend
    const response = await fetch('/trips/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Trip saved:', result);
      
      // Show success message
      document.getElementById('trip-form').style.display = 'none';
      document.getElementById('success-message').style.display = 'block';
      
      // Reset form
      document.getElementById('trip-form').reset();
      
      // Reset places container
      const placesContainer = document.getElementById('places-container');
      placesContainer.innerHTML = `
        <div class="place-input">
          <input type="text" class="place-name" placeholder="Place name">
          <input type="text" class="place-address" placeholder="Address (optional)">
          <button type="button" class="remove-place" onclick="removePlace(this)">Remove</button>
        </div>
      `;
    } else {
      const error = await response.json();
      alert('Failed to save trip: ' + error.error);
    }
  } catch (error) {
    console.error('Error saving trip:', error);
    alert('Failed to save trip. Please try again.');
  }
}

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to format budget
function formatBudget(budget) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(budget);
}

