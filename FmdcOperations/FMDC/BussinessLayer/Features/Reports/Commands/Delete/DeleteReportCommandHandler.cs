using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Reports.Commands.Delete
{
    public class DeleteReportCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteReportCommand, bool>
    {
        public async Task<bool> Handle(DeleteReportCommand request, CancellationToken cancellationToken)
        {
            var Report = await context.LabReports.FirstOrDefaultAsync(m=>m.Id == request.Id,cancellationToken) ?? throw new FmdcException("Report could not be found");
            context.LabReports.Remove(Report);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
