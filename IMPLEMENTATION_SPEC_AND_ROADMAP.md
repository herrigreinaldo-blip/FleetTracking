# Delivery Finance Platform: High-Definition Implementation Specification & Sprint Roadmap

> **CONFIDENTIAL & PROPRIETARY**  
> **Target Platform:** Delivery Logistics, Fleet Management & Multi-Entity Financial Engine  
> **Supported Carriers:** DPD, Amazon, DHL, DX, Parcel Force  
> **Operating Entities:** MS Herrig Ltd, TGB Services and Solutions Ltd, GoConnect Partnership  
> **Architecture:** 3-Tier Clean Layered Architecture (ASP.NET Core 8 Web API + PostgreSQL + Next.js App Router + React Native Expo)

---

## Mandatory Engineering Rule: Post-Story Line-by-Line Audit Protocol

> [!IMPORTANT]
> ### THE ZERO-REGRESSION DRY-RUN AUDIT DIRECTIVE
> After **EVERY SINGLE USER STORY** is completed, the implementing engineer or autonomous agent **MUST NOT** proceed to the next story immediately.
> 
> You MUST execute the following 4-step audit:
> 1. **Line-by-Line Code Dry Run:** Read through every modified and newly created line of code. Trace variable flows, null safety, boundary conditions, async task handling, and transaction disposal.
> 2. **Function-by-Function Contract Verification:** Verify that every service method respects parameter contracts, exception throwing conventions, DTO separation, and clean architecture boundaries (Controllers never call DbContext; Repositories never execute business rules).
> 3. **Ripple Effect & Side-Effect Assessment:** Inspect whether modifying this entity/endpoint alters or breaks downstream modules (e.g. changing shift stop rates affects payroll calculations; updating bank transactions impacts quarterly VAT totals; vehicle mileage updates trigger compliance intervals).
> 4. **Automated & Manual Verification Run:** Execute test suites or curl/http invocations to verify that compilation succeeds with zero warnings, migrations apply cleanly, and the HTTP status codes match the specification.

---

# Milestone Overview

| Milestone | Focus Domain | Sprints Included | Core Deliverables |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | **Core Domain, Clean Architecture & Relational Persistence** | **Sprint 1** | Full PostgreSQL Relational Schema, EF Core Fluent API, Unit of Work, Seeding from Excel sheets. |
| **Milestone 2** | **Operations, Dispatch Calendar & Fleet Compliance** | **Sprint 2 & 3** | 4-Week Dispatch Matrix, Shift Schedulers, Absence/Leave Engine, Vehicle Asset Profiles, Automated Compliance Watchdog (`IHostedService`). |
| **Milestone 3** | **Financial Hub, Expense Auto-Linker & UK VAT Engine** | **Sprint 4 & 5** | Multi-Company Bank Ledger, Relational Auto-Router (Bank $\rightarrow$ Van Log / Driver Advance), Fuel Card Reconciliation, Quarterly HMRC MTD-Ready VAT. |
| **Milestone 4** | **Driver Payroll, Carrier Auditing & Mobile Driver App** | **Sprint 6, 7 & 8** | One-Click 4-Week Pay Run, PDF Remittance Advice (`RONALDO` model), DPD Billing Discrepancy Auditing, React Native Driver Companion App. |

---

# Milestone 1: Core Domain, Clean Architecture & Relational Persistence

## Sprint 1: Database Design, Schema Migration & Master Data Seeding

Sprint 1 establishes the single source of truth for the entire business. It formalizes all tables, relationships, constraints, enums, and seeds historical data extracted from the 3 sample Excel files.

---

### User Story 1.1: Multi-Entity, Carrier & Franchise Relational Schema
- **Story ID:** `S1-US1`
- **Goal:** Model the corporate entities (`MS Herrig Ltd`, `TGB Services and Solutions Ltd`, `GoConnect`), carrier partnerships (DPD, Amazon, DHL, DX, Parcel Force), and depot franchises (`FD` numbers).
- **What to do:** Create entity classes `Company`, `Carrier`, and `Franchise` with 1-to-many relationships.
- **How to do:**
  - `Company`: `Id (Guid)`, `Name (string 150)`, `CompanyNumber (string 50)`, `VatNumber (string 50, nullable)`, `DefaultDirectorSalaryTarget (decimal, default 5000)`.
  - `Carrier`: `Id (Guid)`, `Name (string 100)`, `BillingFormat (enum: DpdCsv, AmazonCsv, Manual)`.
  - `Franchise`: `Id (Guid)`, `FdCode (string 50, unique index)`, `DepotName (string 150)`, `CarrierId (FK)`, `CompanyId (FK)`.
- **Where to do:**
  - `backend/Models/Company.cs`
  - `backend/Models/Carrier.cs`
  - `backend/Models/Franchise.cs`
  - `backend/Data/ApplicationDbContext.cs`
- **Edge Cases:**
  - FD codes containing spaces or formatting differences (e.g. `FD 49699` vs `FD49699`) must be sanitized to uppercase trimmed alphanumeric strings (`FD49699`).
  - Company deletion must be restricted if active franchises or vehicles are associated (`DeleteBehavior.Restrict`).
- **Acceptance Criteria:**
  - [ ] Tables `Companies`, `Carriers`, and `Franchises` exist in PostgreSQL.
  - [ ] `FdCode` has a unique constraint.
  - [ ] Cascading deletes are prevented on corporate entities.
- **Test Cases:**
  - Unit Test: Inserting duplicate `FdCode` throws `DbUpdateException`.
  - Unit Test: Company creation with empty name fails validation.
- **Risks & Ripple Effects:**
  - All revenue tracking and bank transactions link to `Franchise` and `Company`. Any schema flaw here cascades across the entire financial engine.

---

### User Story 1.2: Driver Profile, Rate Models & Van Security Deposit Schema
- **Story ID:** `S1-US2`
- **Goal:** Model driver subcontractors (`DR` numbers), pricing rules (Day Rate, Stop Rate, Commission/Admin fee %), bank details, and the van damage deposit escrow ledger.
- **What to do:** Create `DriverProfile`, `DriverRateSetting`, `DriverDeposit`, and `DriverDepositTransaction` entities.
- **How to do:**
  - `DriverProfile`: `Id (Guid)`, `UserId (string FK to AspNetUsers)`, `DrNumber (string 50, unique)`, `FullName (string 150)`, `Phone`, `Address`, `BankName`, `BankSortCode (format XX-XX-XX)`, `BankAccountNumber (8 digits)`, `VatNumber (nullable)`, `SuppliesOwnVan (bool)`, `PeriodicVanRent (decimal)`, `AdminFeePercentage (decimal, default 6.0)`, `IsActive (bool)`.
  - `DriverDeposit`: `Id (Guid)`, `DriverId (FK, unique)`, `TargetDeposit (decimal, default 1000.0)`, `CurrentBalance (decimal)`, `InstallmentAmount (decimal, default 200.0)`, `IsFullyPaid (bool)`.
  - `DriverDepositTransaction`: `Id (Guid)`, `DriverDepositId (FK)`, `PayPeriodId (FK, nullable)`, `Date (DateTime)`, `Amount (decimal)`, `Type (enum: Deduction, Refund, Forfeit)`, `Notes (string)`.
- **Where to do:**
  - `backend/Models/DriverProfile.cs`
  - `backend/Models/DriverDeposit.cs`
  - `backend/Models/DriverDepositTransaction.cs`
- **Edge Cases:**
  - Driver deposit deductions must cease once `CurrentBalance >= TargetDeposit` (e.g. stopping at £1,000 as seen in `DEPOSIT FOR THE VANS`).
  - UK Sort Code and Account Number must be regex-validated (`^\d{2}-\d{2}-\d{2}$` and `^\d{8}$`).
- **Acceptance Criteria:**
  - [ ] Driver profile links cleanly 1-to-1 with Identity user and 1-to-1 with Deposit ledger.
  - [ ] Deposit balance dynamically reconciles with transaction ledger sum.
- **Test Cases:**
  - Unit Test: Verifying deposit accumulation stops triggering deductions when target reached.
  - Integration Test: Creating a driver with duplicate `DrNumber` fails.
