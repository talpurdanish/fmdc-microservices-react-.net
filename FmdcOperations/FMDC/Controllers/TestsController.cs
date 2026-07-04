using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;
using FMDC.Security.Filters;
using Microsoft.AspNetCore.Mvc;



namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {

        private readonly ITestService _service;

        public TestsController(ITestService service)
        {
            _service = service;

        }
        // GET: api/<TestsController>
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {

            try
            {
                var Tests = await _service.GetTests(filter);

                return FmdcResult.Success(Tests, 200);
            }
            catch (Exception e)
            {
                return FmdcResult.Error("Tests could not be fetched" + e.Message, 500);
            }
        }

        // GET api/<TestsController>/5
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("TestId is not valid", 500);
                var Test = await _service.GetTest(id);
                return FmdcResult.Success(Test, 200);
            }
            catch (Exception e)
            {
                return FmdcResult.Error("Test does not exists" + e.Message, 500);
            }
        }

        // POST api/<TestsController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] TestViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Test has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Test could not be created", 400);
                }
            }
            catch (FmdcException ae)
            {

                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff)]
        // PUT api/<TestsController>
        [HttpPut]
        public async Task<JsonResult> Put([FromBody] TestViewModel viewModel)
        {
            try
            {
                var result = await _service.Update(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Test has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Test could not be updated", 400);
                }
            }

            catch (FmdcException ae)
            {

                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff)]
        // DELETE api/<TestsController>/5
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("TestId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("Test has been deleted", null, 200);
                else
                    return FmdcResult.Error("Test has not been deleted", 400);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

    }
}
