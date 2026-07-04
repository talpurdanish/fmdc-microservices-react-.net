using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;

namespace FMDC.BussinessLayer.Services
{
    public class TodoService : ITodoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TodoService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<TodoViewModel?> GetTodo(int id, int userId)
        {
            if (id < 0)
            {
                throw new FmdcException("Id cannot be null");
            }

            if (userId < 0)
            {
                throw new FmdcException("User Id cannot be null");
            }
            var userExists = await _unitOfWork.Users.AnyAsync(u=>u.Id == userId);
            if (!userExists)
                throw new FmdcUnauthorizedException();

            var todo = await _unitOfWork.Todos.GetTodoWithUserAsync(id);
            var todoViewModel = _mapper.Map<TodoViewModel>(todo);
            return todoViewModel;
        }

        public async Task<IEnumerable<TodoViewModel>> GetTodos(int userId = -1)
        {
            if (userId < 0)
            {
                throw new FmdcException("Id cannot be null");
            }

            var userExists = await _unitOfWork.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                throw new FmdcUnauthorizedException();
            var todos = await _unitOfWork.Todos.GetTodoWithUserAsync(userId);
            var todoViewModels = _mapper.Map<IEnumerable<TodoViewModel>>(todos);

            return todoViewModels;
        }

        public async Task<bool> Create( string title, int userId)
        {
            try
            {
                if (userId < 0)
                {
                    throw new FmdcException("Id cannot be null");
                }
                
                if (string.IsNullOrEmpty(title))
                {
                    throw new FmdcException("Title cannot be null");
                }
                
                var userExists = await _unitOfWork.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                    throw new FmdcUnauthorizedException();

                var model = new TodoEvent()
                {
                    Title = title,
                    Created = DateTime.Now,
                    Completed = false,
                    UserId = userId
                };

               await _unitOfWork.Todos.AddAsync(model);
                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                return false; 
            }
           
        }

        public async Task<bool> Update(int id, string title, int userId)
        {
            try
            {

                if (string.IsNullOrEmpty(title))
                {
                    throw new FmdcException("Title cannot be null");
                }
                if (id < 0)
                {
                    throw new FmdcException("Id cannot be null");
                }

                if (userId < 0)
                {
                    throw new FmdcException("User Id cannot be null");
                }
               


                var model = await _unitOfWork.Todos.GetByIdAsync(id);
                if (model == null)
                {
                    throw new FmdcException("Todo cannot be found");
                }
                var userExists = await _unitOfWork.Users.AnyAsync(u => u.Id == model.UserId);
                
                if (!userExists)
                    throw new FmdcUnauthorizedException();

                model.Title = title;
                
                _unitOfWork.Todos.Update(model);
                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> Delete(int[] ids, int userId)
        {
            try
            {
                foreach (var id in ids)
                {
                    await Delete(id, userId);
                }

                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> Delete(int id, int userId, bool isSingle = true)
        {
            if (id < 0)
            {
                throw new FmdcException("Id cannot be null");
            }

            if (userId < 0)
            {
                throw new FmdcException("User Id cannot be null");
            }

            var model = await _unitOfWork.Todos.GetByIdAsync(id);
            if (model == null)
            {
                throw new FmdcException("Todo cannot be found");
            }
            var userExists = await _unitOfWork.Users.AnyAsync(u => u.Id == model.UserId);

            if (!userExists)
                throw new FmdcUnauthorizedException();

            _unitOfWork.Todos.Remove(model);

            if (isSingle)
            {
                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            else return true;

        }

        public async Task<bool> Mark(int[] ids, int userId)
        {
            try
            {
                foreach (var id in ids)
                {
                    await Mark(id, userId);
                }

                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> Mark(int id, int userId, bool isSingle = true)
        {
            if (id < 0)
            {
                throw new FmdcException("Id cannot be null");
            }

            if (userId < 0)
            {
                throw new FmdcException("User Id cannot be null");
            }

            var model = await _unitOfWork.Todos.GetByIdAsync(id);
            if (model == null)
            {
                throw new FmdcException("Todo cannot be found");
            }
            var userExists = await _unitOfWork.Users.AnyAsync(u => u.Id == model.UserId);

            if (!userExists)
                throw new FmdcUnauthorizedException();

            model.Completed = !model.Completed;

            _unitOfWork.Todos.Update(model);

            if (isSingle)
            {
                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            else return true;

        }

    }
}
