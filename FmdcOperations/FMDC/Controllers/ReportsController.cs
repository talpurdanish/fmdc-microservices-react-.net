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
    public class ReportsController : ControllerBase
    {

        private readonly IReportService _service;
        private readonly IWebHostEnvironment _environment;
        public ReportsController(IReportService manager, IWebHostEnvironment environment)
        {
            _service = manager;
            _environment = environment;

        }
        // GET: api/<ReportsController>
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {
            try
            {
                var reports = await _service.GetReports(filter);
                return FmdcResult.Success(reports, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Reports could not be fetched" + e.Message, 500);
            }
        }

        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]")]
        public async Task<JsonResult> GetPending()
        {

            try
            {
                var reports = await _service.GetPendingReports();

                return FmdcResult.Success(reports, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Reports could not be fetched" + e.Message, 500);
            }
        }

        // GET api/<ReportsController>/5
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ReportId is not valid", 500);
                var report = await _service.GetReport(id);
                return FmdcResult.Success(report, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Report does not exists" + e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]/{id}")]
        public async Task<JsonResult> GetPatientReports([FromQuery] DataFilter filter)
        {
            try
            {
                if (filter.Id <= 0)
                    return FmdcResult.Error("ReportId is not valid", 500);
                var reports = await _service.GetPatientReports(filter);
                return FmdcResult.Success(reports, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Report does not exists" + e.Message, 500);
            }
        }

        // POST api/<ReportsController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] LabReportViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Report has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Report could not be created", 400);
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

        // PUT api/<ReportsController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPut]
        public async Task<JsonResult> Put([FromBody] LabReportViewModel viewModel)
        {
            try
            {
                var result = await _service.Update(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Report has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Report could not be updated", 400);
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
        [HttpGet("[action]/{id}")]
        public async Task<JsonResult> GetPendingParameters(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ReportId is not valid", 500);
                var reports = await _service.GetPendingParameters(id);
                return FmdcResult.Success(reports, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Report does not exists" + e.Message, 500);
            }

        }
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPut("[action]")]
        public async Task<JsonResult> UpdateValues([FromBody] AddReportValues reportValues)
        {
            try
            {

                var result = await _service.UpdateValues(reportValues);
                if (result)
                {
                    return FmdcResult.Success("Report has been completed", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Report could not be completed", 400);
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

        // DELETE api/<ReportsController>/5
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ReportId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("Report has been deleted", null, 200);
                else
                    return FmdcResult.Error("Report has not been deleted", 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GenerateReport(int id)
        {
            var report = await _service.GetReport(id);
            var path = _environment.ContentRootPath + "/Reports";
            var reportGenerator = new PdfReportGenerator();
            var type = new ReportType("report.pdf", 297f, 210f, report!);

            if (reportGenerator.Generate(path, type))
            {
                var stream = new FileStream(path + "/report.pdf", FileMode.Open);
                return new FileStreamResult(stream, "application/pdf");
            }
            else
            {
                return FmdcResult.Error("Pdf could not been generated", 500);
            }

        }

    }
}
