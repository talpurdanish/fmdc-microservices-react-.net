using Domain.Models;
using Domain.Repositories;
using FMDC.Context;
using System;
using System.Threading.Tasks;

namespace FMDC.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FmdcUsersContext _context;
        
        public IUserRepository Users { get; private set; }
        public IPatientRepository Patients { get; private set; }
        public ICityRepository Cities { get; private set; }
        public IProvinceRepository Provinces { get; private set; }
        public ITodoRepository Todos { get; private set; }
        public INotificationRepository Notifications { get; private set; }

        public UnitOfWork(FmdcUsersContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            Patients = new PatientRepository(_context);
            Cities = new CityRepository(_context);
            Provinces = new ProvinceRepository(_context);
            Todos = new TodoRepository(_context);
            Notifications = new NotificationRepository(_context);
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
}
