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
    public class PatientsController(IPatientService service) : ControllerBase
    {

        private readonly IPatientService _service = service;

        // GET: api/<PatientsController>
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {
            try
            {
                var patients = await _service.GetPatients(filter);
                return FmdcResult.Success("", patients, 200);
            }
            catch (Exception)
            {
                return FmdcResult.Error("Patients could not be fetched", 500);
            }
        }

        // GET api/<PatientsController>/5
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("PatientId is not valid", 500);
                
                var patient = await _service.GetPatient(id);
                return FmdcResult.Success("", patient, 200);
            }
            catch (Exception)
            {

                return FmdcResult.Error("Patient does not exists", 500);
            }
        }

        // POST api/<PatientsController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] PatientViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Patient has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Patient could not be created", 400);
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

        // PUT api/<PatientsController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPut]
        public async Task<JsonResult> Put([FromBody] PatientViewModel viewModel)
        {
            try
            {
                var result = await _service.Update(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Patient has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Patient could not be updated", 400);
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

        // DELETE api/<PatientsController>/5
        [Authorize(Roles.Administrator)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("PatientId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("Patient has been deleted", null, 200);
                else
                    return FmdcResult.Error("Patient has not been deleted", 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpGet("[action]")]
        public async Task<bool> CheckCNIC([FromQuery] string value, int id = -1)
        {
            try
            {
                if (string.IsNullOrEmpty(value))
                    return false;
                var signUpResult = await _service.CheckDuplicate(DuplicateType.Cnic, value, id);

                return signUpResult;
            }
            catch (Exception)
            {

                return true;
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]")]
        public async Task<JsonResult> GetStats()
        {
            try
            {
                var stats = await _service.GetStat();
                return FmdcResult.Success("", stats, 200);
            }
            catch (Exception)
            {
                return FmdcResult.Error("No Stats Available", 500);
            }
        }
    }
}