- **Risks & Ripple Effects:**
  - Direct impact on payroll deductions. If `SuppliesOwnVan` is false, `PeriodicVanRent` must be charged automatically.

---

### User Story 1.3: Vehicle Fleet, Compliance & Document Vault Schema
- **Story ID:** `S1-US3`
- **Goal:** Model fleet vehicles (`KR23 XYZ`), financing loan tracking, compliance dates (MOT, Road Tax, Insurance, Service intervals), maintenance logs, and document attachments.
- **What to do:** Create `Vehicle`, `VehicleCompliance`, `VehicleServiceLog`, `VehicleDocument`, and `VehicleAssignment` entities.
- **How to do:**
  - `Vehicle`: `Id (Guid)`, `Registration (string 20, unique index)`, `Make (string 50)`, `Model (string 50)`, `Year (int)`, `CurrentMileage (int)`, `FuelType (enum: Diesel, Electric)`, `OwnershipType (enum: Owned, Financed, Leased, SubcontractorOwned)`, `CompanyId (FK)`.
  - Financing Fields: `PurchasePrice (decimal)`, `DepositPaid (decimal)`, `MonthlyFinancePayment (decimal)`, `FinanceTermMonths (int)`, `RemainingFinanceBalance (decimal)`.
  - `VehicleCompliance`: `Id (Guid)`, `VehicleId (FK, unique)`, `MotDueDate (DateTime)`, `RoadTaxDueDate (DateTime)`, `AnnualRoadTaxCost (decimal)`, `InsuranceDueDate (DateTime)`, `InsurancePolicyNumber (string)`, `Insurer (string)`, `NamedDrivers (string)`, `NextServiceMileage (int)`, `NextServiceDueDate (DateTime, nullable)`.
  - `VehicleServiceLog`: `Id (Guid)`, `VehicleId (FK)`, `Date (DateTime)`, `MileageAtService (int)`, `ServiceDescription (string)`, `LabourCost (decimal)`, `PartsCost (decimal)`, `TotalCost (computed: Labour + Parts)`, `SupplierOrGarage (string)`, `BankTransactionId (FK, nullable)`.
  - `VehicleDocument`: `Id (Guid)`, `VehicleId (FK)`, `DocumentType (enum: MotCertificate, InsuranceCertificate, V5CLogbook, LeaseAgreement, InspectionReport)`, `FileUrl (string)`, `UploadedAt (DateTime)`, `ExpiryDate (DateTime, nullable)`.
  - `VehicleAssignment`: `Id (Guid)`, `VehicleId (FK)`, `DriverId (FK)`, `StartDate (DateTime)`, `EndDate (DateTime, nullable)`, `IsCurrent (bool)`.
- **Where to do:**
  - `backend/Models/Vehicle.cs`
  - `backend/Models/VehicleCompliance.cs`
  - `backend/Models/VehicleServiceLog.cs`
  - `backend/Models/VehicleDocument.cs`
  - `backend/Models/VehicleAssignment.cs`
- **Edge Cases:**
  - A vehicle cannot be assigned to two active drivers simultaneously (`IsCurrent == true` must be unique per `VehicleId`).
  - Negative values for costs, mileage, or prices must be rejected by database CHECK constraints.
- **Acceptance Criteria:**
  - [ ] Tables created with foreign keys to `Company`, `DriverProfile`, and `BankTransaction`.
  - [ ] Index on `Vehicle.Registration` and composite index on `VehicleCompliance(MotDueDate, RoadTaxDueDate, InsuranceDueDate)`.
- **Test Cases:**
  - Integration Test: Insert full vehicle profile matching `KR23 XYZ` sample data and verify all child logs link correctly.
- **Risks & Ripple Effects:**
  - `VehicleServiceLog.BankTransactionId` bridges banking with fleet logs. Deleting a transaction must not cascade-delete vehicle history (`SetNull`).

---

### User Story 1.4: Dispatch Roster, Shift Allocations & Absence Schema
- **Story ID:** `S1-US4`
- **Goal:** Model daily route assignments, stop rates, extra bonuses, and driver absence/leave (Holidays, Sick, Days Off) to replace the 155-row `12-10 TO 08-11` and `July` sheets.
- **What to do:** Create `RosterShift`, `RouteDefinition`, and `DriverAbsence` entities.
- **How to do:**
  - `RouteDefinition`: `Id (Guid)`, `RouteCode (string 50)`, `DepotArea (string 100)`, `DefaultRateMultiplier (decimal)`, `CarrierId (FK)`.
  - `RosterShift`: `Id (Guid)`, `Date (DateTime)`, `DriverId (FK)`, `FranchiseId (FK)`, `RouteCode (string 50)`, `StopRateMultiplier (decimal)`, `PostCodeArea (string 50)`, `ActualStopsCompleted (int)`, `AgreedDailyRate (decimal)`, `ExtraPay (decimal)`, `Comments (string, nullable)`, `Status (enum: Scheduled, Completed, Cancelled, CoveredByOther)`.
  - `DriverAbsence`: `Id (Guid)`, `DriverId (FK)`, `StartDate (DateTime)`, `EndDate (DateTime)`, `Type (enum: Holiday, Sickness, DayOff, Emergency)`, `ApprovedBy (string)`, `Notes (string)`.
- **Where to do:**
  - `backend/Models/RouteDefinition.cs`
  - `backend/Models/RosterShift.cs`
  - `backend/Models/DriverAbsence.cs`
- **Edge Cases:**
  - If a driver has an approved absence on a specific date, attempting to schedule an active `RosterShift` must trigger a scheduling conflict error unless overridden.
  - Multi-day holidays spanning pay periods must allocate shifts/days accurately across boundary dates.
- **Acceptance Criteria:**
  - [ ] Composite unique index on `(DriverId, Date)` for active roster shifts.
  - [ ] Foreign keys established with `DriverProfile` and `Franchise`.
- **Test Cases:**
  - Unit Test: Scheduling a shift for a driver with status `Sick` or `Holiday` detects overlap.
- **Risks & Ripple Effects:**
  - Payroll engine relies directly on `RosterShift` stop counts and agreed rates. Inaccurate shift data corrupts payroll calculations.

---

### User Story 1.5: Banking, Smart Expense Router & UK VAT Engine Schema
- **Story ID:** `S1-US5`
- **Goal:** Model multi-company bank accounts, financial transactions, relational smart-routing foreign keys (auto-linking to van maintenance or driver advance), and quarterly UK VAT returns.
- **What to do:** Create `BankAccount`, `BankTransaction`, and `VatReturnQuarter` entities.
- **How to do:**
  - `BankAccount`: `Id (Guid)`, `CompanyId (FK)`, `BankName (string 100)`, `AccountNumber (string 20)`, `SortCode (string 10)`, `Currency (string 3, default GBP)`, `CurrentBalance (decimal)`.
  - `BankTransaction`: `Id (Guid)`, `BankAccountId (FK)`, `TransactionDate (DateTime)`, `Amount (decimal)`, `Type (enum: Inflow, Outflow, Transfer)`, `Category (enum: CarrierRevenue, DriverPayout, DriverAdvance, FuelDiesel, FuelElectric, VanFinance, FleetInsurance, VehicleMaintenance, OtherVanExpenses, AdminAccountancy, BankCharges, MaterialsTools, PersonalDrawing, IntercompanyTransfer)`, `Description (string 255)`, `PayeeDestination (string 150)`, `IsConfirmed (bool)`, `ReceiptUrl (string, nullable)`.
  - **Relational Smart Linkers**: `LinkedVehicleId (Guid FK nullable)`, `LinkedDriverId (Guid FK nullable)`.
  - **VAT Tracking**: `IsVatApplicable (bool)`, `VatRate (decimal, default 20.0)`, `VatElement (decimal)`.
  - `VatReturnQuarter`: `Id (Guid)`, `CompanyId (FK)`, `QuarterName (string 50)`, `StartDate (DateTime)`, `EndDate (DateTime)`, `TotalOutputVatReceived (decimal)`, `TotalInputVatPaid (decimal)`, `NetVatDue (decimal)`, `AmountPaidToHmrc (decimal)`, `Variance (decimal)`, `Status (enum: Draft, Submitted, Paid)`.
