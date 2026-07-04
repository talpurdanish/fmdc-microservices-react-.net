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
    public class ProceduresController : ControllerBase
    {

        private readonly IProcedureService _service;

        public ProceduresController(IProcedureService service)
        {
            _service = service;

        }
        // GET: api/<ProceduresController>
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {

            try
            {
                var Procedures = await _service.GetProcedures(filter);

                return FmdcResult.Success(Procedures, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Procedures could not be fetched" + e.Message, 500);
            }
        }

        // GET api/<ProceduresController>/5
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ProcedureId is not valid", 500);
                var Procedure = await _service.GetProcedure(id);
                return FmdcResult.Success(Procedure, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Procedure does not exists" + e.Message, 500);
            }
        }

        // POST api/<ProceduresController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] ProcedureViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Procedure has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Procedure could not be created", 400);
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

        // PUT api/<ProceduresController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPut]
        public async Task<JsonResult> Put([FromBody] ProcedureViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Procedure has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Procedure could not be updated", 400);
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

        // DELETE api/<ProceduresController>/5
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ProcedureId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("Procedure has been deleted", null, 200);
                else
                    return FmdcResult.Error("Procedure has not been deleted", 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

    }
}
