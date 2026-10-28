using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Models;
using DeliveryFinance.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFinance.Api.Repositories.Implementations;

public class FranchiseRepository : Repository<Franchise>, IFranchiseRepository
{
    private readonly ApplicationDbContext _appContext;

    public FranchiseRepository(ApplicationDbContext context) : base(context)
    {
        _appContext = context;
    }

    public async Task<Franchise?> GetByFdCodeAsync(string fdCode)
    {
        var normalized = Franchise.NormalizeFdCode(fdCode);
        return await _appContext.Franchises
            .Include(f => f.Company)
            .Include(f => f.Carrier)
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.FdCode == normalized);
    }

    public async Task<IEnumerable<Franchise>> GetByCompanyAsync(Guid companyId)
    {
        return await _appContext.Franchises
            .Include(f => f.Carrier)
            .Where(f => f.CompanyId == companyId)
            .OrderBy(f => f.FdCode)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Franchise>> GetByCarrierAsync(Guid carrierId)
    {
        return await _appContext.Franchises
            .Include(f => f.Company)
            .Where(f => f.CarrierId == carrierId)
            .OrderBy(f => f.FdCode)
            .AsNoTracking()
            .ToListAsync();
    }
}
