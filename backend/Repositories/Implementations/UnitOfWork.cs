using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Repositories.Interfaces;

namespace DeliveryFinance.Api.Repositories.Implementations;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    public IUserRepository Users { get; }
    public IRoleRepository Roles { get; }

    public UnitOfWork(ApplicationDbContext context, IUserRepository users, IRoleRepository roles)
    {
        _context = context;
        Users = users;
        Roles = roles;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
