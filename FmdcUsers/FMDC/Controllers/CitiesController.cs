using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;
using FMDC.BussinessLayer.Services;
using FMDC.Security.Filters;
using Microsoft.AspNetCore.Mvc;


namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
    public class CitiesController(ICityService service) : ControllerBase
    {
        private readonly ICityService _service = service;

        // GET: api/<CitiesController>
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {
            try
            {
                var cities = await _service.GetCities(filter);
                return FmdcResult.Success("", cities, 200);
            }
            catch (Exception)   
            {
                return FmdcResult.Error("Cities could not be fetched", 500);
            }
        }

        [HttpGet("{id}")]
        public async Task<JsonResult> GetCity(int id)
        {
            try
            {
                var cities = await _service.GetCity(id);
                return FmdcResult.Success("", cities, 200);
            }
            catch (Exception)
            {
                return FmdcResult.Error("Cities could not be fetched", 500);
            }
        }

        [HttpPost]
        public async Task<JsonResult> Post([FromBody] CityViewModel viewModel)
        {
            try
            {
                bool created = await _service.Create(viewModel);
                if (created) {
                    return FmdcResult.Success("City has been created", null, 200);
                }
                else {
                    return FmdcResult.Error("Cities could not be created", 500);
                }
                
            }
            catch (Exception)
            {
                return FmdcResult.Error("Cities could not be created", 500);
            }

        }

        [HttpPut("{id}")]
        public async Task<JsonResult> Put(int id, [FromBody] CityViewModel viewModel)
        {

            try
            {
                bool created = await _service.Update(id, viewModel);
                return FmdcResult.Success("City has been updated", null, 200);
            }
            catch (Exception)
            {
                return FmdcResult.Error("Cities could not be updated", 500);
            }

        }


        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {

            try
            {
                bool created = await _service.Delete(id);
                return FmdcResult.Success("City has been deleted", null, 200);
            }
            catch (Exception)
            {
                return FmdcResult.Error("Cities could not be deleted", 500);
            }

        }


    }
}
