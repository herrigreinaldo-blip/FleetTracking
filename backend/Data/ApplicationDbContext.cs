using DeliveryFinance.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFinance.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Story 1.1: Multi-Entity, Carrier & Franchise
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Carrier> Carriers => Set<Carrier>();
    public DbSet<Franchise> Franchises => Set<Franchise>();

    // Story 1.2: Driver Profile & Van Security Deposit
    public DbSet<DriverProfile> DriverProfiles => Set<DriverProfile>();
    public DbSet<DriverDeposit> DriverDeposits => Set<DriverDeposit>();
    public DbSet<DriverDepositTransaction> DriverDepositTransactions => Set<DriverDepositTransaction>();

    // Story 1.3: Vehicle Fleet, Compliance & Documents
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<VehicleCompliance> VehicleCompliances => Set<VehicleCompliance>();
    public DbSet<VehicleServiceLog> VehicleServiceLogs => Set<VehicleServiceLog>();
    public DbSet<VehicleDocument> VehicleDocuments => Set<VehicleDocument>();
    public DbSet<VehicleAssignment> VehicleAssignments => Set<VehicleAssignment>();

    // Story 1.4: Dispatch Roster & Absence Management
    public DbSet<RouteDefinition> RouteDefinitions => Set<RouteDefinition>();
    public DbSet<RosterShift> RosterShifts => Set<RosterShift>();
    public DbSet<DriverAbsence> DriverAbsences => Set<DriverAbsence>();

    // Story 1.5: Banking, Smart Expense Router & UK VAT
    public DbSet<BankAccount> BankAccounts => Set<BankAccount>();
    public DbSet<BankTransaction> BankTransactions => Set<BankTransaction>();
    public DbSet<VatReturnQuarter> VatReturnQuarters => Set<VatReturnQuarter>();

    // Story 1.6: Carrier Audit & Payroll Remittances
    public DbSet<PayPeriod> PayPeriods => Set<PayPeriod>();
    public DbSet<DriverPayslip> DriverPayslips => Set<DriverPayslip>();
    public DbSet<FuelCardInvoice> FuelCardInvoices => Set<FuelCardInvoice>();
    public DbSet<FuelCardTransaction> FuelCardTransactions => Set<FuelCardTransaction>();
    public DbSet<CarrierReconciliationRecord> CarrierReconciliationRecords => Set<CarrierReconciliationRecord>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Customize Identity ApplicationUser
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(u => u.FirstName).HasMaxLength(100);
            entity.Property(u => u.LastName).HasMaxLength(100);
        });

        // Story 1.1: Company, Carrier, Franchise
        builder.Entity<Company>(entity =>
        {
            entity.Property(c => c.Name).HasMaxLength(150).IsRequired();
            entity.Property(c => c.CompanyNumber).HasMaxLength(50);
            entity.Property(c => c.VatNumber).HasMaxLength(50);
            entity.Property(c => c.DefaultDirectorSalaryTarget).HasPrecision(18, 2);

            entity.HasMany(c => c.Franchises)
                  .WithOne(f => f.Company)
                  .HasForeignKey(f => f.CompanyId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(c => c.Vehicles)
                  .WithOne(v => v.Company)
                  .HasForeignKey(v => v.CompanyId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Carrier>(entity =>
        {
            entity.Property(c => c.Name).HasMaxLength(100).IsRequired();

            entity.HasMany(c => c.Franchises)
                  .WithOne(f => f.Carrier)
                  .HasForeignKey(f => f.CarrierId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(c => c.Routes)
                  .WithOne(r => r.Carrier)
                  .HasForeignKey(r => r.CarrierId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Franchise>(entity =>
        {
            entity.HasIndex(f => f.FdCode).IsUnique();
            entity.Property(f => f.FdCode).HasMaxLength(50).IsRequired();
            entity.Property(f => f.DepotName).HasMaxLength(150).IsRequired();

            entity.HasMany(f => f.RosterShifts)
                  .WithOne(s => s.Franchise)
                  .HasForeignKey(s => s.FranchiseId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Story 1.2: Driver Profile & Deposit
        builder.Entity<DriverProfile>(entity =>
        {
            entity.HasIndex(d => d.DrNumber).IsUnique();
            entity.Property(d => d.DrNumber).HasMaxLength(50).IsRequired();
            entity.Property(d => d.FullName).HasMaxLength(150).IsRequired();
            entity.Property(d => d.DefaultDayRate).HasPrecision(18, 2);
            entity.Property(d => d.DefaultStopRate).HasPrecision(18, 2);
            entity.Property(d => d.AdminFeePercentage).HasPrecision(18, 2);
            entity.Property(d => d.PeriodicVanRent).HasPrecision(18, 2);

            entity.HasOne(d => d.User)
                  .WithMany()
                  .HasForeignKey(d => d.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Deposit)
                  .WithOne(dep => dep.Driver)
                  .HasForeignKey<DriverDeposit>(dep => dep.DriverId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(d => d.RosterShifts)
                  .WithOne(s => s.Driver)
                  .HasForeignKey(s => s.DriverId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(d => d.VehicleAssignments)
                  .WithOne(a => a.Driver)
                  .HasForeignKey(a => a.DriverId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(d => d.Absences)
                  .WithOne(a => a.Driver)
                  .HasForeignKey(a => a.DriverId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<DriverDeposit>(entity =>
        {
            entity.Property(d => d.TargetDeposit).HasPrecision(18, 2);
            entity.Property(d => d.CurrentBalance).HasPrecision(18, 2);
            entity.Property(d => d.InstallmentAmount).HasPrecision(18, 2);

            entity.HasMany(d => d.Transactions)
                  .WithOne(t => t.DriverDeposit)
                  .HasForeignKey(t => t.DriverDepositId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<DriverDepositTransaction>(entity =>
        {
            entity.Property(t => t.Amount).HasPrecision(18, 2);
            entity.Property(t => t.Notes).HasMaxLength(255);
        });

        // Story 1.3: Vehicle Fleet, Compliance & Documents
        builder.Entity<Vehicle>(entity =>
        {
            entity.HasIndex(v => v.Registration).IsUnique();
            entity.Property(v => v.Registration).HasMaxLength(20).IsRequired();
            entity.Property(v => v.Make).HasMaxLength(50).IsRequired();
            entity.Property(v => v.Model).HasMaxLength(50).IsRequired();
            entity.Property(v => v.PurchasePrice).HasPrecision(18, 2);
            entity.Property(v => v.DepositPaid).HasPrecision(18, 2);
            entity.Property(v => v.MonthlyFinancePayment).HasPrecision(18, 2);
            entity.Property(v => v.RemainingFinanceBalance).HasPrecision(18, 2);

            entity.HasOne(v => v.Compliance)
                  .WithOne(c => c.Vehicle)
                  .HasForeignKey<VehicleCompliance>(c => c.VehicleId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(v => v.ServiceLogs)
                  .WithOne(s => s.Vehicle)
                  .HasForeignKey(s => s.VehicleId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(v => v.Documents)
                  .WithOne(d => d.Vehicle)
                  .HasForeignKey(d => d.VehicleId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(v => v.Assignments)
                  .WithOne(a => a.Vehicle)
                  .HasForeignKey(a => a.VehicleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<VehicleCompliance>(entity =>
        {
            entity.HasIndex(c => new { c.MotDueDate, c.RoadTaxDueDate, c.InsuranceDueDate });
            entity.Property(c => c.AnnualRoadTaxCost).HasPrecision(18, 2);
            entity.Property(c => c.MonthlyInsuranceCost).HasPrecision(18, 2);
            entity.Property(c => c.InsurancePolicyNumber).HasMaxLength(100);
            entity.Property(c => c.Insurer).HasMaxLength(100);
            entity.Property(c => c.NamedDrivers).HasMaxLength(255);
            entity.Property(c => c.BreakdownRecoveryProvider).HasMaxLength(100);
        });

        builder.Entity<VehicleServiceLog>(entity =>
        {
            entity.Property(s => s.ServiceDescription).HasMaxLength(255).IsRequired();
            entity.Property(s => s.LabourCost).HasPrecision(18, 2);
            entity.Property(s => s.PartsCost).HasPrecision(18, 2);
            entity.Property(s => s.TotalCost).HasPrecision(18, 2);
            entity.Property(s => s.SupplierOrGarage).HasMaxLength(150);
            entity.Property(s => s.Observation).HasMaxLength(255);
        });

        builder.Entity<VehicleDocument>(entity =>
        {
            entity.Property(d => d.FileUrl).HasMaxLength(500).IsRequired();
            entity.Property(d => d.FileName).HasMaxLength(255);
        });

        builder.Entity<VehicleAssignment>(entity =>
        {
            entity.HasIndex(a => new { a.VehicleId, a.IsCurrent });
            entity.Property(a => a.Notes).HasMaxLength(255);
        });

        // Story 1.4: RouteDefinition, RosterShift, DriverAbsence
        builder.Entity<RouteDefinition>(entity =>
        {
            entity.Property(r => r.RouteCode).HasMaxLength(50).IsRequired();
            entity.Property(r => r.DepotArea).HasMaxLength(100);
            entity.Property(r => r.DefaultRateMultiplier).HasPrecision(18, 2);
        });

        builder.Entity<RosterShift>(entity =>
        {
            entity.HasIndex(s => new { s.DriverId, s.Date, s.RouteCode }).IsUnique();
            entity.Property(s => s.RouteCode).HasMaxLength(50).IsRequired();
            entity.Property(s => s.PostCodeArea).HasMaxLength(50);
            entity.Property(s => s.StopRateMultiplier).HasPrecision(18, 2);
            entity.Property(s => s.AgreedDailyRate).HasPrecision(18, 2);
            entity.Property(s => s.ExtraPay).HasPrecision(18, 2);
            entity.Property(s => s.Comments).HasMaxLength(255);
        });

        builder.Entity<DriverAbsence>(entity =>
        {
            entity.HasIndex(a => new { a.DriverId, a.StartDate, a.EndDate });
            entity.Property(a => a.ApprovedBy).HasMaxLength(150);
            entity.Property(a => a.Notes).HasMaxLength(255);
        });

        // Story 1.5: Banking, Smart Expense Router & UK VAT
        builder.Entity<BankAccount>(entity =>
        {
            entity.Property(b => b.BankName).HasMaxLength(100).IsRequired();
            entity.Property(b => b.AccountNumber).HasMaxLength(20).IsRequired();
            entity.Property(b => b.SortCode).HasMaxLength(10).IsRequired();
            entity.Property(b => b.Currency).HasMaxLength(3).IsRequired();
            entity.Property(b => b.InitialBalance).HasPrecision(18, 2);
            entity.Property(b => b.CurrentBalance).HasPrecision(18, 2);

            entity.HasOne(b => b.Company)
                  .WithMany()
                  .HasForeignKey(b => b.CompanyId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(b => b.Transactions)
                  .WithOne(t => t.BankAccount)
                  .HasForeignKey(t => t.BankAccountId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<BankTransaction>(entity =>
        {
            entity.HasIndex(t => new { t.BankAccountId, t.TransactionDate });
            entity.Property(t => t.Amount).HasPrecision(18, 2);
            entity.Property(t => t.Description).HasMaxLength(255);
            entity.Property(t => t.PayeeDestination).HasMaxLength(150);
            entity.Property(t => t.ReceiptUrl).HasMaxLength(500);
            entity.Property(t => t.VatRate).HasPrecision(18, 2);
            entity.Property(t => t.VatElement).HasPrecision(18, 2);

            entity.HasOne(t => t.LinkedVehicle)
                  .WithMany()
                  .HasForeignKey(t => t.LinkedVehicleId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(t => t.LinkedDriver)
                  .WithMany()
                  .HasForeignKey(t => t.LinkedDriverId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<VatReturnQuarter>(entity =>
        {
            entity.HasIndex(v => new { v.CompanyId, v.StartDate, v.EndDate });
            entity.Property(v => v.QuarterName).HasMaxLength(50).IsRequired();
            entity.Property(v => v.TotalOutputVatReceived).HasPrecision(18, 2);
            entity.Property(v => v.TotalInputVatPaid).HasPrecision(18, 2);
            entity.Property(v => v.NetVatDue).HasPrecision(18, 2);
            entity.Property(v => v.AmountPaidToHmrc).HasPrecision(18, 2);
            entity.Property(v => v.Variance).HasPrecision(18, 2);

            entity.HasOne(v => v.Company)
                  .WithMany()
                  .HasForeignKey(v => v.CompanyId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Story 1.6: Carrier Audit & Payroll Remittances
        builder.Entity<PayPeriod>(entity =>
        {
            entity.HasIndex(p => new { p.StartDate, p.EndDate });

            entity.HasMany(p => p.Payslips)
                  .WithOne(s => s.PayPeriod)
                  .HasForeignKey(s => s.PayPeriodId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.CarrierReconciliations)
                  .WithOne(r => r.PayPeriod)
                  .HasForeignKey(r => r.PayPeriodId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.FuelCardTransactions)
                  .WithOne(f => f.PayPeriod)
                  .HasForeignKey(f => f.PayPeriodId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<DriverPayslip>(entity =>
        {
            entity.HasIndex(s => new { s.PayPeriodId, s.DriverId }).IsUnique();
            entity.Property(s => s.GrossDeliveryEarnings).HasPrecision(18, 2);
            entity.Property(s => s.ExtraPaymentsBonus).HasPrecision(18, 2);
            entity.Property(s => s.AdminFeeRate).HasPrecision(18, 2);
            entity.Property(s => s.AdminFeeDeducted).HasPrecision(18, 2);
            entity.Property(s => s.VanRentDeducted).HasPrecision(18, 2);
            entity.Property(s => s.FuelCardDeducted).HasPrecision(18, 2);
            entity.Property(s => s.DepositDeducted).HasPrecision(18, 2);
            entity.Property(s => s.CashAdvanceDeducted).HasPrecision(18, 2);
            entity.Property(s => s.FinesOrPenalties).HasPrecision(18, 2);
            entity.Property(s => s.SubtotalExVat).HasPrecision(18, 2);
            entity.Property(s => s.VatRate).HasPrecision(18, 2);
            entity.Property(s => s.VatAmount).HasPrecision(18, 2);
            entity.Property(s => s.TotalNetPaid).HasPrecision(18, 2);
            entity.Property(s => s.PdfInvoiceUrl).HasMaxLength(500);
            entity.Property(s => s.Comments).HasMaxLength(255);

            entity.HasOne(s => s.Driver)
                  .WithMany()
                  .HasForeignKey(s => s.DriverId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<FuelCardInvoice>(entity =>
        {
            entity.Property(i => i.InvoiceNumber).HasMaxLength(100).IsRequired();
            entity.Property(i => i.TotalGrossAmount).HasPrecision(18, 2);

            entity.HasMany(i => i.Transactions)
                  .WithOne(t => t.FuelCardInvoice)
                  .HasForeignKey(t => t.FuelCardInvoiceId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<FuelCardTransaction>(entity =>
        {
            entity.HasIndex(t => new { t.DriverId, t.TransactionDate });
            entity.Property(t => t.CardNumber).HasMaxLength(50);
            entity.Property(t => t.Amount).HasPrecision(18, 2);

            entity.HasOne(t => t.Driver)
                  .WithMany()
                  .HasForeignKey(t => t.DriverId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(t => t.Vehicle)
                  .WithMany()
                  .HasForeignKey(t => t.VehicleId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<CarrierReconciliationRecord>(entity =>
        {
            entity.HasIndex(r => new { r.PayPeriodId, r.FranchiseId, r.Date, r.RouteCode });
            entity.Property(r => r.RouteCode).HasMaxLength(50).IsRequired();
            entity.Property(r => r.PricePerStopAgreed).HasPrecision(18, 2);
            entity.Property(r => r.DayRateAgreed).HasPrecision(18, 2);
            entity.Property(r => r.AgreedTotal).HasPrecision(18, 2);
            entity.Property(r => r.FirstRunPaid).HasPrecision(18, 2);
            entity.Property(r => r.SecRunPaid).HasPrecision(18, 2);
            entity.Property(r => r.ExtraRunPaid).HasPrecision(18, 2);
            entity.Property(r => r.TopUpPaid).HasPrecision(18, 2);
            entity.Property(r => r.TotalReceivedFromCarrier).HasPrecision(18, 2);
            entity.Property(r => r.Variance).HasPrecision(18, 2);
            entity.Property(r => r.DisputeNotes).HasMaxLength(255);

            entity.HasOne(r => r.Franchise)
                  .WithMany()
                  .HasForeignKey(r => r.FranchiseId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Driver)
                  .WithMany()
                  .HasForeignKey(r => r.DriverId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
