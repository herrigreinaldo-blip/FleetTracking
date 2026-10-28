using DeliveryFinance.Api.Models;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IVehicleRepository : IRepository<Vehicle>
{
    Task<Vehicle?> GetByRegistrationAsync(string registration);
    Task<Vehicle?> GetWithDetailsAsync(Guid id);
    Task<IEnumerable<Vehicle>> GetVehiclesDueForComplianceAsync(int daysThreshold = 30);
    Task<IEnumerable<Vehicle>> GetByCompanyAsync(Guid companyId);
}
