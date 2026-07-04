using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.TestParameters.Queries.GetOne
{
    public record GetTestParameterQuery(int Id) : IRequest<TestParameter?>;
}
