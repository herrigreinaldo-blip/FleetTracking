using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Models;
using DeliveryFinance.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFinance.Api.Repositories.Implementations;

public class PayrollRepository : Repository<DriverPayslip>, IPayrollRepository
{
    private readonly ApplicationDbContext _appContext;

    public PayrollRepository(ApplicationDbContext context) : base(context)
    {
        _appContext = context;
    }

    public async Task<PayPeriod?> GetPayPeriodByIdAsync(Guid payPeriodId)
    {
        return await _appContext.PayPeriods
            .Include(p => p.Payslips)
                .ThenInclude(s => s.Driver)
            .Include(p => p.CarrierReconciliations)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == payPeriodId);
    }

    public async Task<PayPeriod?> GetCurrentOpenPayPeriodAsync()
    {
        return await _appContext.PayPeriods
            .Where(p => p.Status == PayPeriodStatus.Open || p.Status == PayPeriodStatus.Calculating)
            .OrderByDescending(p => p.StartDate)
            .AsNoTracking()
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<DriverPayslip>> GetPayslipsForPeriodAsync(Guid payPeriodId)
    {
        return await _appContext.DriverPayslips
            .Include(s => s.Driver)
            .Include(s => s.PayPeriod)
            .Where(s => s.PayPeriodId == payPeriodId)
            .OrderBy(s => s.Driver != null ? s.Driver.FullName : string.Empty)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<DriverPayslip?> GetDriverPayslipAsync(Guid payPeriodId, Guid driverId)
    {
        return await _appContext.DriverPayslips
            .Include(s => s.Driver)
                .ThenInclude(d => d!.Deposit)
            .Include(s => s.PayPeriod)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.PayPeriodId == payPeriodId && s.DriverId == driverId);
    }

    public async Task<IEnumerable<CarrierReconciliationRecord>> GetReconciliationsForPeriodAsync(Guid payPeriodId)
    {
        return await _appContext.CarrierReconciliationRecords
            .Include(r => r.Franchise)
            .Include(r => r.Driver)
            .Where(r => r.PayPeriodId == payPeriodId)
            .OrderBy(r => r.Date)
            .ThenBy(r => r.RouteCode)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<FuelCardTransaction>> GetUnreconciledFuelTransactionsAsync(Guid driverId, DateTime startDate, DateTime endDate)
    {
        return await _appContext.FuelCardTransactions
            .Where(f => f.DriverId == driverId && !f.IsDiscountedFromPayroll && f.TransactionDate >= startDate && f.TransactionDate <= endDate)
            .OrderBy(f => f.TransactionDate)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddPayPeriodAsync(PayPeriod period)
    {
        await _appContext.PayPeriods.AddAsync(period);
    }

    public async Task AddCarrierReconciliationRangeAsync(IEnumerable<CarrierReconciliationRecord> records)
    {
        await _appContext.CarrierReconciliationRecords.AddRangeAsync(records);
    }
}
