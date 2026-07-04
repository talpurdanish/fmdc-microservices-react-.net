using Domain.Models;
using MediatR;


namespace FMDC.BussinessLayer.Features.Reports.Queries.PendingParameters
{
    public record PendingParametersQuery(int Id) : IRequest<IEnumerable<TestParameter>?>;
}
