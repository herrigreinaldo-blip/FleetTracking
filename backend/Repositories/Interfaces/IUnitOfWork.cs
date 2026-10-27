using DeliveryFinance.Api.Repositories.Interfaces;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IRoleRepository Roles { get; }
    Task<int> SaveChangesAsync();
}
