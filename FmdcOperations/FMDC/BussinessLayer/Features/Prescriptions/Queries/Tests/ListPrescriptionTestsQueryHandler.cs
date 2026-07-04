using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Prescriptions.Queries.Tests
{
    public class ListPrescriptionTestsQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListPrescriptionTestsQuery, List<string>>
    {
        public async Task<List<string>> Handle(ListPrescriptionTestsQuery request, CancellationToken cancellationToken)
        {
            
            return await context.LabReports.Include(lr => lr.Test).Where(lr => lr.PrescriptionId == request.Id).Select(lr => lr.Test!.Name).ToListAsync(cancellationToken);

        }

    }
}
