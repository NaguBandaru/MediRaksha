# MediRaksha - Pharmacy / Medical Store Management System

## Welcome to MediRaksha!

MediRaksha is a modern, enterprise-grade, cloud-ready Medical Store and Pharmacy ERP application. It provides end-to-end management from inventory and billing to accounting and reporting, tailored specifically for pharmacies. 

## Project Structure
This repository acts as a monorepo containing both the backend API and the frontend client.

- **`backend/`**: ASP.NET Core 8 Web API implementing Clean Architecture.
- **`frontend/`**: React 18 + TypeScript application powered by Vite.

## Features
- **Authentication & Authorization**: Role-based access control (Super Admin, Store Owner, Pharmacist, Billing Staff, Inventory Manager).
- **Dashboard**: Real-time sales, low stock alerts, and expiry notifications.
- **Inventory Management**: Batch tracking, expiry tracking, return management.
- **Billing / POS**: Fast keyboard-friendly UI, barcode scanning, GST calculation.
- **Reports**: Sales, purchases, GST, profit/loss, expiry reports.
- **Backup**: Automatic daily backups, Azure Cloud ready.

## Getting Started (Development)

### Prerequisites
- **Node.js** (v18+) — [Download](https://nodejs.org/)
- **.NET 8 SDK** — [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server** — LocalDB, SQL Server Express, or a Docker instance

### Quick Start (TL;DR)

Open **two terminals** and run:

```bash
# Terminal 1 — Backend API
cd backend
dotnet restore
dotnet run --project MediRaksha.API/MediRaksha.API.csproj

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

> **Note:** The backend will automatically apply database migrations and seed initial data on first run.

---

### Step-by-Step Setup

#### 1. Setup the Database
1. Ensure SQL Server is running on `localhost` (default instance).
2. The app will auto-create the `MediRakshaDb` database via EF Core migrations on first startup.
3. *(Optional)* To use a custom SQL Server instance, update the connection string in `backend/MediRaksha.API/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=MediRakshaDb;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

#### 2. Setup the Backend
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```
3. Run the API server:
   ```bash
   dotnet run --project MediRaksha.API/MediRaksha.API.csproj
   ```
4. The API starts at **http://localhost:5273**. Verify by visiting the health endpoint:
   ```
   http://localhost:5273/health
   ```
5. Swagger UI is available at:
   ```
   http://localhost:5273/swagger
   ```

> **Note:** The backend uses Serilog with Microsoft logs suppressed at Warning level, so the usual "Now listening on http://..." message may not appear in the console. The server is running if no errors are shown after the build completes.

#### 3. Setup the Frontend
1. Navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend/` directory with the API base URL:
   ```env
   VITE_API_URL=http://localhost:5273/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open **http://localhost:5173** in your browser.

### Default Login Credentials
After first startup, the database is seeded with an admin account:

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@mediraksha.com` |
| Password | `Admin@123`            |

### Available URLs

| Service        | URL                                  |
|----------------|--------------------------------------|
| Frontend App   | http://localhost:5173                 |
| Backend API    | http://localhost:5273/api             |
| Swagger UI     | http://localhost:5273/swagger         |
| Health Check   | http://localhost:5273/health          |

### Troubleshooting

| Issue | Fix |
|-------|-----|
| `Couldn't find a project to run` | You must specify the project: `dotnet run --project MediRaksha.API/MediRaksha.API.csproj` |
| Backend hangs after build | Ensure SQL Server is running. The app waits for DB connection during migration. |
| Frontend API calls fail (CORS / 404) | Verify `.env.local` exists with `VITE_API_URL=http://localhost:5273/api` and restart the Vite dev server. |
| No "Now listening on" message | This is expected — Serilog config suppresses Microsoft hosting logs. Check `http://localhost:5273/health` to confirm the server is running. |

## Deliverables Status
- [x] Full backend architecture setup (Clean Architecture)
- [x] Frontend architecture setup (Vite React TS)
- [ ] SQL schema & Migrations
- [x] Entity models (Core models initiated)
- [ ] DTOs, Controllers, Services
- [ ] UI Dashboards
- [x] Environment & Architecture documentation

*(See `ARCHITECTURE.md` for in-depth architecture and design patterns).*
