using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Queries.GetOne
{
    public class GetMedicationTypeQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetMedicationTypeQuery, MedicationType?>
    {
        public async Task<MedicationType?> Handle(GetMedicationTypeQuery request, CancellationToken cancellationToken)
        {
            return await context.MedicationTypes.FirstOrDefaultAsync(m => m.Id == request.Id,cancellationToken);
        }
    }
}
