const express = require('express');
const { readJson, writeJson } = require('../data/store.js');

const router = express.Router();
const TRIPS_FILE = 'trips.json';

function loadStore() {
  return readJson(TRIPS_FILE, { nextId: 1, trips: [] });
}

function saveStore(store) {
  writeJson(TRIPS_FILE, store);
}

router.post('/save', (req, res) => {
  try {
    const { userId, tripName, destination, startDate, endDate, places, budget, notes } = req.body;

    if (!userId || !tripName || !destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const store = loadStore();
    const newTrip = {
      id: store.nextId++,
      userId: String(userId),
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

    store.trips.push(newTrip);
    saveStore(store);

    res.status(201).json({
      message: 'Trip saved successfully',
      trip: newTrip
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save trip' });
  }
});

router.get('/user/:userId', (req, res) => {
  try {
    const userId = String(req.params.userId);
    const store = loadStore();
    const userTrips = store.trips.filter(trip => trip.userId === userId);

    res.json({
      trips: userTrips,
      count: userTrips.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trips' });
  }
});

router.get('/:tripId', (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const store = loadStore();
    const trip = store.trips.find(t => t.id === tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ trip });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trip' });
  }
});

router.put('/:tripId', (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const updateData = req.body;
    const store = loadStore();
    const tripIndex = store.trips.findIndex(t => t.id === tripId);

    if (tripIndex === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    store.trips[tripIndex] = {
      ...store.trips[tripIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveStore(store);

    res.json({
      message: 'Trip updated successfully',
      trip: store.trips[tripIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

router.delete('/:tripId', (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const store = loadStore();
    const tripIndex = store.trips.findIndex(t => t.id === tripId);

    if (tripIndex === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const deletedTrip = store.trips.splice(tripIndex, 1)[0];
    saveStore(store);

    res.json({
      message: 'Trip deleted successfully',
      trip: deletedTrip
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

router.get('/', (req, res) => {
  try {
    const store = loadStore();
    res.json({
      trips: store.trips,
      count: store.trips.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trips' });
  }
});

module.exports = router;
