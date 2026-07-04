using Domain.Helpers;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    //[Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
    public class ProvincesController : ControllerBase
    {
        private readonly IProvinceService _manager;

        public ProvincesController(IProvinceService manager)
        {
            _manager = manager;
        }

        // GET: api/<ProvincesController>
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {
            try
            {
                var Provinces = await _manager.GetProvinces(filter);
                return FmdcResult.Success("", Provinces, 200);
            }
            catch (Exception)
            {
                return FmdcResult.Error("Provinces could not be fetched", 500);
            }
        }

        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {

                var province = await _manager.GetProvince(id);
                return FmdcResult.Success("", province, 200);
            }
            catch (Exception)
            {
                return FmdcResult.Error("Province could not be fetched", 500);
            }
        }

        [HttpPost]
        public async Task<JsonResult> Post([FromBody] ProvinceViewModel viewModel)
        {

            try
            {
                var result = await _manager.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Province has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Province could not be created", 400);
                }
            }
            catch (Exception)
            {
                return FmdcResult.Error("Province could not be created", 500);
            }

        }

        [HttpPut("{id}")]
        public async Task<JsonResult> Put(int id, [FromBody] ProvinceViewModel viewModel)
        {
            try
            {
                bool result = await _manager.Update(id, viewModel);
                if (result)
                {
                    return FmdcResult.Success("Province has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Province could not be updated", 400);
                }
            }
            catch (Exception)
            {
                return FmdcResult.Error("Province could not be updated", 500);
            }

        }


    }
}
