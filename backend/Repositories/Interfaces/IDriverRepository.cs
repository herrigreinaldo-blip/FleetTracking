using DeliveryFinance.Api.Models;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IDriverRepository : IRepository<DriverProfile>
{
    Task<DriverProfile?> GetByDrNumberAsync(string drNumber);
    Task<DriverProfile?> GetByUserIdAsync(string userId);
    Task<DriverProfile?> GetWithDetailsAsync(Guid id);
    Task<IEnumerable<DriverProfile>> GetActiveDriversAsync();
}
