# MediRaksha - Architecture & Design Document

## 1. Overview
MediRaksha is a modern, scalable, and cloud-ready Pharmacy and Medical Store Management System (ERP). It provides comprehensive modules for Inventory, Billing, Purchasing, and Reporting, emphasizing high performance and user-friendly design.

## 2. Technology Stack
- **Frontend**: React (Vite) + TypeScript + Redux Toolkit / Zustand + Tailwind CSS / Vanilla CSS
- **Backend**: ASP.NET Core 8 Web API
- **Database**: SQL Server (via Entity Framework Core, supporting Cosmos DB repository abstraction)
- **Authentication**: JWT + Refresh Tokens (Role-Based Access Control)
- **Deployment**: Docker + Azure Cloud Ready

## 3. Backend Architecture (Clean Architecture)
The backend enforces Clean Architecture principles, ensuring separation of concerns:

- **MediRaksha.Domain**: Contains the core business rules and enterprise logic (Entities, Value Objects, Interfaces).
- **MediRaksha.Application**: Application-specific business rules (CQRS Handlers, Services, DTOs, Mapping profiles, Validation).
- **MediRaksha.Infrastructure**: Implementation of data access, external services, and third-party tools (EF Core DbContext, Repositories, Caching, Hangfire).
- **MediRaksha.API**: The entry point of the application containing Controllers, Middleware (Global Exception Handling), Swagger config, and DI bindings.
- **MediRaksha.Shared**: Cross-cutting concerns such as constants, enums, helper methods, and generic response wrappers.

## 4. Frontend Architecture
The React application follows a feature-based folder structure:

```text
frontend/
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components (Modals, Tables, Forms)
│   ├── features/         # Feature modules (Auth, Billing, Inventory, Dashboard)
│   ├── hooks/            # Custom React Hooks
│   ├── layouts/          # Application layouts (Dashboard layout, Auth layout)
│   ├── services/         # API HTTP client configurations
│   ├── store/            # Redux or Zustand global state
│   ├── types/            # TypeScript interfaces/types
│   ├── utils/            # Helper functions
│   └── App.tsx           # Entry point and Routing
```

## 5. Key Design Patterns
- **Repository & Unit of Work**: Abstracts database operations and manages transaction integrity.
- **CQRS (Command Query Responsibility Segregation)**: Optimizes reads and writes.
- **Dependency Injection**: Promotes loose coupling.
- **Result Wrapper Pattern**: Standardizes API responses across the platform.

## 6. Security Standards
- Passwords hashed using Argon2 or BCrypt.
- Protection against SQL Injection (via EF Core).
- XSS and CSRF protections implemented at the gateway/frontend levels.
- Rate limiting middleware applied to API endpoints.

## 7. DevOps & Deployment
- Environment-specific configurations (`appsettings.json`, `.env`).
- Multi-stage Dockerfiles for optimized production builds.
- Seamless integration with Azure Web Apps or AKS (Azure Kubernetes Service).
- Cloud storage integration (Azure Blob Storage) for backup logs.
