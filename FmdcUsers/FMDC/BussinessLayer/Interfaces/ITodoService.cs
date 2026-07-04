using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface ITodoService
    {
        Task<TodoViewModel?> GetTodo(int id, int userId);
        Task<IEnumerable<TodoViewModel>> GetTodos(int userId);

        Task<bool> Create(string title,int userId);
        Task<bool> Update(int id, string title, int userId);
        Task<bool> Delete(int[] ids, int userId);
        Task<bool> Mark(int[] ids, int userId);

        Task<bool> Delete(int id, int userId, bool isSingle);
        Task<bool> Mark(int id, int userId, bool isSingle);

    }
}
