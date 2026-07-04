using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Reports.Queries.GetOne
{
    public class GetReportQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetReportQuery, LabReport?>
    {
        public async Task<LabReport?> Handle(GetReportQuery request, CancellationToken cancellationToken)
        {
            return await context.LabReports.FirstOrDefaultAsync(m => m.Id == request.Id,cancellationToken);
        }
    }
}
