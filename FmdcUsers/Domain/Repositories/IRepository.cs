using System.Linq.Expressions;

namespace Domain.Repositories
{
    public interface IRepository<T> where T:class
    {
        ValueTask<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        IQueryable<T> Find(Expression<Func<T, bool>> expression);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
        void Update(T entity);
        Task<bool> AnyAsync(Expression<Func<T, bool>> expression);
    }
}
