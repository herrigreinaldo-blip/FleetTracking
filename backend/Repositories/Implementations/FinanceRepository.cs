using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Models;
using DeliveryFinance.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFinance.Api.Repositories.Implementations;

public class FinanceRepository : Repository<BankTransaction>, IFinanceRepository
{
    private readonly ApplicationDbContext _appContext;

    public FinanceRepository(ApplicationDbContext context) : base(context)
    {
        _appContext = context;
    }

    public async Task<IEnumerable<BankAccount>> GetAccountsByCompanyAsync(Guid companyId)
    {
        return await _appContext.BankAccounts
            .Where(b => b.CompanyId == companyId)
            .OrderBy(b => b.BankName)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<BankAccount?> GetAccountWithTransactionsAsync(Guid accountId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _appContext.BankAccounts
            .Include(b => b.Company)
            .AsNoTracking();

        var account = await query.FirstOrDefaultAsync(b => b.Id == accountId);
        if (account == null) return null;

        var transQuery = _appContext.BankTransactions
            .Include(t => t.LinkedVehicle)
            .Include(t => t.LinkedDriver)
            .Where(t => t.BankAccountId == accountId);

        if (startDate.HasValue) transQuery = transQuery.Where(t => t.TransactionDate >= startDate.Value);
        if (endDate.HasValue) transQuery = transQuery.Where(t => t.TransactionDate <= endDate.Value);

        account.Transactions = await transQuery
            .OrderByDescending(t => t.TransactionDate)
            .AsNoTracking()
            .ToListAsync();

        return account;
    }

    public async Task<IEnumerable<BankTransaction>> GetTransactionsAsync(Guid? accountId, DateTime? startDate, DateTime? endDate, ExpenseCategory? category)
    {
        var query = _appContext.BankTransactions
            .Include(t => t.BankAccount)
                .ThenInclude(b => b!.Company)
            .Include(t => t.LinkedVehicle)
            .Include(t => t.LinkedDriver)
            .AsQueryable();

        if (accountId.HasValue) query = query.Where(t => t.BankAccountId == accountId.Value);
        if (startDate.HasValue) query = query.Where(t => t.TransactionDate >= startDate.Value);
        if (endDate.HasValue) query = query.Where(t => t.TransactionDate <= endDate.Value);
        if (category.HasValue) query = query.Where(t => t.Category == category.Value);

        return await query
            .OrderByDescending(t => t.TransactionDate)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<VatReturnQuarter?> GetVatReturnQuarterAsync(Guid companyId, DateTime startDate, DateTime endDate)
    {
        return await _appContext.VatReturnQuarters
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.CompanyId == companyId && v.StartDate == startDate && v.EndDate == endDate);
    }

    public async Task AddVatReturnQuarterAsync(VatReturnQuarter vatReturn)
    {
        await _appContext.VatReturnQuarters.AddAsync(vatReturn);
    }
}
