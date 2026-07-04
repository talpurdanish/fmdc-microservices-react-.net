using Domain.Helpers;
using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.TestParameters.Queries.List
{
    public record ListTestParameterQuery(DataFilter Filter) : IRequest<PagedResults<TestParameter>>;
}
