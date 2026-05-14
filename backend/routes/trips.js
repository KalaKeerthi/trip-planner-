const express = require('express');
const router = express.Router();

// In-memory storage for trips (in production, use a database)
let trips = [];
let tripIdCounter = 1;

// Save a new trip
router.post('/save', (req, res) => {
  try {
    const { userId, tripName, destination, startDate, endDate, places, budget, notes } = req.body;
    
    if (!userId || !tripName || !destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTrip = {
      id: tripIdCounter++,
      userId,
      tripName,
      destination,
      startDate,
      endDate,
      places: places || [],
      budget: budget || 0,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      status: 'planned'
    };

    trips.push(newTrip);
    
    res.status(201).json({
      message: 'Trip saved successfully',
      trip: newTrip
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save trip' });
  }
});

// Get all trips for a user
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userTrips = trips.filter(trip => trip.userId === userId);
    
    res.json({
      trips: userTrips,
      count: userTrips.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trips' });
  }
});

// Get a specific trip by ID
router.get('/:tripId', (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = trips.find(t => t.id === parseInt(tripId));
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json({ trip });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trip' });
  }
});

// Update a trip
router.put('/:tripId', (req, res) => {
  try {
    const { tripId } = req.params;
    const updateData = req.body;
    
    const tripIndex = trips.findIndex(t => t.id === parseInt(tripId));
    
    if (tripIndex === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    trips[tripIndex] = { ...trips[tripIndex], ...updateData, updatedAt: new Date().toISOString() };
    
    res.json({
      message: 'Trip updated successfully',
      trip: trips[tripIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete a trip
router.delete('/:tripId', (req, res) => {
  try {
    const { tripId } = req.params;
    const tripIndex = trips.findIndex(t => t.id === parseInt(tripId));
    
    if (tripIndex === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    const deletedTrip = trips.splice(tripIndex, 1)[0];
    
    res.json({
      message: 'Trip deleted successfully',
      trip: deletedTrip
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// Get all trips (for admin purposes)
router.get('/', (req, res) => {
  try {
    res.json({
      trips,
      count: trips.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trips' });
  }
});

module.exports = router;

