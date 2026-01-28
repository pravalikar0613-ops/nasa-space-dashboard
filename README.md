# NASA Near-Earth Objects Space Dashboard

A full-stack web application that visualizes Near-Earth Objects (NEOs) using NASA’s NeoWs (Near Earth Object Web Service).  
The system consists of:

- **Backend:** Node.js + TypeScript + Fastify (API, validation, sorting, caching, Swagger docs)  
- **Frontend:** React + TypeScript + Vite (dashboard UI)

Users can select a date, view asteroid data, and sort results by size, distance, or velocity.

---

## Features

### Backend
- Fetches data from NASA NeoWs API
- Normalizes complex NASA responses
- Server-side sorting
- Input validation with Zod
- In-memory caching
- OpenAPI 3 (Swagger UI)
- CORS enabled

### Frontend
- Date picker
- Sortable table columns
- Clickable asteroid names (NASA JPL links)
- Loading & error states
- Responsive layout

---

## Tech Stack

**Backend**
- Node.js 18+
- TypeScript
- Fastify
- Zod
- Swagger / OpenAPI

**Frontend**
- React 18
- TypeScript
- Vite
- Fetch API

---

## 📂 Project Structure

nasa-space-dashboard/
├─ server/ # Backend
├─ client/ # Frontend
└─ README.md


---

## Prerequisites

- Node.js 18+
- npm
- Git
- (Optional) Postman

---

# Backend Setup

```bash
cd server
npm install

Created .env file
NASA_API_KEY=DEMO_KEY
PORT=3001

Run backend
```bash 
npm run dev
```
---


