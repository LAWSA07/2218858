# Affordmed Campus Hiring Evaluation – Full Stack URL Shortener

## Overview
This project is a full stack URL shortener built for the Affordmed Campus Hiring Evaluation. It includes:
- A reusable logging middleware (TypeScript, usable in both backend and frontend)
- A backend microservice (Node.js/Express, TypeScript)
- A React frontend (TypeScript, Material UI)

## Project Structure
```
├── logging-middleware/         # Reusable logging package
├── backend-test-submission/    # Express backend microservice
├── frontend-test-submission/   # React frontend (Material UI)
```

## Setup Instructions

### 1. Logging Middleware
- Navigate to `logging-middleware/`
- Install dependencies: `npm install`
- Build the package: `npm run build`
- Link or install this package in both backend and frontend as a local dependency

### 2. Backend
- Navigate to `backend-test-submission/`
- Install dependencies: `npm install`
- Create a `.env` file with your Affordmed logging token:
  ```
  LOG_TOKEN=your_affordmed_access_token
  ```
- Start the backend:
  ```
  npx ts-node src/index.ts
  ```
- The backend runs on `http://localhost:4000` by default

### 3. Frontend
- Navigate to `frontend-test-submission/`
- Install dependencies: `npm install`
- Create a `.env` file with the backend URL:
  ```
  REACT_APP_BACKEND_URL=http://localhost:4000
  ```
- Start the frontend:
  ```
  npm start
  ```
- The frontend runs on `http://localhost:3000` (required by Affordmed)

## .env Files
- **Never commit `.env` files or secrets to version control.**
- Each app (backend, frontend) requires its own `.env` file as described above.

## Submission Notes
- Do not include your name, Affordmed, or any identifying info in the repo name, README, or commit messages.
- Commit and push regularly at logical milestones.
- Ensure all code is production-grade, well-structured, and commented where appropriate.

## Requirements Met
- Reusable logging middleware (used in both backend and frontend)
- Backend: URL shortening, analytics, robust error handling, in-memory storage
- Frontend: Responsive, Material UI, modern design, analytics dashboard
- All secrets/config in `.env` files
- No authentication required for backend endpoints (per Affordmed instructions)

---

**Good luck!** 