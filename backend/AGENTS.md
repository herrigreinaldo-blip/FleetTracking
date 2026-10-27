# Backend Clean Architecture Guidelines

Please refer to the main repository documentation in [AGENTS.md](../AGENTS.md).

## Layer Structure
- `Controllers/`: HTTP presentation and routing only. Injects only services.
- `Services/`: Business logic, domain validations, JWT token issuance. Injects repositories.
- `Repositories/`: Direct EF Core DbContext and Identity data access operations (`IRepository<T>`, `IUserRepository`, `IRoleRepository`, `IUnitOfWork`).
- `Data/`: `ApplicationDbContext`, EF Core Migrations, and `DbInitializer`.
- `Models/`: Entity models (`ApplicationUser`, etc.).
- `DTOs/`: Request/Response data transfer objects.
- `Extensions/`: Modular `IServiceCollection` extension methods.

## Role Storage
User types and roles are persisted in the `AspNetRoles` PostgreSQL table and queried dynamically at runtime via `IRoleRepository` and `IRoleService`.
