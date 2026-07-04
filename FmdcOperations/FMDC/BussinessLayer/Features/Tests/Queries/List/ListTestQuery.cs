using Domain.Helpers;
using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Tests.Queries.List
{
    public record ListTestQuery(DataFilter Filter) : IRequest<PagedResults<Test>>;
}
