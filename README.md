# FMDC Clinical Management System

A full-stack clinical management system built with ASP.NET Core Web API and React. The backend is composed of two independently deployable modules — **FMDCOperations** and **FMDCUsers** — communicating asynchronously via **Apache Kafka**.

## Overview

FMDC is a clinical management platform designed to handle clinical operations and user/patient management as separate, decoupled services. Event-driven communication via Kafka allows the two modules to stay in sync without tight coupling, supporting scalability and independent deployment.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   React Client    │ ◄─────► │   ASP.NET Core APIs │
└─────────────────┘         └────────┬───────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                                     │
          ┌─────────▼──────────┐              ┌─────────▼──────────┐
          │   FMDCOperations     │              │    FMDCUsers          │
          │   (ASP.NET Core API)  │◄────Kafka───►│   (ASP.NET Core API)  │
          └─────────┬──────────┘              └─────────┬──────────┘
                    │                                     │
              ┌─────▼─────┐                        ┌─────▼─────┐
              │  Operations DB │                    │    Users DB    │
              │  (EF Core)      │                    │   (EF Core)    │
              └───────────┘                        └───────────┘
```

### Modules

**FMDCOperations**
Handles clinical operations: appointments, receipts, and prescriptions.

**FMDCUsers**
Handles users, patients, cities, and provinces.

**Kafka Messaging**
FMDCOperations communicates with FMDCUsers via a request/response pattern over Kafka topics — e.g. FMDCOperations publishes a lookup request to `user-lookup-requests` (for patient/user details needed when creating appointments, receipts, or prescriptions), and FMDCUsers responds via `user-lookup-responses`. This decouples the modules so each can scale and deploy independently while still sharing the data they need.

A ready-to-use Kafka setup is included in the `Kafka Docker Setup` folder (`docker-compose.yml`) for local development.

## Tech Stack

**Backend**

- ASP.NET Core Web API (.NET 10)
- Entity Framework Core (Code-First — databases are created automatically on first run)
- Apache Kafka (inter-service messaging)
- JWT Authentication

**Frontend**

- React
- Node.js v24.13.1

## Project Structure

```
/backend
  /FMDCOperations         # Clinical operations API (appointments, receipts, prescriptions)
  /FMDCUsers              # User management API (users, patients, cities, provinces)
/frontend
  /fmdc-client            # React application
/Kafka Docker Setup
  docker-compose.yml       # Local Kafka broker setup
```

## Prerequisites

- .NET 10 SDK
- Node.js v24.13.1
- Docker (for running Kafka locally)
- SQL Server (or your configured EF Core provider) — separate instances/databases for each module

## Environment Setup

Each backend module manages its own database configuration. Example structure:

```env
# FMDCOperations
DBSERVER=<Database Server Name>
DBNAME=<Operations DB Name>
DBUSER=<Database User>
DBPASSWORD=<Database Password>

JWT_SECRET=<JWT Signing Key>
JWT_ISSUER=<Issuer>
JWT_AUDIENCE=<Audience>

ASPNETCORE_ENVIRONMENT=Development
```

```env
# FMDCUsers
DBSERVER=<Database Server Name>
DBNAME=<Users DB Name>
DBUSER=<Database User>
DBPASSWORD=<Database Password>

JWT_SECRET=<JWT Signing Key>
JWT_ISSUER=<Issuer>
JWT_AUDIENCE=<Audience>

ASPNETCORE_ENVIRONMENT=Development
```

```env
# Frontend (.env)
REACT_APP_API_BASE_URL=<API base URL>
```

> **Note:** EF Core is configured Code-First — databases and schemas are created automatically on first run/migration. No manual database setup is required beyond providing valid connection details.

> **Kafka Configuration:** Kafka brokers and topic names are currently hardcoded in the source (`user-lookup-requests` / `user-lookup-responses` topics, brokers at `localhost:19092-19094`). If you run Kafka on different ports/hosts, update these values directly in the code rather than via environment variables.

## Getting Started

### 1. Start Kafka (local development)

```bash
cd "Kafka Docker Setup"
docker-compose up -d
```

This spins up the Kafka brokers on `localhost:19092-19094` as expected by both backend modules.

### 2. Run the Backend Modules

```bash
# FMDCOperations
cd backend/FMDCOperations
dotnet restore
dotnet run

# FMDCUsers
cd backend/FMDCUsers
dotnet restore
dotnet run
```

EF Core will create each module's database automatically based on the connection string provided in the environment configuration.

### 3. Run the Frontend

```bash
cd frontend/fmdc-client
npm install
npm start
```

## Features

- Modular, event-driven backend architecture (Operations & Users decoupled via Kafka)
- Appointment, receipt, and prescription management (FMDCOperations)
- User, patient, city, and province management (FMDCUsers)
- JWT-based authentication
- EF Core Code-First — zero manual database setup
- React-based clinical management dashboard

## License

<!-- Add license information -->
