using Domain.Repositories;
using FMDC.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FMDC.Repositories
{

    public class Repository<T> : IRepository<T> where T: class
    {
        private readonly FmdcUsersContext _context;

        protected FmdcUsersContext Context => _context;

        public Repository(FmdcUsersContext context)
        {
            _context = context;
        }

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _context.Set<T>().AddRangeAsync(entities);
        }

        public IQueryable<T> Find(Expression<Func<T, bool>> expression)
        {
            return _context.Set<T>().Where(expression);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public ValueTask<T?> GetByIdAsync(int id)
        {
            return _context.Set<T>().FindAsync(id);
        }

        public void Remove(T entity)
        {
           _context.Set<T>().Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            _context.Set<T>().RemoveRange(entities);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> expression)
        {
            return await _context.Set<T>().AnyAsync(expression);
        }
    }
}
