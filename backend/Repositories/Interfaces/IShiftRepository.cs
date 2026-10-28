using DeliveryFinance.Api.Models;

namespace DeliveryFinance.Api.Repositories.Interfaces;

public interface IShiftRepository : IRepository<RosterShift>
{
    Task<IEnumerable<RosterShift>> Get4WeekMatrixAsync(DateTime startDate, DateTime endDate, Guid? companyId = null);
    Task<IEnumerable<RosterShift>> GetShiftsByDriverAsync(Guid driverId, DateTime startDate, DateTime endDate);
    Task<bool> HasConflictingShiftAsync(Guid driverId, DateTime date, Guid? excludeShiftId = null);
    Task<IEnumerable<DriverAbsence>> GetDriverAbsencesAsync(DateTime startDate, DateTime endDate, Guid? driverId = null);
    Task AddAbsenceAsync(DriverAbsence absence);
}
