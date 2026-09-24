# Feedants

Feedants is a competition platform that connects users to curated challenge experiences through a Node.js backend and a React Native mobile client. It supports authentication, competition discovery, registration, submission flows, and media-backed competition content.

## Overview

This repository contains two primary applications:

- `backend/` — Express + TypeScript API with MongoDB persistence
- `feedants-expo/` — Expo mobile app for browsing and interacting with competitions

## Features

- User registration and login
- Competition detail browsing
- Registration for active competitions
- Submission handling for eligible participants
- Uploaded media support for judges, winners, and competition assets
- JWT-based authentication
- Type-safe API and app layers with TypeScript

## Tech stack

### Backend
- Node.js
- TypeScript
- Express
- MongoDB + Mongoose
- JWT
- Zod validation
- Helmet, CORS, Morgan

### Mobile app
- React Native
- Expo
- Axios
- React Query
- Zustand
- Async Storage

## Repository structure

```text
feedants-intern/
├── backend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── feedants-expo/
│   ├── app/
│   ├── src/
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── README.md
├── README.product.md
├── .gitignore
└── .DS_Store
```

## Prerequisites

Before you begin, make sure you have:

- Node.js 18 or newer
- npm
- MongoDB running locally or a reachable MongoDB URI
- Expo CLI for running the app

## Quick start

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update your `.env` file:

```env
PORT=5050
MONGODB_URI=mongodb://localhost:27017/feedants
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Then start the server:

```bash
npm run dev
```

The API is now available at:

```text
http://localhost:5050/api
```

Health check:

```bash
curl http://localhost:5050/api/health
```

### 2) Mobile app

```bash
cd feedants-expo
npm install
```

Update the backend URL in `src/api/client.ts` with your machine’s local network IP:

```ts
const LOCAL_IP = 'YOUR_LOCAL_IP';
const PORT = 5050;
```

Find your local address on macOS:

```bash
ipconfig getifaddr en0
```

Start the Expo app:

```bash
npm start
```

Use Expo Go or an emulator to run the app.

## API routes

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Competitions
- `GET /api/competitions/:id`
- `POST /api/competitions/:id/register`
- `POST /api/competitions/:id/submission`

## Important notes

- The backend serves uploaded files from `backend/public/uploads` under `/uploads`.
- The Expo app uses a local IP address for backend requests, so it may need updating when your network changes.
- The backend port is expected to remain aligned with the frontend’s configured port, currently `5050`.

## Useful scripts

### Backend
```bash
npm run dev
npm run build
npm run start
npm run seed
```

### Mobile app
```bash
npm start
npm run android
npm run ios
npm run web
```

## Troubleshooting

### App cannot connect to backend
- Confirm the backend is running
- Verify the IP in `feedants-expo/src/api/client.ts`
- Ensure both devices are on the same network
- Confirm the backend port matches the frontend API base URL

### MongoDB connection errors
- Ensure MongoDB is running
- Check that `MONGODB_URI` is valid and reachable

### JWT auth issues
- Verify `JWT_SECRET` is defined in the backend `.env` file
- Ensure the token is being sent with authenticated requests

## License

This project does not currently declare a license in the repository.
