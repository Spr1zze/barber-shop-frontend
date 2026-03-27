# Barber Shop Frontend

Expo Router frontend for a barber booking project. The app lets a customer browse salons, view salon details, pick a treatment and barber, and create a booking from available time slots.

## Main Features

- Browse salons from the backend API
- Search salons by name or address
- View salon details, treatments, contact info, and opening hours
- Pick barber, date, and available time for a booking
- Review upcoming and past bookings
- Basic auth flow with demo users for development and presentation

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript

## Running The Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo dev server:

   ```bash
   npm start
   ```

3. If needed, point the app at the backend API:

   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:8000
   ```

If `EXPO_PUBLIC_API_BASE_URL` is not set, the app falls back to the Expo host IP, Android emulator host, or `localhost` depending on the environment.

## Demo Login

- Customer: `customer@example.com` / `customer123`
- Admin: `admin@example.com` / `admin123`

## Project Structure

- `app/`: route files and app-level providers
- `components/`: reusable UI components
- `features/salons/`: salon API, hooks, cache, and types
- `features/history/`: booking history API and data types

## Notes

- Authentication is currently demo-based and intended for development and presentation.
- The frontend expects a backend API running on port `8000`.
