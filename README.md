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
- Node.js (v18+)
- .NET 8 SDK
- SQL Server (LocalDB or Docker instance)

### Setup the Backend
1. Navigate to the `backend/` folder.
2. Update the connection string in `appsettings.json` (or `appsettings.Development.json`).
3. Run `dotnet restore`.
4. Apply migrations (if ready): `dotnet ef database update`.
5. Run the API: `dotnet run --project MediRaksha.API/MediRaksha.API.csproj`.

### Setup the Frontend
1. Navigate to the `frontend/` folder.
2. Install dependencies: `npm install`.
3. Create a `.env.local` file with the API base URL (`VITE_API_BASE_URL=http://localhost:5000/api`).
4. Run the development server: `npm run dev`.

## Deliverables Status
- [x] Full backend architecture setup (Clean Architecture)
- [x] Frontend architecture setup (Vite React TS)
- [ ] SQL schema & Migrations
- [x] Entity models (Core models initiated)
- [ ] DTOs, Controllers, Services
- [ ] UI Dashboards
- [x] Environment & Architecture documentation

*(See `ARCHITECTURE.md` for in-depth architecture and design patterns).*
