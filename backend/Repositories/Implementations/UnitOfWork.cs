using System.Collections.Concurrent;
using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace DeliveryFinance.Api.Repositories.Implementations;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private readonly ConcurrentDictionary<Type, object> _repositories = new();
    private IDbContextTransaction? _currentTransaction;

    public IUserRepository Users { get; }
    public IRoleRepository Roles { get; }
    public IVehicleRepository Vehicles { get; }
    public IDriverRepository Drivers { get; }
    public IShiftRepository Shifts { get; }
    public IFinanceRepository Finance { get; }
    public IPayrollRepository Payroll { get; }
    public IFranchiseRepository Franchises { get; }

    public UnitOfWork(
        ApplicationDbContext context,
        IUserRepository users,
        IRoleRepository roles,
        IVehicleRepository vehicles,
        IDriverRepository drivers,
        IShiftRepository shifts,
        IFinanceRepository finance,
        IPayrollRepository payroll,
        IFranchiseRepository franchises)
    {
        _context = context;
        Users = users;
        Roles = roles;
        Vehicles = vehicles;
        Drivers = drivers;
        Shifts = shifts;
        Finance = finance;
        Payroll = payroll;
        Franchises = franchises;
    }

    public IRepository<T> Repository<T>() where T : class
    {
        return (IRepository<T>)_repositories.GetOrAdd(typeof(T), _ => new Repository<T>(_context));
    }

    public async Task<IDbContextTransaction> BeginTransactionAsync()
    {
        if (_currentTransaction != null)
        {
            return _currentTransaction;
        }

        _currentTransaction = await _context.Database.BeginTransactionAsync();
        return _currentTransaction;
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync();
            }
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync()
    {
        try
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.RollbackAsync();
            }
        }
        finally
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _currentTransaction?.Dispose();
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
