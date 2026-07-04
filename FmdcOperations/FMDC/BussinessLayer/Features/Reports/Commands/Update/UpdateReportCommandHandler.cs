using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Commands.Update
{
    public class UpdateReportCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateReportCommand, bool>
    {
        public async Task<bool> Handle(UpdateReportCommand request, CancellationToken cancellationToken)
        {
            context.LabReports.Update(request.Model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
