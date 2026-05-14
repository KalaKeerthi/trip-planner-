// My Trips JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadTrips();
  setupModalHandlers();
  setupEditForm();
});

// For demo purposes, use a default user ID (in real app, get from authentication)
const DEMO_USER_ID = 'demo-user-123';

async function loadTrips() {
  try {
    const response = await fetch(`/trips/user/${DEMO_USER_ID}`);
    
    if (response.ok) {
      const data = await response.json();
      displayTrips(data.trips);
    } else {
      console.error('Failed to load trips');
      showNoTrips();
    }
  } catch (error) {
    console.error('Error loading trips:', error);
    showNoTrips();
  }
}

function displayTrips(trips) {
  const container = document.getElementById('trips-container');
  const noTripsDiv = document.getElementById('no-trips');
  
  if (!trips || trips.length === 0) {
    container.style.display = 'none';
    noTripsDiv.style.display = 'block';
    return;
  }
  
  container.style.display = 'block';
  noTripsDiv.style.display = 'none';
  
  // Sort trips by start date (newest first)
  trips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  
  container.innerHTML = trips.map(trip => `
    <div class="trip-card" data-trip-id="${trip.id}">
      <div class="trip-header">
        <h3>${trip.tripName}</h3>
        <span class="trip-status ${trip.status}">${trip.status}</span>
      </div>
      
      <div class="trip-details">
        <div class="trip-info">
          <p><strong>Destination:</strong> ${trip.destination}</p>
          <p><strong>Dates:</strong> ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}</p>
          <p><strong>Duration:</strong> ${calculateDuration(trip.startDate, trip.endDate)} days</p>
          ${trip.budget > 0 ? `<p><strong>Budget:</strong> ${formatBudget(trip.budget)}</p>` : ''}
        </div>
        
        <div class="trip-places">
          <p><strong>Places to Visit:</strong></p>
          ${trip.places.length > 0 ? 
            `<ul>${trip.places.map(place => `<li>${place.name}${place.address ? ` - ${place.address}` : ''}</li>`).join('')}</ul>` :
            '<p>No specific places planned yet</p>'
          }
        </div>
        
        ${trip.notes ? `<div class="trip-notes"><p><strong>Notes:</strong> ${trip.notes}</p></div>` : ''}
      </div>
      
      <div class="trip-actions">
        <button class="secondary-btn" onclick="viewTripDetails(${trip.id})">View Details</button>
        <button class="secondary-btn" onclick="editTrip(${trip.id})">Edit</button>
        <button class="danger-btn" onclick="deleteTrip(${trip.id})">Delete</button>
      </div>
      
      <div class="trip-meta">
        <small>Created: ${formatDate(trip.createdAt)}</small>
        ${trip.updatedAt ? `<small>Updated: ${formatDate(trip.updatedAt)}</small>` : ''}
      </div>
    </div>
  `).join('');
}

function showNoTrips() {
  document.getElementById('trips-container').style.display = 'none';
  document.getElementById('no-trips').style.display = 'block';
}

function setupModalHandlers() {
  // Trip details modal
  const tripModal = document.getElementById('trip-modal');
  const closeBtn = tripModal.querySelector('.close');
  
  closeBtn.onclick = function() {
    tripModal.style.display = 'none';
  }
  
  window.onclick = function(event) {
    if (event.target === tripModal) {
      tripModal.style.display = 'none';
    }
  }
  
  // Edit modal
  const editModal = document.getElementById('edit-modal');
  const editCloseBtn = editModal.querySelector('.close');
  
  editCloseBtn.onclick = function() {
    closeEditModal();
  }
  
  window.onclick = function(event) {
    if (event.target === editModal) {
      closeEditModal();
    }
  }
}

