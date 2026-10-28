using DeliveryFinance.Api.Models;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IPayrollRepository : IRepository<DriverPayslip>
{
    Task<PayPeriod?> GetPayPeriodByIdAsync(Guid payPeriodId);
    Task<PayPeriod?> GetCurrentOpenPayPeriodAsync();
    Task<IEnumerable<DriverPayslip>> GetPayslipsForPeriodAsync(Guid payPeriodId);
    Task<DriverPayslip?> GetDriverPayslipAsync(Guid payPeriodId, Guid driverId);
    Task<IEnumerable<CarrierReconciliationRecord>> GetReconciliationsForPeriodAsync(Guid payPeriodId);
    Task<IEnumerable<FuelCardTransaction>> GetUnreconciledFuelTransactionsAsync(Guid driverId, DateTime startDate, DateTime endDate);
    Task AddPayPeriodAsync(PayPeriod period);
    Task AddCarrierReconciliationRangeAsync(IEnumerable<CarrierReconciliationRecord> records);
}
