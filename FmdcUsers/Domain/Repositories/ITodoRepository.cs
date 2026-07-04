using Domain.Models;
using Domain.Viewmodels;
using Microsoft.EntityFrameworkCore;

namespace Domain.Repositories
{
    public interface ITodoRepository : IRepository<TodoEvent>
    {
        Task<IEnumerable<TodoEvent>> GetTodosByUserIdAsync(int userId);
        Task<TodoEvent?> GetTodoWithUserAsync(int id);
    }
}