- **Where to do:**
  - `backend/Models/BankAccount.cs`
  - `backend/Models/BankTransaction.cs`
  - `backend/Models/VatReturnQuarter.cs`
- **Edge Cases:**
  - Reversible transactions: Changing a transaction category from `VehicleMaintenance` to `AdminAccountancy` must unbind `LinkedVehicleId` and remove the auto-generated line item from `VehicleServiceLog`.
  - Mid-period cash advance (`Category == DriverAdvance`): Must mandate `LinkedDriverId` not null.
- **Acceptance Criteria:**
  - [ ] Tables created with decimal precision `(18,2)`.
  - [ ] Foreign keys to `Vehicle` and `DriverProfile` configure `ON DELETE SET NULL`.
- **Test Cases:**
  - Unit Test: Calculating VAT element on a £120.00 gross fuel receipt with 20% VAT yields exactly £20.00 VAT and £100.00 net.
- **Risks & Ripple Effects:**
  - Changes to `BankTransaction` ripple into the monthly P&L summary, individual van cost records, driver payslip advances, and HMRC VAT returns.

---

### User Story 1.6: Carrier Audit & Payroll Remittance Schema
- **Story ID:** `S1-US6`
- **Goal:** Model pay periods (4-weekly, weekly, monthly), driver remittances/payslips, fuel card transaction splits, and carrier billing reconciliation (DPD Agreed vs Paid).
- **What to do:** Create `PayPeriod`, `DriverPayslip`, `FuelCardInvoice`, `FuelCardTransaction`, and `CarrierReconciliationRecord` entities.
- **How to do:**
  - `PayPeriod`: `Id (Guid)`, `PeriodType (enum: FourWeekly, Weekly, Monthly)`, `StartDate (DateTime)`, `EndDate (DateTime)`, `PaymentDate (DateTime)`, `Status (enum: Open, Calculating, Approved, Finalized)`.
  - `DriverPayslip`: `Id (Guid)`, `PayPeriodId (FK)`, `DriverId (FK)`, `TotalDaysWorked (int)`, `TotalStopsCompleted (int)`, `GrossDeliveryEarnings (decimal)`, `ExtraPaymentsBonus (decimal)`, `AdminFeeRate (decimal, 6%)`, `AdminFeeDeducted (decimal)`, `VanRentDeducted (decimal)`, `FuelCardDeducted (decimal)`, `DepositDeducted (decimal)`, `CashAdvanceDeducted (decimal)`, `FinesOrPenalties (decimal)`, `SubtotalExVat (decimal)`, `VatRate (decimal, 20%)`, `VatAmount (decimal)`, `TotalNetPaid (decimal)`, `PdfInvoiceUrl (string, nullable)`.
  - `FuelCardInvoice`: `Id (Guid)`, `Provider (enum: Shell, BpPulse, Keyfuels, Allstar)`, `InvoiceNumber (string)`, `InvoiceDate (DateTime)`, `TotalGrossAmount (decimal)`, `IsReconciled (bool)`.
  - `FuelCardTransaction`: `Id (Guid)`, `FuelCardInvoiceId (FK)`, `DriverId (FK)`, `VehicleId (FK, nullable)`, `CardNumber (string)`, `TransactionDate (DateTime)`, `Amount (decimal)`, `FuelType (enum: Diesel, ElectricKwh)`, `IsDiscountedFromPayroll (bool)`, `PayPeriodId (FK, nullable)`.
  - `CarrierReconciliationRecord`: `Id (Guid)`, `PayPeriodId (FK)`, `FranchiseId (FK)`, `Date (DateTime)`, `RouteCode (string)`, `DriverId (FK)`, `AgreedTotal (decimal)`, `FirstRunPaid (decimal)`, `SecRunPaid (decimal)`, `ExtraRunPaid (decimal)`, `TopUpPaid (decimal)`, `TotalReceivedFromCarrier (decimal)`, `Variance (decimal)`, `DisputeStatus (enum: Matched, Underpaid, Overpaid, Disputed, Settled)`.
- **Where to do:**
  - `backend/Models/PayPeriod.cs`
  - `backend/Models/DriverPayslip.cs`
  - `backend/Models/FuelCardInvoice.cs`
  - `backend/Models/FuelCardTransaction.cs`
  - `backend/Models/CarrierReconciliationRecord.cs`
- **Edge Cases:**
  - Payslip subtotal calculation must strictly follow UK accounting:
    $$\text{Gross} = \text{Deliveries} + \text{Extras}$$
    $$\text{Charges} = \text{AdminFee} + \text{VanRent} + \text{Fuel} + \text{Deposit} + \text{Advance} + \text{Fines}$$
    $$\text{ExVAT} = \text{Gross} - \text{Charges}$$
    $$\text{IncVAT} = \text{ExVAT} + (\text{ExVAT} \times 0.20 \text{ if VAT registered, else } 0)$$
  - Prevent payslips from running twice for the same driver in the same pay period.
- **Acceptance Criteria:**
  - [ ] Unique constraint on `(PayPeriodId, DriverId)` on `DriverPayslip`.
  - [ ] Variance in `CarrierReconciliationRecord` stored as signed decimal (`TotalReceived - AgreedTotal`).
- **Test Cases:**
  - Unit Test: Replicating `RONALDO` sheet math produces exact values (£2,647.84 gross, £158.87 admin fee, £2,488.97 ex VAT, £497.79 VAT @ 20%, £2,986.76 total).
- **Risks & Ripple Effects:**
  - This is the financial core that pays drivers. Formula errors cause labor disputes or tax non-compliance.

---

### User Story 1.7: EF Core Fluent API Configurations, Indexes & Foreign Keys
- **Story ID:** `S1-US7`
- **Goal:** Configure precision, constraints, relationships, indexes, and soft-delete behaviors in `ApplicationDbContext.cs`.
- **What to do:** Implement entity configuration mappings using `IEntityTypeConfiguration<T>` or inline fluent API.
- **How to do:**
  - Specify `decimal(18,2)` precision for all financial and currency fields.
  - Set cascade behaviors (`Restrict` for corporate entities, `SetNull` for optional linkers).
  - Add query performance indexes:
    - `Vehicle(Registration)`
    - `Franchise(FdCode)`
    - `DriverProfile(DrNumber)`
    - `RosterShift(Date, DriverId)`
    - `BankTransaction(BankAccountId, TransactionDate)`
    - `VehicleCompliance(MotDueDate, RoadTaxDueDate, InsuranceDueDate)`
- **Where to do:**
  - `backend/Data/ApplicationDbContext.cs`
  - `backend/Data/Configurations/`
- **Edge Cases:**
  - Ensure UTC timestamps for all `DateTime` columns (PostgreSQL `timestamp with time zone`).
- **Acceptance Criteria:**
  - [ ] `dotnet ef migrations add InitialLogisticsAndFinanceSchema` executes without errors.
  - [ ] Database schema snapshot contains all constraints, foreign keys, and indexes.
- **Test Cases:**
  - Integration Test: Run migration on a test PostgreSQL instance; confirm all 18 tables create cleanly.
- **Risks & Ripple Effects:**
  - Flawed decimal types (like float or double) cause IEEE-754 rounding drift on financial calculations.

---

### User Story 1.8: Repositories & Unit of Work Layer Implementation
- **Story ID:** `S1-US8`
- **Goal:** Implement data access repositories in strict alignment with Clean Architecture (`Controllers -> Services -> Repositories -> Data`).
- **What to do:** Create generic and specialized repository interfaces and classes, along with `IUnitOfWork`.
- **How to do:**
  - Interfaces in `backend/Repositories/Interfaces/`:
    - `IVehicleRepository`, `IDriverRepository`, `IShiftRepository`, `IFinanceRepository`, `IPayrollRepository`, `IFranchiseRepository`.
    - `IUnitOfWork` exposing all repositories and `SaveChangesAsync()`.
  - Implementations in `backend/Repositories/Implementations/`:
    - EF Core queries with `.AsNoTracking()` for read queries.
    - Transaction execution via `IDbContextTransaction`.
  - Register in `backend/Extensions/ServiceCollectionExtensions.cs`.
