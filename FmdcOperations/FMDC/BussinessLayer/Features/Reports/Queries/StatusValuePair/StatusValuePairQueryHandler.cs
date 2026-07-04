using Domain.Models;
using FMDC.BussinessLayer.Features.Reports.Queries.DTOs;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Reports.Queries.StatusValuePair
{
    public class StatusValuePairQueryHandler(FmdcOperationsContext context) : IRequestHandler<StatusValueQuery, List<StatusValuePairModel>>
    {
        public async Task<List<StatusValuePairModel>> Handle(StatusValueQuery request, CancellationToken cancellationToken)
        {
            if (request.Type == Enums.StatusValuePairType.ByParameterId) {
                return await GetByParameterId(request.Id, request.ReportId, cancellationToken);
            }
            else
            {
                return await GetByTestId(request.Id, request.ReportId, cancellationToken);
            }
        }

        public async Task<List<StatusValuePairModel>> GetByTestId(int testId, int labReportId, CancellationToken ct)
        {
            return await context.TestParameters
                    .Where(tp => tp.TestId == testId)
                    .GroupJoin(
                        context.ReportValues.Where(rv => rv.LabReportId == labReportId),
                        tp => tp.Id,
                        rv => rv.TestParameterId,
                        (tp, rvs) => new { tp, rvs }
                    )
                    .SelectMany(
                        x => x.rvs.DefaultIfEmpty(),
                        (x, rv) => new StatusValuePairModel
                        {
                            TestParameterId = x.tp.Id,
                            Value = rv != null ? rv.Value : -1,
                            Status = rv != null
                        }
                    )
                    .ToListAsync(ct);

        }

        public async Task<List<StatusValuePairModel>> GetByParameterId(int paramId, int labReportId, CancellationToken ct)
        {


            return await context.TestParameters
                    .Where(tp => tp.Id == paramId)
                    .GroupJoin(
                        context.ReportValues.Where(rv => rv.LabReportId == labReportId),
                        tp => tp.Id,
                        rv => rv.TestParameterId,
                        (tp, rvs) => new { tp, rvs }
                    )
                    .SelectMany(
                        x => x.rvs.DefaultIfEmpty(),
                        (x, rv) => new StatusValuePairModel
                        {
                            TestParameterId = x.tp.Id,
                            Value = rv != null ? rv.Value : -1,
                            Status = rv != null
                        }
                    )
                    .ToListAsync(ct);

        }
    }
}
