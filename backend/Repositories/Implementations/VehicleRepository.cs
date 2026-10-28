using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Models;
using DeliveryFinance.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFinance.Api.Repositories.Implementations;

public class VehicleRepository : Repository<Vehicle>, IVehicleRepository
{
    private readonly ApplicationDbContext _appContext;

    public VehicleRepository(ApplicationDbContext context) : base(context)
    {
        _appContext = context;
    }

    public async Task<Vehicle?> GetByRegistrationAsync(string registration)
    {
        var normalized = Vehicle.NormalizeRegistration(registration);
        return await _appContext.Vehicles
            .Include(v => v.Compliance)
            .Include(v => v.Company)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Registration == normalized);
    }

    public async Task<Vehicle?> GetWithDetailsAsync(Guid id)
    {
        return await _appContext.Vehicles
            .Include(v => v.Company)
            .Include(v => v.Compliance)
            .Include(v => v.ServiceLogs.OrderByDescending(s => s.Date))
            .Include(v => v.Documents.OrderByDescending(d => d.UploadedAt))
            .Include(v => v.Assignments.OrderByDescending(a => a.StartDate))
                .ThenInclude(a => a.Driver)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<IEnumerable<Vehicle>> GetVehiclesDueForComplianceAsync(int daysThreshold = 30)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(daysThreshold);

        return await _appContext.Vehicles
            .Include(v => v.Compliance)
            .Include(v => v.Company)
            .Where(v => v.Compliance != null && (
                v.Compliance.MotDueDate <= cutoffDate ||
                v.Compliance.RoadTaxDueDate <= cutoffDate ||
                v.Compliance.InsuranceDueDate <= cutoffDate
            ))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Vehicle>> GetByCompanyAsync(Guid companyId)
    {
        return await _appContext.Vehicles
            .Include(v => v.Compliance)
            .Where(v => v.CompanyId == companyId)
            .AsNoTracking()
            .ToListAsync();
    }
}
