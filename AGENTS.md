# Delivery Finance - Architecture Guidelines & Agent Instructions

## Overview
This repository contains a full-stack financial and delivery logistics platform consisting of:
1. **Backend**: ASP.NET Core 8 Web API with PostgreSQL (Render), EF Core, and ASP.NET Core Identity.
2. **Frontend**: Next.js App Router (TypeScript, ESLint).
3. **Mobile**: React Native with Expo (TypeScript).

---

## Backend Clean Architecture Rules

All backend code MUST strictly follow the 3-tier **Clean Layered Architecture**:

```
Controllers Layer  ──>  Services Layer  ──>  Repositories Layer  ──>  Data / DbContext
 (HTTP/Presentation)     (Business Logic)      (Data Access / EF)      (Database / Models)
```

### 1. Controllers Layer (`Controllers/`)
- **Responsibility:** Exclusively handles HTTP routing, request deserialization, ModelState validation, HTTP response statuses (`Ok`, `BadRequest`, `Unauthorized`, `NotFound`), and OpenAPI/Swagger annotations.
- **Constraints:**
  - Controllers MUST NOT directly reference `ApplicationDbContext`, `UserManager`, or `RoleManager`.
  - Controllers MUST ONLY inject and call **Services** (`IAuthService`, `IRoleService`, etc.).
  - Controllers must return strongly-typed DTO responses.

### 2. Services Layer (`Services/Interfaces/` & `Services/Implementations/`)
- **Responsibility:** Implements all core business logic, domain validations, business workflow orchestrations, and DTO mappings.
- **Constraints:**
  - Services MUST NOT return HTTP-specific types (`IActionResult`, `StatusCodes`).
  - Services interact with the data layer exclusively through **Repositories** (`IUserRepository`, `IRoleRepository`, `IUnitOfWork`, `IRepository<T>`).
  - Contains security, hashing, token generation (`ITokenService`), and role assignment logic.

### 3. Repositories Layer (`Repositories/Interfaces/` & `Repositories/Implementations/`)
- **Responsibility:** Encapsulates all data access and query logic against Entity Framework Core and Identity stores.
- **Components:**
  - `IRepository<T>`: Generic repository for standard CRUD operations.
  - `IUserRepository`: Encapsulates user retrieval, creation, credential validation, and role assignment.
  - `IRoleRepository`: Encapsulates role creation, existence checks, and dynamic querying from the `AspNetRoles` database table.
  - `IUnitOfWork`: Coordinates multiple repositories and manages atomic transactions via `SaveChangesAsync()`.
- **Constraints:**
  - Repositories MUST NOT contain business rules or validation logic.
  - Queries for read operations SHOULD use `.AsNoTracking()` for performance.

### 4. Dynamic Roles & Database Storage (No Hardcoded User Types)
- User roles (e.g., `Admin`, `Delivery`, `Customer`) MUST be stored in and queried dynamically from the database (`AspNetRoles` table).
- New roles can be created and managed dynamically at runtime via `RolesController` / `IRoleService`.
- Registration and role assignment dynamically validate against roles currently present in the database table.
- Baseline roles and default administrator are seeded during initial setup via `DbInitializer.cs`.

### 5. Security & Identity Standards
- ASP.NET Core Identity enforces production-grade security:
  - Strong password requirements (minimum 8 characters, uppercase, lowercase, digit, non-alphanumeric).
  - Account lockout after 5 consecutive failed attempts (15-minute duration).
  - Unique email enforcement.
- JWT Bearer Authentication with HMAC-SHA256 signature, expiry verification, and role claims.
- Lean `Program.cs`: All service dependencies are registered via modular extension methods in `Extensions/ServiceCollectionExtensions.cs`.

---

## Inter-Project Connectivity via Environment Variables

All services communicate through unified environment variables:

| Component | Port | Env Variable | Template File |
| :--- | :--- | :--- | :--- |
| **Backend** | `5000` (HTTP) / `7001` (HTTPS) | `ASPNETCORE_URLS`, `ConnectionStrings__DefaultConnection`, `Jwt__Key` | `backend/.env.example` |
| **Frontend** | `3000` | `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000`) | `frontend/.env.example`, `frontend/.env.local` |
| **Mobile** | `8081` | `EXPO_PUBLIC_API_URL` (iOS: `http://localhost:5000`, Android: `http://10.0.2.2:5000`) | `mobile/.env.example`, `mobile/.env` |

### API Clients
- **Frontend Client:** `frontend/src/services/api.ts`
- **Mobile Client:** `mobile/src/services/api.ts`

---

## Coding Standards & Scalability Checklist
1. **Dependency Injection:** Register all new interfaces and implementations in `Extensions/ServiceCollectionExtensions.cs`.
2. **Async Everywhere:** All database and I/O operations must be asynchronous (`async` / `await` with `Task`).
3. **No Redundancy:** Do not duplicate models or queries. Keep DTOs separated from domain models.
4. **Environment Fallbacks:** Never hardcode secret keys or hostnames directly in code; always use `IConfiguration` or `process.env`.

---

## Mandatory Engineering Rule: Post-Story Line-by-Line Audit & Dry Run

After completing **ANY USER STORY**, the engineer or agent MUST NOT immediately mark it complete or move to the next task. You MUST execute the following 4-step audit:

1. **Line-by-Line Dry Run:** Read through every modified and newly written line of code. Trace variable flows, null safety, boundary conditions, async task handling, and transaction disposal.
2. **Function-by-Function Contract Verification:** Verify that every service method respects parameter contracts, exception-throwing conventions, DTO separation, and clean architecture boundaries (Controllers never call DbContext; Repositories never execute business rules).
3. **Ripple Effect & Side-Effect Assessment:** Inspect whether modifying this entity/endpoint alters or breaks downstream modules (e.g., changing shift stop rates affects payroll calculations; updating bank transactions impacts quarterly VAT totals; vehicle mileage updates trigger compliance intervals).
4. **Automated & Manual Verification Run:** Execute test suites or curl/http invocations to verify that compilation succeeds with zero warnings, migrations apply cleanly, and HTTP status codes match the specification.

