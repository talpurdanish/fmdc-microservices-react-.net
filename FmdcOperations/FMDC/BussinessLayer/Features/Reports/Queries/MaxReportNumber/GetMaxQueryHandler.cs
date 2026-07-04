using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Reports.Queries.MaxReportNumber
{
    public class GetMaxQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetMaxQuery, int>
    {
        public async Task<int> Handle(GetMaxQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var previousId = await context.LabReports.MaxAsync(l => l.ReportNumber, cancellationToken);
                return previousId;
            }
            catch (Exception)
            {
                return 0;
            }
        }
    }
}
