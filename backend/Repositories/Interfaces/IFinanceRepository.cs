using DeliveryFinance.Api.Models;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IFinanceRepository : IRepository<BankTransaction>
{
    Task<IEnumerable<BankAccount>> GetAccountsByCompanyAsync(Guid companyId);
    Task<BankAccount?> GetAccountWithTransactionsAsync(Guid accountId, DateTime? startDate = null, DateTime? endDate = null);
    Task<IEnumerable<BankTransaction>> GetTransactionsAsync(Guid? accountId, DateTime? startDate, DateTime? endDate, ExpenseCategory? category);
    Task<VatReturnQuarter?> GetVatReturnQuarterAsync(Guid companyId, DateTime startDate, DateTime endDate);
    Task AddVatReturnQuarterAsync(VatReturnQuarter vatReturn);
}
