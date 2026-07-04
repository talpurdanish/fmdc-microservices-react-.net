using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Globalization;

namespace FMDC.BussinessLayer.Features.Reports.Commands.UpdateValues
{
    public class UpdateValuesCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateValuesCommand, bool>
    {
        public async Task<bool> Handle(UpdateValuesCommand request, CancellationToken cancellationToken)
        {
            using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                var reportValues = request.ReportValues;
                var report = await context.LabReports.FirstOrDefaultAsync(lr => lr.Id == reportValues.LabReportId, cancellationToken);
                if (report is null)
                    return false;

                var rvs = GenerateReportValuesList(reportValues.Paramvalues, reportValues.LabReportId);
                if (rvs is null || rvs.Count <= 0)
                    throw new FmdcException("Invalid Report Values");
                await context.ReportValues.AddRangeAsync(rvs, cancellationToken);

                report.Status = true;
                context.LabReports.Update(report);

                var rowsChanged = await context.SaveChangesAsync(cancellationToken);
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync(cancellationToken);
                return false;
                    
            }
        }

        public static List<ReportValue> GenerateReportValuesList(string arrayString, int lId)
        {
            var list = new List<ReportValue>();

            if (string.IsNullOrWhiteSpace(arrayString))
                return list;

            var array = JArray.Parse(arrayString);

            foreach (var obj in array.Children<JObject>())
            {
                var idToken = obj["id"];
                if (idToken == null) continue;

                int id = idToken.Value<int>();

                foreach (var prop in obj.Properties())
                {
                    if (prop.Name == "id") continue;

                    if (double.TryParse(prop.Value.ToString(), NumberStyles.Any, CultureInfo.InvariantCulture, out double parsedValue))
                    {
                        list.Add(new ReportValue
                        {
                            Value = parsedValue,
                            TestParameterId = id,
                            LabReportId = lId
                        });
                    }
                }
            }

            return list;
        }

    }
}
