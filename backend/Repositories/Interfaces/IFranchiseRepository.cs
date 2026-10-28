using DeliveryFinance.Api.Models;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IFranchiseRepository : IRepository<Franchise>
{
    Task<Franchise?> GetByFdCodeAsync(string fdCode);
    Task<IEnumerable<Franchise>> GetByCompanyAsync(Guid companyId);
    Task<IEnumerable<Franchise>> GetByCarrierAsync(Guid carrierId);
}