- **Where to do:**
  - `backend/Repositories/Interfaces/`
  - `backend/Repositories/Implementations/`
  - `backend/Extensions/ServiceCollectionExtensions.cs`
- **Edge Cases:**
  - Deadlocks during batch shift creation: execute within an explicit database transaction with retry logic.
- **Acceptance Criteria:**
  - [ ] All repositories injected via interfaces in ServiceCollectionExtensions.
  - [ ] Zero direct DbContext references in the controller or service layers.
- **Test Cases:**
  - Unit Test: Mocking `IUnitOfWork` verifies atomic commits.
- **Risks & Ripple Effects:**
  - All future services depend on these repositories. Contract instability slows down development.

---

### User Story 1.9: Real-World Data Seeding from Sample Spreadsheets
- **Story ID:** `S1-US9`
- **Goal:** Seed the database with the real entities extracted from the 3 sample Excel sheets.
- **What to do:** Update `DbInitializer.cs` to seed companies, carriers, franchises, vehicles, drivers, rate settings, and deposit ledgers.
- **How to do:**
  - Seed 3 Companies: `MS Herrig Ltd`, `TGB Services and Solutions Ltd`, `GoConnect Partnership`.
  - Seed 5 Carriers: `DPD`, `Amazon`, `DHL`, `DX`, `Parcel Force`.
  - Seed 14 DPD Franchises: `FD45028`, `FD49693`, `FD51406`, `FD52639`, `FD54328`, `FD54330`, `FD71764`, `FD72356`, `FD72458`, `FD74820`, `FD77686`, `FD77890`, `FD77891`, `FD78242`.
  - Seed 10 Fleet Vehicles: `KR23 XYZ` (with full MOT `2027-07-12`, Tax `2027-04-01`, Ins `2027-04-15`), `EF22 VVV`, `KN22 MMM`, `NX21 XXA`, `EA22 RRR`, `WX16 RRR`, `MA22 TTT`, `EO73 XYZ`, `DA20 XYZ`, `HX72 XYZ`.
  - Seed 15 Drivers: `Ronaldo`, `Reinaldo`, `Tulio`, `Octavio`, `Natalie`, `Thiago`, `Kauann`, `Henrry`, `Luciano`, `Jaderson`, `Emanuel`, `Daniel K`, `Lucas`, `Bruno`, `David` with their DR numbers, phone, van rent, and deposit balances.
- **Where to do:**
  - `backend/Data/DbInitializer.cs`
- **Edge Cases:**
  - Idempotent seeding: Must check `Any()` before inserting to avoid duplicate primary key collisions on server restart.
- **Acceptance Criteria:**
  - [ ] Application starts up, runs `DbInitializer.InitializeAsync()`, and populates the database with real-world data.
- **Test Cases:**
  - Integration Test: Querying `IVehicleRepository.GetByRegistrationAsync("KR23 XYZ")` returns populated compliance dates and specs.
- **Risks & Ripple Effects:**
  - Provides instant, realistic test data for frontend developers without needing mock stubs.

---

# Milestone 2: Operations, Dispatch Calendar & Fleet Compliance

## Sprint 2: Interactive Operations & Dispatch Calendar

---

### User Story 2.1: Shift & Roster Backend Services and Endpoints
- **Story ID:** `S2-US1`
- **Goal:** Implement the business logic for creating, updating, bulk-allocating, and querying 4-week roster matrices.
- **What to do:** Create `IDispatchService`, `DispatchService`, DTOs, and `DispatchController`.
- **How to do:**
  - Service methods:
    - `Get4WeekMatrixAsync(DateTime periodStart, Guid? companyId)`
    - `SaveShiftAllocationAsync(ShiftAllocationDto dto)`
    - `BulkSaveMatrixAsync(BulkMatrixDto dto)`
    - `GetUncoveredRoutesAsync(DateTime date)`
  - Controller endpoints:
    - `GET /api/dispatch/matrix?startDate={date}&companyId={id}`
    - `POST /api/dispatch/shift`
    - `PUT /api/dispatch/shift/{id}`
    - `POST /api/dispatch/bulk`
- **Where to do:**
  - `backend/Services/Interfaces/IDispatchService.cs`
  - `backend/Services/Implementations/DispatchService.cs`
  - `backend/DTOs/DispatchDtos.cs`
  - `backend/Controllers/DispatchController.cs`
- **Edge Cases:**
  - Daylight Saving Time changes (BST to GMT) occurring in October (period `12-10 TO 08-11`): Dates must be handled as pure calendar dates (`DateOnly` or UTC midnight) without hour shifts.
- **Acceptance Criteria:**
  - [ ] API returns full 28-day matrix matching columns B–AF of the sample sheet.
  - [ ] Updating a driver's route responds in $<150$ms.
- **Test Cases:**
  - Integration Test: Ingesting Monday week 1 data for 15 drivers creates 15 records and returns complete matrix.
- **Risks & Ripple Effects:**
  - Roster data flows directly into payroll calculation.

---

### User Story 2.2: Driver Absence & UK Bank Holiday Engine
- **Story ID:** `S2-US2`
- **Goal:** Manage driver leaves (Holiday, Sickness, OFF) and detect UK Bank Holidays (as seen in `July` sheet).
- **What to do:** Implement absence booking endpoints and an automated scheduling conflict detector.
- **How to do:**
  - Endpoints:
    - `POST /api/dispatch/absence`: Book holiday/sick leave.
    - `GET /api/dispatch/absences?month={mm}&year={yyyy}`: Absence list.
  - In `DispatchService.SaveShiftAllocationAsync`:
    - Before confirming an active shift, query `DriverAbsence` for overlapping dates.
    - If conflict found, reject or flag with status `ConflictWarning`.
  - Include UK Bank Holiday helper to flag bank holiday pay rates.
- **Where to do:**
  - `backend/Services/Implementations/DispatchService.cs`
  - `backend/Controllers/DispatchController.cs`
- **Edge Cases:**
  - Driver reports sickness on the current day when a shift is already marked `Scheduled`: Shift status must update to `CoveredByOther` and prompt route re-allocation.
- **Acceptance Criteria:**
  - [ ] Visual calendar highlights drivers on holiday in purple and sickness in red.
  - [ ] Overlapping shift allocation returns HTTP 409 Conflict with descriptive message.
- **Test Cases:**
  - Unit Test: Driver marked `Holiday` from 19-Jul to 01-Aug rejects shift allocation on 25-Jul.
- **Risks & Ripple Effects:**
  - Eliminates the manual double-entry between the `July` calendar and `12-10 TO 08-11` matrix.

---

### User Story 2.3: Interactive 4-Week Dispatch Matrix Frontend Component
- **Story ID:** `S2-US3`
- **Goal:** Build the web UI component that renders the full 4-week roster calendar matching the spreadsheet layout.
- **What to do:** Create `CalendarTab.tsx` with Day, Week, and 4-Week Matrix view modes.
- **How to do:**
  - Matrix layout:
    - Left column: Days of the week (Monday through Sunday).
    - Sub-columns for Weeks 1, 2, 3, and 4.
    - Cells display: Driver Name, Franchise FD badge, Route Code, Stop Multiplier, Area/Postcode, Extra £, and Comments.
  - Color-coded badges: Green (Active Route), Gray (OFF), Amber (Bulk/Special), Red (Unassigned Route).
  - Quick-filter by Company (MS Herrig Ltd, TGB Ltd, GoConnect) and Carrier (DPD, Amazon).
- **Where to do:**
  - `frontend/src/components/CalendarTab.tsx`
  - `frontend/src/services/api.ts`
  - `frontend/src/app/page.tsx`
- **Edge Cases:**
  - Rendering 28 days $\times$ 25 drivers (700 cells) must remain smooth at 60fps without lag. Use memoized cell components.
- **Acceptance Criteria:**
  - [ ] Renders all 4 weeks of the operational cycle.
  - [ ] Clicking any cell opens the quick-edit drawer.
- **Test Cases:**
  - E2E Test: Filter by "TGB Services" updates visible driver rows to Tulio's sub-fleet.
- **Risks & Ripple Effects:**
  - Core tool for daily dispatch operations.

---

