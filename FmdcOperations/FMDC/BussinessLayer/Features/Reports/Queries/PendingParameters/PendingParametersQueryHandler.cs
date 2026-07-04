using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Reports.Queries.PendingParameters
{
    public class PendingParametersQueryHandler(FmdcOperationsContext context) : IRequestHandler<PendingParametersQuery, IEnumerable<TestParameter>?>
    {
        public async Task<IEnumerable<TestParameter>?> Handle(PendingParametersQuery request, CancellationToken cancellationToken)
        {
            var report = await context.LabReports.FirstOrDefaultAsync(lr=>lr.Id == request.Id,cancellationToken) ?? throw new FmdcException("Report could not be found");
            var paramIds = await context.ReportValues.Where(rv=>rv.LabReportId == request.Id).Select(rv=>rv.TestParameterId).ToListAsync(cancellationToken);
            return await context.TestParameters.Where(t=>t.TestId == report.TestId &&  !paramIds.Contains(t.Id)).ToListAsync(cancellationToken);
        }

    }
}
