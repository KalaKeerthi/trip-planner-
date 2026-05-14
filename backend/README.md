# Travel Planner Backend

This is the backend for the **Travel Planner** web app.  
It provides APIs for:
- Tourist places search by city
- User authentication (login/register)
- Contact/guide request form

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The server runs on **http://localhost:3000**.

## API Endpoints

- `GET /places/:city` — Get tourist places for a city
- `POST /auth/register` — Register new user (`{username, password, email}`)
- `POST /auth/login` — Login user (`{username, password}`)
- `POST /contact` — Send guide/contact request (`{name, email, city, guide, message}`)

## Data

Tourist place data is in `data/places.js`.  
Authentication and contact requests use in-memory data (for demo).

## Next Steps

- Connect to a database for real user and contact data
- Integrate third-party travel/tourist APIs

---