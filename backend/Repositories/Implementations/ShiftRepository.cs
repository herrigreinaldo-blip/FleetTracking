using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Models;
using DeliveryFinance.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFinance.Api.Repositories.Implementations;

public class ShiftRepository : Repository<RosterShift>, IShiftRepository
{
    private readonly ApplicationDbContext _appContext;

    public ShiftRepository(ApplicationDbContext context) : base(context)
    {
        _appContext = context;
    }

    public async Task<IEnumerable<RosterShift>> Get4WeekMatrixAsync(DateTime startDate, DateTime endDate, Guid? companyId = null)
    {
        var query = _appContext.RosterShifts
            .Include(s => s.Driver)
            .Include(s => s.Franchise)
                .ThenInclude(f => f!.Company)
            .Where(s => s.Date >= startDate && s.Date <= endDate);

        if (companyId.HasValue)
        {
            query = query.Where(s => s.Franchise != null && s.Franchise.CompanyId == companyId.Value);
        }

        return await query
            .OrderBy(s => s.Date)
            .ThenBy(s => s.Driver != null ? s.Driver.FullName : string.Empty)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<RosterShift>> GetShiftsByDriverAsync(Guid driverId, DateTime startDate, DateTime endDate)
    {
        return await _appContext.RosterShifts
            .Include(s => s.Franchise)
            .Where(s => s.DriverId == driverId && s.Date >= startDate && s.Date <= endDate)
            .OrderBy(s => s.Date)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<bool> HasConflictingShiftAsync(Guid driverId, DateTime date, Guid? excludeShiftId = null)
    {
        var query = _appContext.RosterShifts
            .Where(s => s.DriverId == driverId && s.Date.Date == date.Date && s.Status != ShiftStatus.Cancelled);

        if (excludeShiftId.HasValue)
        {
            query = query.Where(s => s.Id != excludeShiftId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task<IEnumerable<DriverAbsence>> GetDriverAbsencesAsync(DateTime startDate, DateTime endDate, Guid? driverId = null)
    {
        var query = _appContext.DriverAbsences
            .Include(a => a.Driver)
            .Where(a => a.StartDate <= endDate && a.EndDate >= startDate);

        if (driverId.HasValue)
        {
            query = query.Where(a => a.DriverId == driverId.Value);
        }

        return await query
            .OrderBy(a => a.StartDate)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddAbsenceAsync(DriverAbsence absence)
    {
        await _appContext.DriverAbsences.AddAsync(absence);
    }
}
