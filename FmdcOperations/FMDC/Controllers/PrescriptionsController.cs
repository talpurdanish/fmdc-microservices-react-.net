using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;
using FMDC.Reports;
using FMDC.Security.Filters;
using Microsoft.AspNetCore.Mvc;



namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    [Authorize(Roles.Administrator, Roles.Doctor)]
    public class PrescriptionsController : ControllerBase
    {

        private readonly IPrescriptionService _service;
        private readonly IAppointmentService _appointmentService;
        private readonly IWebHostEnvironment _environment;

        public PrescriptionsController(IPrescriptionService manager, IWebHostEnvironment environment,IAppointmentService appointmentService)
        {
            _service = manager;
            _environment = environment;
            _appointmentService = appointmentService;

        }
        // GET: api/<PrescriptionsController>
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {

            try
            {
                var Prescriptions = await _service.GetPrescriptions(filter);
                return FmdcResult.Success(Prescriptions, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Prescriptions could not be fetched" + e.Message, 500);
            }
        }

        // GET api/<PrescriptionsController>/5
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id, [FromQuery] int type = 0)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("PrescriptionId is not valid", 500);
                if (type == 0)
                {
                    var prescription1 = await _service.GetPrescription(id);
                    return FmdcResult.Success(prescription1, 200);
                }
                else
                {
                    var prescription2 = await _appointmentService.GetAppointment(id);
                    return FmdcResult.Success(prescription2, 200);
                }


            }
            catch (Exception e)
            {

                return FmdcResult.Error("Prescription does not exists" + e.Message, 500);
            }
        }

        // GET api/<PrescriptionsController>/5
        [HttpGet("[action]/{id}")]
        public async Task<JsonResult> GetPatientPrescriptions([FromQuery] DataFilter filter)
        {
            try
            {
                if (filter.Id <= 0)
                    return FmdcResult.Error("PatientId is not valid", 500);

                var prescription1 = await _service.GetPatientPrescriptions(filter);
                return FmdcResult.Success(prescription1, 200);


            }
            catch (Exception e)
            {

                return FmdcResult.Error("Prescription does not exists" + e.Message, 500);
            }
        }

        // POST api/<PrescriptionsController>
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] AddPrescriptionViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Prescription has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Prescription could not be created", 400);
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



        // DELETE api/<PrescriptionsController>/5
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("PrescriptionId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("Prescription has been deleted", null, 200);
                else
                    return FmdcResult.Error("Prescription has not been deleted", 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GeneratePrescription(int id)
        {
            var slip = await _service.GeneratePrescription(id);
            var path = _environment.ContentRootPath + "/Reports";
            var reportGenerator = new PdfReportGenerator();
            var slipType = new ReportType("slip.pdf", 297f, 210f, slip);

            if (reportGenerator.Generate(path, slipType, true))
            {
                var stream = new FileStream(path + "/slip.pdf", FileMode.Open);
                return new FileStreamResult(stream, "application/pdf");
            }
            else
            {
                return FmdcResult.Error("Pdf could not been generated", 500);
            }

        }

    }
}
