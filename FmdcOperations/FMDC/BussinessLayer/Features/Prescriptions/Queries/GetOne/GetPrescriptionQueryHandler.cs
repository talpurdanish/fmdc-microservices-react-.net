using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Prescriptions.Queries.GetOne
{
    public class GetPrescriptionQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetPrescriptionQuery, Prescription?>
    {
        public async Task<Prescription?> Handle(GetPrescriptionQuery request, CancellationToken cancellationToken)
        {
            if (request.Type == Enums.PrescriptionIdType.ByPrescriptionId)
                return await context.Prescriptions.Include(m => m.Appointment).FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);
            else if (request.Type == Enums.PrescriptionIdType.ByPatientId)
                return await context.Prescriptions.Include(m => m.Appointment).FirstOrDefaultAsync(m => m.Appointment != null && m.Appointment.PatientId == request.Id, cancellationToken);
            else
                return null;
        }
    }
}
