using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using Domain.Viewmodels.Users;
using FMDC.BussinessLayer.Interfaces;
using FMDC.Security.Filters;
using Microsoft.AspNetCore.Mvc;

namespace FMDC.Controllers
{


    [Route("api/fmdc/[controller]")]
    [ApiController]
    [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
    public class TodosController : ControllerBase
    {
        private readonly ITodoService _service;

        public TodosController(ITodoService Manager)
        {
            _service = Manager;

        }
        // GET: api/<TodosController>

        [HttpGet]
        public async Task<JsonResult> Get()
        {
            try
            {
                var user = GetCurrentUser();
                if (user is not null)
                {
                    var todos = await _service.GetTodos(user.Id);
                    return FmdcResult.Success("", todos, 200);
                }
                else
                {
                    return FmdcResult.Error("User cannot be found", 500);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("Todos could not be fetched", 500);
            }
        }

        // GET api/<TodosController>/5
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {

            try
            {
                var user = GetCurrentUser();
                if (user is not null)
                {
                    var todo = await _service.GetTodo(id, user.Id);
                    return FmdcResult.Success("", todo, 200);
                }
                else
                {
                    return FmdcResult.Error("User cannot be found", 500);
                }

            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("Todo could not be fetched", 500);
            }
        }

        // POST api/<TodosController>
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] CreateTodoViewModel viewModel)
        {
            try
            {
                var user = GetCurrentUser();
                if (user is not null)
                {
                    var result = await _service.Create(viewModel.title, user.Id);
                    if (result)
                    {
                        return FmdcResult.Success("Todo has been created", null, 200);
                    }
                    else
                    {
                        return FmdcResult.Error("Todo could not be created", 400);
                    }
                }
                else
                {
                    return FmdcResult.Error("You are not authorized", 500);
                }

            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {
                return FmdcResult.Error("Todo could not be fetched", 500);
            }
        }

        // PUT api/<TodosController>/5
        [HttpPut("{id}")]
        public async Task<JsonResult> Put(int id, [FromBody] CreateTodoViewModel viewModel)
        {
            try
            {
                var user = GetCurrentUser();
                if (user is not null)
                {
                    var result = await _service.Update(id, viewModel.title, user.Id);
                    if (result)
                    {
                        return FmdcResult.Success("Todo has been updated", null, 200);
                    }
                    else
                    {
                        return FmdcResult.Error("Todo could not be updated", 400);
                    }
                }
                else
                {
                    return FmdcResult.Error("You are not authorized", 500);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("Todo could not be fetched", 500);
            }
        }

        // DELETE api/<TodosController>/5
        [HttpPost("[action]")]
        public async Task<JsonResult> Manage(ManageTodoViewModel viewModel)
        {
            try
            {
                var user = GetCurrentUser();
                if (user is not null)
                {
                    var result = false;
                    var operation = ((TaskType)viewModel.type) == TaskType.DELETE ? "deleted" : "marked";
                    var ids = StringToArray(viewModel.ids);
                    switch ((TaskType)viewModel.type)
                    {
                        case TaskType.MARK:
                            result = await _service.Mark(ids, user.Id);
                            break;
                        case TaskType.DELETE:
                            result = await _service.Delete(ids,user.Id);
                            break;

                    }
                    if (result)
                    {
                        return FmdcResult.Success("Todo has been " + operation, null, 200);
                    }
                    else
                    {
                        return FmdcResult.Error("Todo can not be " + operation, 400);
                    }
                }
                else
                {
                    return FmdcResult.Error("You are not authorized", 500);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("Todo could not be fetched", 500);
            }
        }

        // DELETE api/<TodosController>/5
        [HttpPost("[action]")]
        public async Task<JsonResult> ManageSingle(int id, int type)
        {
            try
            {
                var user = GetCurrentUser();
                if (user is not null)
                {
                    var result = false;
                    var operation = ((TaskType)type) == TaskType.DELETE ? "deleted" : "marked";
                    
                    switch ((TaskType)type)
                    {
                        case TaskType.MARK:
                            result = await _service.Mark(id, user.Id, true);
                            break;
                        case TaskType.DELETE:
                            result = await _service.Delete(id, user.Id, true);
                            break;

                    }
                    if (result)
                    {
                        return FmdcResult.Success("Todo has been " + operation, null, 200);
                    }
                    else
                    {
                        return FmdcResult.Error("Todo can not be " + operation, 400);
                    }
                }
                else
                {
                    return FmdcResult.Error("You are not authorized", 500);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("Todo could not be fetched", 500);
            }
        }

        private static int[] StringToArray(string arrayString)
        {
            int[] rInt;
            var onlyInt = 0;

            arrayString = arrayString.Replace('[', ' ').Replace(']', ' ');
            if (int.TryParse(arrayString, out onlyInt))
            {
                rInt = new int[] { onlyInt };
            }
            else
            {

                string[] aStr = arrayString.Split(',');
                rInt = new int[aStr.Length];
                int i = 0;
                foreach (var str in aStr)
                {
                    rInt[i] = int.Parse(str, System.Globalization.CultureInfo.InvariantCulture);
                    i++;
                }
            }
            return rInt;
        }
        private UserViewModel? GetCurrentUser()
        {
            return HttpContext.Items["User"] as UserViewModel;

        }
    }
    enum TaskType
    {
        MARK = 1, DELETE = 2
    }
}
