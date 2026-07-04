using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Medications.Queries.GetOne
{
    public class GetMedicationQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetMedicationQuery, Medication?>
    {
        public async Task<Medication?> Handle(GetMedicationQuery request, CancellationToken cancellationToken)
        {
            return await context.Medications.Include(m => m.MedicationType).FirstOrDefaultAsync(m => m.Code == request.Code,cancellationToken);
        }
    }
}