### User Story 2.4: Drag-and-Drop Shift Allocations & Real-Time Conflict Detection
- **Story ID:** `S2-US4`
- **Goal:** Allow dispatchers to drag-and-drop drivers onto routes, reassign spare drivers, and view unassigned route alerts.
- **What to do:** Implement drag-and-drop interaction in `CalendarTab.tsx` and connect to backend APIs.
- **How to do:**
  - Drag driver card from "Available Drivers" tray onto a Route cell.
  - Immediate optimistic UI update with rollback if API returns an error or conflict warning modal.
  - Uncovered Route Banner: Sticky alert at the top showing: *"Route 593 (FD12354) unassigned for tomorrow!"*
- **Where to do:**
  - `frontend/src/components/CalendarTab.tsx`
- **Edge Cases:**
  - Network interruption during drag: display error toast and restore previous cell state.
- **Acceptance Criteria:**
  - [ ] Drag-and-drop successfully updates shift assignment.
  - [ ] If driver is on holiday, an alert modal asks for supervisor confirmation before overriding.
- **Test Cases:**
  - UI Test: Dragging "Ronaldo" to Route 305 updates database and recalculates daily projected earnings.
- **Risks & Ripple Effects:**
  - Prevents abandoned routes and DPD service level failure penalties.

---

## Sprint 3: Fleet Management, Document Vault & Proactive Compliance Watchdog

---

### User Story 3.1: Vehicle Registry & Telemetry Backend Services
- **Story ID:** `S3-US1`
- **Goal:** Implement vehicle asset management, maintenance logging, and driver custody tracking.
- **What to do:** Create `IFleetService`, `FleetService`, DTOs, and `VehiclesController`.
- **How to do:**
  - Methods:
    - `GetAllVehiclesAsync(VehicleFilterDto filter)`
    - `GetVehicleDetailsAsync(Guid id)` (includes compliance dates, loan status, service history, and driver logbook).
    - `AddServiceRecordAsync(Guid vehicleId, CreateServiceLogDto dto)`
    - `AssignDriverAsync(Guid vehicleId, AssignDriverDto dto)`
  - Endpoints:
    - `GET /api/vehicles`
    - `GET /api/vehicles/{id}`
    - `POST /api/vehicles`
    - `POST /api/vehicles/{id}/service-log`
    - `POST /api/vehicles/{id}/assign-driver`
- **Where to do:**
  - `backend/Services/Interfaces/IFleetService.cs`
  - `backend/Services/Implementations/FleetService.cs`
  - `backend/DTOs/FleetDtos.cs`
  - `backend/Controllers/VehiclesController.cs`
- **Edge Cases:**
  - Updating vehicle mileage to a value lower than the last recorded service mileage must be rejected.
- **Acceptance Criteria:**
  - [ ] Returns vehicle telemetry matching `KR23XYZ` sheet (Total maintenance cost £7,202.08, loan balance £19,184.90).
- **Test Cases:**
  - Integration Test: Adding a service record increases `TotalSpent` and appends to service history.
- **Risks & Ripple Effects:**
  - Service records can be linked to bank outflows in Sprint 4.

---

### User Story 3.2: Digital Document Vault & Receipt Upload System
- **Story ID:** `S3-US2`
- **Goal:** Secure document storage for vehicle MOT Certificates, Insurance Policies, V5C Logbooks, and Lease Contracts.
- **What to do:** Implement file upload service with metadata indexing and document retrieval endpoints.
- **How to do:**
  - Endpoint: `POST /api/vehicles/{id}/documents` (multipart/form-data).
  - Save file to secure storage (local persistent directory or cloud bucket), validate MIME type (PDF, PNG, JPEG), limit size (15MB).
  - Store record in `VehicleDocument` with expiration date.
- **Where to do:**
  - `backend/Services/Implementations/DocumentStorageService.cs`
  - `backend/Controllers/VehiclesController.cs`
- **Edge Cases:**
  - Disallow executable file extensions (.exe, .sh, .bat).
- **Acceptance Criteria:**
  - [ ] Uploaded document is downloadable via authenticated endpoint.
  - [ ] Document list displays document type, upload timestamp, and expiration status.
- **Test Cases:**
  - Integration Test: Upload valid PDF MOT cert; confirm metadata saved and file accessible.
- **Risks & Ripple Effects:**
  - Satisfies client's explicit request: *"IN EACH VAN I WOULD LIKE TO ADD ANY DOCUMENTATION SUCH AS INSURANCE CERTIFICATE, MOT CERTIFICATE, V5, LEASING CONTRACTS"*.

---

### User Story 3.3: Background Compliance Watchdog (`IHostedService`) & Alert Engine
- **Story ID:** `S3-US3`
- **Goal:** Automate proactive notifications for upcoming or overdue MOT, Road Tax, Insurance, and Service intervals.
- **What to do:** Create an ASP.NET Core `BackgroundService` that scans vehicle compliance daily and generates notifications.
- **How to do:**
  - Implement `ComplianceWatchdogBackgroundService : BackgroundService`.
  - Cron trigger: Runs every 24 hours at 00:00 UTC.
  - Audit checks:
    - MOT Due Date $\le 30$ days, $\le 14$ days, $\le 7$ days, or Overdue.
    - Road Tax Due Date $\le 30$ days, $\le 7$ days, or Overdue.
    - Insurance Expiry $\le 30$ days, $\le 14$ days, $\le 7$ days, or Expired.
    - Mileage $\ge$ `NextServiceMileageThreshold - 1000` miles.
  - Generate records in `Notification` table and broadcast via SignalR or WebSocket hub to active web clients.
- **Where to do:**
  - `backend/BackgroundServices/ComplianceWatchdogBackgroundService.cs`
  - `backend/Services/Interfaces/INotificationService.cs`
  - `backend/Controllers/NotificationsController.cs`
- **Edge Cases:**
  - Avoid spamming: Only send one alert per threshold state per vehicle (e.g. alert once at 30 days, once at 14 days, once at 7 days).
- **Acceptance Criteria:**
  - [ ] Vehicles with MOT due within 30 days appear in the active notifications tray.
  - [ ] Overdue items display persistent red badge in the UI header.
- **Test Cases:**
  - Unit Test: Vehicle with MOT due in 10 days triggers the "14-day alert" condition.
- **Risks & Ripple Effects:**
  - Direct protection against vehicle impounding, police fines, and insurance invalidation.

---

### User Story 3.4: Frontend Vehicle Management & Telemetry UI (KR23XYZ Model)
- **Story ID:** `S3-US4`
- **Goal:** Build the fleet dashboard and dedicated van detail screen.
- **What to do:** Create `FleetTab.tsx` and `VehicleDetailModal.tsx`.
- **How to do:**
  - Fleet Overview: Cards displaying Reg, Model, Driver, Status, MOT Due (countdown pill: e.g. "MOT in 12 days"), and Fuel Type badge.
  - Detail Profile (replicating `KR23XYZ` sheet):
    - Top Stats: Price (£24,600), Monthly (£456.80), Remaining (£19,184.90), Total Spent on Repairs (£7,202.08).
    - Compliance Alerts Panel: MOT, Road Tax, Insurance, Service.
    - Tabs: Maintenance History, Document Vault (with upload dropzone), Driver Chain-of-Custody logbook.
- **Where to do:**
  - `frontend/src/components/FleetTab.tsx`
  - `frontend/src/components/VehicleDetailModal.tsx`
  - `frontend/src/app/page.tsx`
- **Edge Cases:**
  - Display fallback UI when a van is currently unassigned to any driver.
- **Acceptance Criteria:**
  - [ ] Full fleet renders with immediate visual compliance status (Green, Amber, Red).
  - [ ] User can add a maintenance log entry and attach an invoice in under 30 seconds.
- **Test Cases:**
  - UI Test: Clicking on `KR23 XYZ` opens modal showing Admiral Insurance details and maintenance history.
- **Risks & Ripple Effects:**
  - Delivers on client's core vehicle management requirement.

---

# Milestone 3: Financial Hub, Expense Auto-Linker & UK VAT Engine

## Sprint 4: Multi-Company Banking Ledger & Smart Expense Auto-Linker

---

