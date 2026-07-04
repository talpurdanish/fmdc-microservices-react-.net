namespace Domain.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        
        IUserRepository Users { get; }
        IPatientRepository Patients { get; }
        ICityRepository Cities { get; }
        IProvinceRepository Provinces { get; }
        ITodoRepository Todos { get; }
        INotificationRepository Notifications { get; }
        Task<int> SaveChangesAsync();
    }
}
