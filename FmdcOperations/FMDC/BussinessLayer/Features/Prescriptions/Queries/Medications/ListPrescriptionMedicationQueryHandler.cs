using Domain.Helpers;
using Domain.Models;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.Enums;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Prescriptions.Queries.Tests
{
    public class ListPrescriptionMedicationQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListPrescriptionMedicationQuery, List<PrescriptionMedication>>
    {
        public async Task<List<PrescriptionMedication>> Handle(ListPrescriptionMedicationQuery request, CancellationToken cancellationToken)
        {
            
            return await context.PrescriptionMedications.Include(p=>p.Medication).Where(p=>p.PrescriptionId == request.Id).ToListAsync(cancellationToken);

        }

    }
}