### User Story 4.1: Multi-Company Bank Account & Inflow/Outflow Ledger
- **Story ID:** `S4-US1`
- **Goal:** Implement multi-entity cash flow and banking transaction tracking across MS Herrig Ltd, TGB Services Ltd, and GoConnect.
- **What to do:** Create `IFinanceService`, `FinanceService`, DTOs, and `FinanceController`.
- **How to do:**
  - Endpoints:
    - `GET /api/finance/accounts?companyId={id}`: Balance, Total In, Total Out.
    - `GET /api/finance/transactions?accountId={id}&month={m}&year={y}`: Transaction ledger.
    - `POST /api/finance/transactions`: Record new income or expense.
    - `PUT /api/finance/transactions/{id}/confirm`: Mark transaction confirmed.
- **Where to do:**
  - `backend/Services/Interfaces/IFinanceService.cs`
  - `backend/Services/Implementations/FinanceService.cs`
  - `backend/DTOs/FinanceDtos.cs`
  - `backend/Controllers/FinanceController.cs`
- **Edge Cases:**
  - Negative transaction amounts: Enforce positive numbers with explicit `Type` (`Inflow` or `Outflow`).
- **Acceptance Criteria:**
  - [ ] Bank account summary automatically calculates `CurrentBalance = InitialBalance + TotalIn - TotalOut`.
- **Test Cases:**
  - Integration Test: Ingesting September transactions from `SETEMBRO-26` yields exact income of £65,880.38 and net profit of £15,465.48.
- **Risks & Ripple Effects:**
  - Inaccurate balances distort cash flow projections.

---

### User Story 4.2: Director Drawings & Intercompany Transfer Tracker
- **Story ID:** `S4-US2`
- **Goal:** Track partner salary targets (£5,000 Reinaldo, £5,000 Tulio) and intercompany fund transfers (matching `NOVEMBER-26 (2)` sheet).
- **What to do:** Implement partner drawing tracking and intercompany transfer logic.
- **How to do:**
  - In `FinanceService`:
    - Track monthly withdrawals under category `PersonalDrawing` filtered by partner name.
    - Compare actual withdrawals against target (£5,000), calculating the `Difference` (shortfall or excess).
    - Transfers between corporate entities (e.g. MS Herrig to GoConnect) create an Outflow in Account A and an Inflow in Account B within a single transaction.
- **Where to do:**
  - `backend/Services/Implementations/FinanceService.cs`
  - `backend/Controllers/FinanceController.cs`
- **Edge Cases:**
  - Intercompany transfer failure on second leg must roll back first leg atomically.
- **Acceptance Criteria:**
  - [ ] Partner drawing progress bar renders in financial dashboard.
  - [ ] Transfers between accounts do not artificially inflate company revenue metrics.
- **Test Cases:**
  - Unit Test: Transfer of £1,000 from MS Herrig to TGB reflects cleanly on both balances.
- **Risks & Ripple Effects:**
  - Keeps corporate finances clean and audit-ready for year-end tax returns.

---

### User Story 4.3: Relational Smart Expense Auto-Linker (Vehicle Log & Driver Advance)
- **Story ID:** `S4-US3`
- **Goal:** Fulfill the client's explicit instruction: *"WHEN ADDING SPENDING ON THE BANK ACCOUNTS TRANSACTIONS TO BE LINKED TO THE CATEGORY OR IF ITS FOR A VAN TO BE LINKED IN ITS LOG TAB"*.
- **What to do:** Build the automated relational router in `FinanceService.CreateTransactionAsync`.
- **How to do:**
  - When saving a `BankTransaction`:
    - If `Category == VehicleMaintenance`: Validate `LinkedVehicleId`. Automatically create a line item in `VehicleServiceLog` with `Date`, `TotalCost`, `SupplierOrGarage = PayeeDestination`, and `BankTransactionId`.
    - If `Category == DriverAdvance`: Validate `LinkedDriverId`. Automatically record a pending deduction for that driver for the current/upcoming pay period.
    - If `Category == FuelDiesel` or `FuelElectric` and `LinkedVehicleId` is provided: Record fuel expense under vehicle operational costs.
- **Where to do:**
  - `backend/Services/Implementations/FinanceService.cs`
- **Edge Cases:**
  - If the user deletes or edits a bank transaction, the linked vehicle service log or driver advance deduction must be updated or deleted synchronously.
- **Acceptance Criteria:**
  - [ ] Entering an expense for "EURO CAR PARTS £151.18" linked to van `KR23 XYZ` instantly shows up in `KR23 XYZ`'s service history table without manual re-entry.
- **Test Cases:**
  - Integration Test: Record £464.40 clutch repair in bank account; check vehicle maintenance log confirms new record created.
- **Risks & Ripple Effects:**
  - Eliminates the primary double-entry headache reported by the client.

---

### User Story 4.4: Frontend Multi-Company Financial Hub UI
- **Story ID:** `S4-US4`
- **Goal:** Replace `SETEMBRO-26` and `NOVEMBER-26 (2)` sheets with an interactive financial management dashboard.
- **What to do:** Build `FinanceTab.tsx` with company switcher, P&L breakdown, and smart transaction modal.
- **How to do:**
  - Company Switcher Tabs: `MS Herrig Ltd` | `TGB Services Ltd` | `GoConnect` | `Consolidated`.
  - P&L Summary Cards: Total Income, Drivers Payment, Net Operating Expenses, Net Profit (`Lucro Total`), and Cash Balance.
  - Transaction Entry Drawer:
    - Amount, Date, Payee, Category dropdown.
    - Conditional dropdowns: Selecting "Vehicle Maintenance" displays "Select Van" searchable select; selecting "Driver Advance" displays "Select Driver".
    - Receipt upload field (drag-and-drop).
- **Where to do:**
  - `frontend/src/components/FinanceTab.tsx`
  - `frontend/src/app/page.tsx`
- **Edge Cases:**
  - Responsive layout for iPad / tablet viewing during depot visits.
- **Acceptance Criteria:**
  - [ ] Real-time updates to P&L upon transaction creation.
  - [ ] Direct clickable link from bank transaction to vehicle profile.
- **Test Cases:**
  - UI Test: Filter by "MS Herrig Ltd" displays correct NatWest account charges and DPD deposits.
- **Risks & Ripple Effects:**
  - Core visibility tool for the business owners.

---

## Sprint 5: Quarterly UK VAT Engine & Fuel Card Reconciliation

---

### User Story 5.1: HMRC MTD-Ready UK Quarterly VAT Calculator
- **Story ID:** `S5-US1`
- **Goal:** Automate quarterly UK VAT calculations (matching the `01-07-26 TO 30-09-26` VAT sheet) with receipt audit attachments.
- **What to do:** Implement `IVatService`, `VatService`, and `VatController`.
- **How to do:**
  - Calculate quarterly output VAT collected from carrier billings (20%).
  - Calculate quarterly input VAT paid on fuel, parts, vehicle leases, and accountant fees.
  - Calculate $\text{Net VAT Due} = \text{Output VAT} - \text{Input VAT}$.
  - Reconcile with HMRC payments and track difference.
  - Endpoints:
    - `GET /api/vat/quarter?companyId={id}&quarter={q}&year={y}`
    - `POST /api/vat/quarter/submit`
    - `GET /api/vat/receipts-audit?quarterId={id}`: Export full tax audit trail with receipt URLs.
- **Where to do:**
  - `backend/Services/Interfaces/IVatService.cs`
  - `backend/Services/Implementations/VatService.cs`
  - `backend/Controllers/VatController.cs`
- **Edge Cases:**
  - Items exempt or zero-rated from UK VAT (e.g. bank charges, road tax) must not have VAT applied.
- **Acceptance Criteria:**
  - [ ] Q3 calculation matches sheet `01-07-26 TO 30-09-26`: Total Received £22,626.98, Total Paid £19,510.48, Net Due £3,116.50.
- **Test Cases:**
  - Unit Test: Run VAT calculation for July–September sample data; verify exact match with spreadsheet.
- **Risks & Ripple Effects:**
  - Eliminates manual spreadsheet calculation errors and ensures compliance with HMRC Making Tax Digital (MTD).

---

