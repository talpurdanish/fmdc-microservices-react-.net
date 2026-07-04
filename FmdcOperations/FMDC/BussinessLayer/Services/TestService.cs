using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Features.Tests.Commands.Create;
using FMDC.BussinessLayer.Features.Tests.Commands.Delete;
using FMDC.BussinessLayer.Features.Tests.Commands.Update;
using FMDC.BussinessLayer.Features.Tests.Queries.GetOne;
using FMDC.BussinessLayer.Features.Tests.Queries.List;
using FMDC.BussinessLayer.Interfaces;
using MediatR;

namespace FMDC.BussinessLayer.Services
{
    public class TestService : ITestService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public TestService(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }


        public async Task<TestViewModel?> GetTest(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");

            var Test = await _sender.Send(new GetTestQuery(id));
            var viewModel = _mapper.Map<TestViewModel?>(Test) ?? throw new FmdcException("Test could not be found");
            return viewModel;
        }

        public async Task<PagedResults<TestViewModel>> GetTests(DataFilter filter)
        {

            var Tests = await _sender.Send(new ListTestQuery(filter));
            var data = _mapper.Map<IEnumerable<TestViewModel>>(Tests.Data);

            return new PagedResults<TestViewModel>(data, Tests.CurrentPage, Tests.TotalRecords, Tests.PageSize);
        }

        public async Task<bool> Update(TestViewModel viewmodel)
        {
            var model = await _sender.Send(new GetTestQuery(viewmodel.Id)) ?? throw new FmdcException("Test could not be found");


            model.Name = viewmodel.Name;
            model.Description = viewmodel.Description;
            model.Cost = viewmodel.Cost;


            return await _sender.Send(new UpdateTestCommand(model));
        }

        public async Task<bool> Create(TestViewModel viewmodel)
        {
            var model = _mapper.Map<Test>(viewmodel);

            return await _sender.Send(new CreateTestCommand(model));
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeleteTestCommand(id));
            }
            catch (Exception)
            {

                return false;
            }
        }

    }
}
