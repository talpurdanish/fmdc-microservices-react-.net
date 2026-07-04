using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Prescriptions.Queries.Tests
{
    public record ListPrescriptionMedicationQuery(int Id) : IRequest<List<PrescriptionMedication>>;
}