### User Story 5.2: Fuel Card Split & Reconciliation Engine (Shell/BP Invoice Ingestion)
- **Story ID:** `S5-US2`
- **Goal:** Ingest monthly fuel card invoices (e.g. Shell card invoice £2,305.85 in `30-09-26`), split line items by driver card, and queue payroll deductions.
- **What to do:** Implement `IFuelReconciliationService` and CSV/Excel import endpoints.
- **How to do:**
  - Parse supplier invoice file (date, card number, driver name, gross amount, litres).
  - Match card number to driver registered fuel cards.
  - Auto-generate fuel deduction queue for upcoming pay run.
  - Endpoint: `POST /api/fuel/upload-invoice` (multipart).
- **Where to do:**
  - `backend/Services/Interfaces/IFuelReconciliationService.cs`
  - `backend/Services/Implementations/FuelReconciliationService.cs`
  - `backend/Controllers/FuelController.cs`
- **Edge Cases:**
  - Fuel card transaction for a driver who left the company: Flag as "Unassigned - Manual Review Required".
- **Acceptance Criteria:**
  - [ ] Ingesting Shell invoice accurately distributes £2,305.85 across Daniel, Ronaldo, and Octavio.
  - [ ] Flags fuel transactions as `Discounted = true` once pay run is finalized.
- **Test Cases:**
  - Integration Test: Upload Shell invoice; verify Ronaldo's fuel deduction is queued for £336.34.
- **Risks & Ripple Effects:**
  - Stops fuel card theft and unrecovered company expenses.

---

### User Story 5.3: Frontend VAT Return & Fuel Reconciliation UI
- **Story ID:** `S5-US3`
- **Goal:** Build the UI for viewing quarterly VAT calculations and reconciling fuel cards.
- **What to do:** Create `VatTab.tsx` and fuel reconciliation sub-tab.
- **How to do:**
  - 3-Month side-by-side VAT comparison table (Jul, Aug, Sep) with Net Due summary cards.
  - "Attach Missing Receipts" gallery for audit compliance.
  - Fuel Invoice Upload & Matching table with "Apply to Payroll" confirmation button.
- **Where to do:**
  - `frontend/src/components/VatTab.tsx`
  - `frontend/src/app/page.tsx`
- **Edge Cases:**
  - Warning modal if user attempts to submit VAT return with unverified receipt transactions.
- **Acceptance Criteria:**
  - [ ] User can export an HMRC-ready PDF/CSV summary report.
- **Test Cases:**
  - UI Test: Toggle between Q2 and Q3 renders corresponding figures and receipts.
- **Risks & Ripple Effects:**
  - Prepares the business for official HMRC tax filings.

---

# Milestone 4: Driver Payroll, Carrier Auditing & Mobile Driver App

## Sprint 6: Automated Driver Payroll & PDF Remittance Advice

---

### User Story 6.1: One-Click 4-Week / Weekly / Monthly Pay Run Engine
- **Story ID:** `S6-US1`
- **Goal:** Automate end-to-end driver payroll calculations across all compensation models (matching `RONALDO` sheet logic).
- **What to do:** Implement `IPayrollService`, `PayrollService`, DTOs, and `PayrollController`.
- **How to do:**
  - For a selected `PayPeriod`:
    1. Query all completed `RosterShift` records for each driver.
    2. Compute Gross Deliveries: $\sum(\text{Stops} \times \text{StopRate}) \text{ or } \sum(\text{DayRate})$.
    3. Apply 6% Admin Fee commission: $\text{Gross} \times 0.06$.
    4. Fetch van rent (if `SuppliesOwnVan == false`).
    5. Fetch unbilled fuel card transactions.
    6. Fetch van deposit installment (£200 if balance $<$ £1,000).
    7. Fetch mid-period cash advances (`Category == DriverAdvance`).
    8. Compute Net ex VAT, VAT @ 20% (if applicable), and Total Net Payout.
- **Where to do:**
  - `backend/Services/Interfaces/IPayrollService.cs`
  - `backend/Services/Implementations/PayrollService.cs`
  - `backend/DTOs/PayrollDtos.cs`
  - `backend/Controllers/PayrollController.cs`
- **Edge Cases:**
  - Negative net pay (if deductions exceed gross): Flag payslip for administrative review and block automatic payment approval.
- **Acceptance Criteria:**
  - [ ] One-click run calculates payroll for 20+ drivers in $<2$ seconds.
  - [ ] Produces exact match for Ronaldo: Gross £2,647.84, Admin fee £158.87, Total Inc VAT £2,986.76.
- **Test Cases:**
  - Unit Test: Complete test suite verifying gross-to-net math across all driver rate types.
- **Risks & Ripple Effects:**
  - Replaces days of manual calculation every 4 weeks.

---

### User Story 6.2: PDF Remittance Advice Generator (Matching `RONALDO` Sheet)
- **Story ID:** `S6-US2`
- **Goal:** Generate branded, professional PDF remittance advice documents for drivers matching the layout of the `RONALDO` spreadsheet.
- **What to do:** Implement PDF document generation service (using QuestPDF or Puppeteer).
- **How to do:**
  - Header: Company Logo (MS Herrig Ltd / TGB Ltd), Driver Name, DR Number, FD Franchise, Van Reg, Bank Sort/Acc, Period Dates.
  - Table 1: Daily delivery breakdown (Date, Route, Stops, Amount).
  - Table 2: Itemized deductions (Admin fee 6%, Fuel, Van rent, Deposit, Cash advances).
  - Summary Box: Gross Total, Total Charges, Net Ex VAT, VAT @ 20%, Total Net Payable, Payment Date.
  - Endpoint: `GET /api/payroll/payslips/{id}/pdf`.
- **Where to do:**
  - `backend/Services/Implementations/PdfGeneratorService.cs`
  - `backend/Controllers/PayrollController.cs`
- **Edge Cases:**
  - Proper font rendering and formatting of the British Pound (£) symbol.
- **Acceptance Criteria:**
  - [ ] Generated PDF downloads cleanly and mirrors the spreadsheet visual layout.
- **Test Cases:**
  - Integration Test: Generate PDF for Ronaldo sample payslip; verify file size $>0$ and valid PDF structure.
- **Risks & Ripple Effects:**
  - Directly shared with drivers; must be 100% professional and accurate.

---

### User Story 6.3: Frontend Payroll Manager & Pay Run Dashboard
- **Story ID:** `S6-US3`
- **Goal:** Build the payroll dashboard to review, approve, edit, and export driver pay runs.
- **What to do:** Create `PayrollTab.tsx` and `PayslipDetailModal.tsx`.
- **How to do:**
  - Pay Run Summary: Total Paid to Drivers (£38,671.84), Total Admin Fees Collected, Total Van Rent Deducted.
  - Driver Table: Driver Name, Days Worked, Stops, Gross, Deductions, Net Payout, Status (Draft, Approved, Paid), and PDF Download icon.
  - "Run Payroll" trigger button with confirmation preview modal.
- **Where to do:**
  - `frontend/src/components/PayrollTab.tsx`
  - `frontend/src/components/PayslipDetailModal.tsx`
  - `frontend/src/app/page.tsx`
- **Edge Cases:**
  - Lock editing once a pay run is marked "Paid" to preserve accounting integrity.
- **Acceptance Criteria:**
  - [ ] User can inspect individual payslip breakdowns and override ad-hoc bonuses before finalizing.
- **Test Cases:**
  - UI Test: Finalizing a pay run transitions all driver payslips to "Approved".
- **Risks & Ripple Effects:**
  - Core operational output for driver compensation.

---

## Sprint 7: DPD Carrier Billing Reconciliation & Discrepancy Auditing

---

### User Story 7.1: DPD Self-Billing CSV Parser & Reconciler
- **Story ID:** `S7-US1`
- **Goal:** Ingest DPD payment remittance files and reconcile DPD payments against internal agreed rates.
- **What to do:** Create `ICarrierAuditService`, `CarrierAuditService`, and parser.
- **How to do:**
  - Parse carrier files containing Franchise FD, Date, Route, First Run, Second Run, Extra Run, and Top Up.
  - Compare line-by-line against internal `RosterShift` agreed day rates.
  - Calculate `DiscrepancyAmount = TotalPaidByDpd - AgreedTotal`.
  - Endpoint: `POST /api/carrier-audit/dpd-upload` (multipart CSV).