async function viewTripDetails(tripId) {
  try {
    const response = await fetch(`/trips/${tripId}`);
    
    if (response.ok) {
      const data = await response.json();
      const trip = data.trip;
      
      const modalContent = document.getElementById('modal-content');
      modalContent.innerHTML = `
        <h2>${trip.tripName}</h2>
        <div class="trip-detail-view">
          <div class="detail-section">
            <h3>Trip Information</h3>
            <p><strong>Destination:</strong> ${trip.destination}</p>
            <p><strong>Start Date:</strong> ${formatDate(trip.startDate)}</p>
            <p><strong>End Date:</strong> ${formatDate(trip.endDate)}</p>
            <p><strong>Duration:</strong> ${calculateDuration(trip.startDate, trip.endDate)} days</p>
            <p><strong>Budget:</strong> ${trip.budget > 0 ? formatBudget(trip.budget) : 'Not specified'}</p>
            <p><strong>Status:</strong> <span class="trip-status ${trip.status}">${trip.status}</span></p>
          </div>
          
          <div class="detail-section">
            <h3>Places to Visit</h3>
            ${trip.places.length > 0 ? 
              `<ul class="places-list">${trip.places.map(place => 
                `<li><strong>${place.name}</strong>${place.address ? `<br><small>${place.address}</small>` : ''}</li>`
              ).join('')}</ul>` :
              '<p>No specific places planned yet</p>'
            }
          </div>
          
          ${trip.notes ? `
            <div class="detail-section">
              <h3>Additional Notes</h3>
              <p>${trip.notes}</p>
            </div>
          ` : ''}
          
          <div class="detail-section">
            <h3>Trip Timeline</h3>
            <p><strong>Created:</strong> ${formatDate(trip.createdAt)}</p>
            ${trip.updatedAt ? `<p><strong>Last Updated:</strong> ${formatDate(trip.updatedAt)}</p>` : ''}
          </div>
        </div>
      `;
      
      document.getElementById('trip-modal').style.display = 'block';
    } else {
      alert('Failed to load trip details');
    }
  } catch (error) {
    console.error('Error loading trip details:', error);
    alert('Failed to load trip details');
  }
}

async function editTrip(tripId) {
  try {
    const response = await fetch(`/trips/${tripId}`);
    
    if (response.ok) {
      const data = await response.json();
      const trip = data.trip;
      
      // Populate edit form
      document.getElementById('edit-trip-id').value = trip.id;
      document.getElementById('edit-trip-name').value = trip.tripName;
      document.getElementById('edit-destination').value = trip.destination;
      document.getElementById('edit-start-date').value = trip.startDate;
      document.getElementById('edit-end-date').value = trip.endDate;
      document.getElementById('edit-budget').value = trip.budget;
      document.getElementById('edit-notes').value = trip.notes;
      
      // Show edit modal
      document.getElementById('edit-modal').style.display = 'block';
    } else {
      alert('Failed to load trip for editing');
    }
  } catch (error) {
    console.error('Error loading trip for editing:', error);
    alert('Failed to load trip for editing');
  }
}

function setupEditForm() {
  document.getElementById('edit-trip-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const tripId = document.getElementById('edit-trip-id').value;
    const updateData = {
      tripName: document.getElementById('edit-trip-name').value,
      destination: document.getElementById('edit-destination').value,
      startDate: document.getElementById('edit-start-date').value,
      endDate: document.getElementById('edit-end-date').value,
      budget: parseFloat(document.getElementById('edit-budget').value) || 0,
      notes: document.getElementById('edit-notes').value
    };
    
    try {
      const response = await fetch(`/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        alert('Trip updated successfully!');
        closeEditModal();
        loadTrips(); // Reload trips
      } else {
        const error = await response.json();
        alert('Failed to update trip: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip');
    }
  });
}

function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none';
  document.getElementById('edit-trip-form').reset();
}

async function deleteTrip(tripId) {
  if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch(`/trips/${tripId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('Trip deleted successfully!');
      loadTrips(); // Reload trips
    } else {
      const error = await response.json();
      alert('Failed to delete trip: ' + error.error);
    }
  } catch (error) {
    console.error('Error deleting trip:', error);
    alert('Failed to delete trip');
  }
}

// Helper functions
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatBudget(budget) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(budget);
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

