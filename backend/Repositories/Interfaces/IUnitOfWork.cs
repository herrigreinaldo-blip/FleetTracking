using Microsoft.EntityFrameworkCore.Storage;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IRoleRepository Roles { get; }
    IVehicleRepository Vehicles { get; }
    IDriverRepository Drivers { get; }
    IShiftRepository Shifts { get; }
    IFinanceRepository Finance { get; }
    IPayrollRepository Payroll { get; }
    IFranchiseRepository Franchises { get; }

    IRepository<T> Repository<T>() where T : class;

    Task<IDbContextTransaction> BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    Task<int> SaveChangesAsync();
}
