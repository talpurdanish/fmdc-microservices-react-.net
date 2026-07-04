using MediatR;

namespace FMDC.BussinessLayer.Features.Prescriptions.Queries.Tests
{
    public record ListPrescriptionTestsQuery(int Id) : IRequest<List<string>>;
}
