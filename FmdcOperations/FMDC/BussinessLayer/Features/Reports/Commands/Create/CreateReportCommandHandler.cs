using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Commands.Create
{
    public class CreateReportCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateReportCommand, bool>
    {
        public async Task<bool> Handle(CreateReportCommand request, CancellationToken cancellationToken)
        {
            try
            {
                await context.LabReports.AddAsync(request.Model, cancellationToken);
                var rowsChanged = await context.SaveChangesAsync(cancellationToken);
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
