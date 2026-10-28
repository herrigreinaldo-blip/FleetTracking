using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Models;
using DeliveryFinance.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFinance.Api.Repositories.Implementations;

public class DriverRepository : Repository<DriverProfile>, IDriverRepository
{
    private readonly ApplicationDbContext _appContext;

    public DriverRepository(ApplicationDbContext context) : base(context)
    {
        _appContext = context;
    }

    public async Task<DriverProfile?> GetByDrNumberAsync(string drNumber)
    {
        var normalized = DriverProfile.NormalizeDrNumber(drNumber);
        return await _appContext.DriverProfiles
            .Include(d => d.Deposit)
            .Include(d => d.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.DrNumber == normalized);
    }

    public async Task<DriverProfile?> GetByUserIdAsync(string userId)
    {
        return await _appContext.DriverProfiles
            .Include(d => d.Deposit)
            .Include(d => d.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.UserId == userId);
    }

    public async Task<DriverProfile?> GetWithDetailsAsync(Guid id)
    {
        return await _appContext.DriverProfiles
            .Include(d => d.User)
            .Include(d => d.Deposit)
                .ThenInclude(dep => dep!.Transactions.OrderByDescending(t => t.Date))
            .Include(d => d.VehicleAssignments.Where(a => a.IsCurrent))
                .ThenInclude(a => a.Vehicle)
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<IEnumerable<DriverProfile>> GetActiveDriversAsync()
    {
        return await _appContext.DriverProfiles
            .Include(d => d.Deposit)
            .Where(d => d.IsActive)
            .OrderBy(d => d.FullName)
            .AsNoTracking()
            .ToListAsync();
    }
}
