using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Tests.Queries.GetOne
{
    public record GetTestQuery(int Id) : IRequest<Test?>;
}
