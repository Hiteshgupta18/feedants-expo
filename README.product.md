# Feedants

Feedants is a modern competition platform built for discovery, participation, and community engagement.

## Why it stands out

- Browse competitions with rich detail pages
- Join events quickly and securely
- Submit entries through a streamlined mobile experience
- Support media-rich competition storytelling with judges, winners, and uploads

## Built with

- Node.js + Express for the API layer
- MongoDB for data persistence
- React Native + Expo for the mobile experience
- TypeScript across the stack

## Quick start

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

```bash
cd feedants-expo
npm install
npm start
```

## Core experience

Users can sign in, explore competitions, register for open challenges, and submit materials from the mobile app.

## Project structure

```text
backend/      API server and database logic
feedants-expo/  React Native app
```

## Notes

The Expo app connects to the backend through a local IP address, so its API URL may need to be updated when the machine reconnects to a different network.
