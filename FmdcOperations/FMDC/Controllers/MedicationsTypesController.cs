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
    public class MedicationTypesController : ControllerBase
    {

        private readonly IMedicationTypeService _service;

        public MedicationTypesController(IMedicationTypeService service)
        {
            _service = service;

        }
        // GET: api/<MedicationTypesController>
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {

            try
            {
                var MedicationTypes = await _service.GetMedicationTypes(filter);

                return FmdcResult.Success(MedicationTypes, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("MedicationTypes could not be fetched" + e.Message, 500);
            }
        }

        // GET api/<MedicationTypesController>/5
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("MedicationTypeId is not valid", 500);
                var MedicationType = await _service.GetMedicationType(id);
                return FmdcResult.Success(MedicationType, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("MedicationType does not exists" + e.Message, 500);
            }
        }

        // POST api/<MedicationTypesController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] MedicationTypeViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Medication Type has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Medication Type could not be created", 400);
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

        // PUT api/<MedicationTypesController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPut]
        public async Task<JsonResult> Put([FromBody] MedicationTypeViewModel viewModel)
        {
            try
            {
                var result = await _service.Update(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Medication Type has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Medication Type could not be updated", 400);
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

        // DELETE api/<MedicationTypesController>/5
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("MedicationTypeId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("MedicationType has been deleted", null, 200);
                else
                    return FmdcResult.Error("MedicationType has not been deleted", 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

    }
}