- **Where to do:**
  - `backend/Services/Interfaces/ICarrierAuditService.cs`
  - `backend/Services/Implementations/CarrierAuditService.cs`
  - `backend/Controllers/CarrierAuditController.cs`
- **Edge Cases:**
  - Handle variations in DPD route code formatting (e.g. leading zeros like `0593` vs `593`).
- **Acceptance Criteria:**
  - [ ] Accurately detects underpayments like row 6 in `RONALDO` sheet (-£57.42).
- **Test Cases:**
  - Integration Test: Upload sample DPD reconciliation data; verify discrepancy is flagged.
- **Risks & Ripple Effects:**
  - Recovers lost revenue that would otherwise go unnoticed in manual spreadsheets.

---

### User Story 7.2: Discrepancy Detection & Underpayment Dispute Generator
- **Story ID:** `S7-US2`
- **Goal:** Group underpaid routes and generate formal dispute claim summaries for DPD depot managers.
- **What to do:** Implement dispute export functionality.
- **How to do:**
  - Query all `CarrierReconciliationRecord` where `DiscrepancyAmount < 0`.
  - Group by Depot / Franchise FD and generate an itemized dispute schedule showing Date, Route, Driver, Agreed Rate, Amount Received, and Shortfall.
  - Endpoint: `GET /api/carrier-audit/disputes/export?periodId={id}`.
- **Where to do:**
  - `backend/Services/Implementations/CarrierAuditService.cs`
  - `backend/Controllers/CarrierAuditController.cs`
- **Edge Cases:**
  - Prevent disputing routes where the variance was already agreed in writing.
- **Acceptance Criteria:**
  - [ ] Generates an exportable PDF/Excel dispute document ready to email to DPD.
- **Test Cases:**
  - Unit Test: Aggregating 3 underpaid shifts generates a dispute document with correct sum.
- **Risks & Ripple Effects:**
  - Direct bottom-line margin expansion for the business.

---

### User Story 7.3: Frontend Carrier Audit Dashboard
- **Story ID:** `S7-US3`
- **Goal:** Build the web interface for carrier file uploads and audit reconciliation.
- **What to do:** Create `CarrierAuditTab.tsx`.
- **How to do:**
  - Drag-and-drop CSV upload for DPD / Amazon remittances.
  - Discrepancy Alert Board: Red banner highlighting total underpaid amount.
  - Side-by-side reconciliation table: Agreed Price vs Carrier Remittance with variance highlight.
  - One-click "Export DPD Dispute Letter" button.
- **Where to do:**
  - `frontend/src/components/CarrierAuditTab.tsx`
  - `frontend/src/app/page.tsx`
- **Edge Cases:**
  - Visual indicators for resolved vs pending dispute items.
- **Acceptance Criteria:**
  - [ ] Displays side-by-side match rates ($98.5\%$ matched, $1.5\%$ disputed).
- **Test Cases:**
  - UI Test: Uploading a file updates the discrepancy list immediately.
- **Risks & Ripple Effects:**
  - Replaces manual line-by-line Excel cross-checking.

---

## Sprint 8: Mobile Driver Companion App (React Native / Expo)

---

### User Story 8.1: Driver Mobile Authentication & Active Assignment Dashboard
- **Story ID:** `S8-US1`
- **Goal:** Provide drivers with a native mobile dashboard showing their assigned route, depot, and van for today.
- **What to do:** Build mobile authentication flow and home screen.
- **How to do:**
  - Connect to backend JWT authentication (`POST /api/auth/login`).
  - Home screen displays:
    - Today's Date & Route Number (e.g. `Route 593 - BN 1 BULK`).
    - Franchise Depot (`FD12354`).
    - Assigned Van (`KR23 XYZ - Mercedes Sprinter`).
    - Dispatch Supervisor emergency contact button.
- **Where to do:**
  - `mobile/src/screens/HomeScreen.tsx`
  - `mobile/src/services/api.ts`
- **Edge Cases:**
  - Driver has no shift assigned today: display "No Active Assignment - Contact Dispatch" state.
- **Acceptance Criteria:**
  - [ ] Driver logs in and immediately sees current shift and vehicle assignment.
- **Test Cases:**
  - Mobile Unit Test: Authenticated driver query returns assigned route for the day.
- **Risks & Ripple Effects:**
  - Cuts morning depot confusion and phone calls to dispatchers.

---

### User Story 8.2: Mobile Shift Calendar & Absence/Holiday Submission
- **Story ID:** `S8-US2`
- **Goal:** Allow drivers to view their upcoming 4-week roster and request holidays or report sickness.
- **What to do:** Create `ShiftsScreen.tsx` and absence request modal.
- **How to do:**
  - Monthly calendar view showing scheduled days and OFF days.
  - "Request Leave" button: Pick date range, select reason (Holiday, Sickness, Emergency), submit to dispatch.
  - Notifies dispatcher in real-time.
- **Where to do:**
  - `mobile/src/screens/ShiftsScreen.tsx`
  - `mobile/src/services/api.ts`
- **Edge Cases:**
  - Sickness reported less than 2 hours before depot start time: triggers high-priority dispatcher SMS/push notification.
- **Acceptance Criteria:**
  - [ ] Submitted request appears in the web dispatcher's calendar approval queue.
- **Test Cases:**
  - Mobile UI Test: Driver requests holiday for next month; status displays "Pending Approval".
- **Risks & Ripple Effects:**
  - Replaces messy WhatsApp absence messages with a structured database record.

---

### User Story 8.3: Mobile Digital Payslip & Deduction Breakdown
- **Story ID:** `S8-US3`
- **Goal:** Provide transparent, itemized mobile payslips to eliminate driver payment disputes.
- **What to do:** Create `PayslipsScreen.tsx` and detail sheet.
- **How to do:**
  - List of past 4-week and monthly pay runs.
  - Detail View:
    - Deliveries Earnings (Stops completed $\times$ rate).
    - Itemized Deductions (Fuel card, Van rental, Deposit installment, Cash advances).
    - Net Payment received and payment date.
    - "Download Official PDF" button.
- **Where to do:**
  - `mobile/src/screens/PayslipsScreen.tsx`
  - `mobile/src/services/api.ts`
- **Edge Cases:**
  - Offline access: Cache last 3 payslips locally on device using AsyncStorage / secure store.
- **Acceptance Criteria:**
  - [ ] Driver can view the exact math behind their net pay on their smartphone.
- **Test Cases:**
  - Mobile UI Test: Ronaldo views his £2,986.76 payslip with 6% admin fee clearly displayed.
- **Risks & Ripple Effects:**
  - Dramatically improves subcontractor trust and driver retention.

---

# Mandatory Execution Protocol: The Post-Story Audit & Dry Run

Every developer or agent working in this codebase **MUST** follow this verification loop at the end of every story:

```
          ┌─────────────────────────────────────────────────────────┐
          │               USER STORY IMPLEMENTED                    │
          └──────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
          ┌─────────────────────────────────────────────────────────┐
          │ 1. LINE-BY-LINE CODE DRY RUN                            │
          │    - Trace variable flow, null-checks, boundary limits  │
          │    - Verify async/await & database transaction safety   │
          └──────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
          ┌─────────────────────────────────────────────────────────┐
          │ 2. FUNCTION CONTRACT & ARCHITECTURE CHECK               │
          │    - Controllers only handle HTTP; Services do logic    │
          │    - Repositories handle data access via IUnitOfWork    │
          └──────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
          ┌─────────────────────────────────────────────────────────┐
          │ 3. RIPPLE EFFECT & CROSS-MODULE AUDIT                   │
          │    - Does this change break shifts, payroll, or VAT?    │
          │    - Are database foreign keys and indexes maintained?  │
          └──────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
          ┌─────────────────────────────────────────────────────────┐
          │ 4. RUN AUTOMATED TESTS & VERIFY ZERO REGRESSIONS        │
          │    - dotnet test / npm run lint                         │
          │    - Verify clean build with 0 compiler warnings        │
          └─────────────────────────────────────────────────────────┘
```

This protocol ensures zero regressions, clean architecture compliance, and production-grade stability across the entire full-stack platform.
