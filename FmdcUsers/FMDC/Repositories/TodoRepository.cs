using Domain.Models;
using Domain.Repositories;
using FMDC.Context;
using Microsoft.EntityFrameworkCore;

namespace FMDC.Repositories
{
    public class TodoRepository : Repository<TodoEvent>, ITodoRepository
    {
        FmdcUsersContext _context;
        public TodoRepository(FmdcUsersContext context) : base(context)
        {
            _context = context;
        }


        public async Task<IEnumerable<TodoEvent>> GetTodosByUserIdAsync(int userId)
        {
            return await _context.TodoEvents.Where(t => t.UserId == userId).ToListAsync();
        }


        public async Task<TodoEvent?> GetTodoWithUserAsync(int id)
        {
            return await _context.TodoEvents.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}
