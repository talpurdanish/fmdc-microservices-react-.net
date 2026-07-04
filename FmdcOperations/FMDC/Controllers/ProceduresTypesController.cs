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
    public class ProcedureTypesController : ControllerBase
    {

        private readonly IProcedureTypeService _service;

        public ProcedureTypesController(IProcedureTypeService service)
        {
            _service = service;

        }
        // GET: api/<ProcedureTypesController>
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {

            try
            {
                var ProcedureTypes = await _service.GetProcedureTypes(filter);

                return FmdcResult.Success(ProcedureTypes, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("ProcedureTypes could not be fetched" + e.Message, 500);
            }
        }

        // GET api/<ProcedureTypesController>/5
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ProcedureTypeId is not valid", 500);
                var ProcedureType = await _service.GetProcedureType(id);
                return FmdcResult.Success(ProcedureType, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("ProcedureType does not exists" + e.Message, 500);
            }
        }

        // POST api/<ProcedureTypesController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] ProcedureTypeViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("ProcedureType has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("ProcedureType could not be created", 400);
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

        // PUT api/<ProcedureTypesController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPut]
        public async Task<JsonResult> Put([FromBody] ProcedureTypeViewModel viewModel)
        {
            try
            {
                var result = await _service.Update(viewModel);
                if (result)
                {
                    return FmdcResult.Success("ProcedureType has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("ProcedureType could not be updated", 400);
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
        // DELETE api/<ProcedureTypesController>/5
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ProcedureTypeId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("ProcedureType has been deleted", null, 200);
                else
                    return FmdcResult.Error("ProcedureType has not been deleted", 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

    }
}
