using AutoMapper;
using Domain.Helpers;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;
using Domain.Models;
using MediatR;
using FMDC.BussinessLayer.Features.TestParameters.Queries.GetOne;
using FMDC.BussinessLayer.Features.TestParameters.Queries.List;
using FMDC.BussinessLayer.Features.TestParameters.Commands.Update;
using FMDC.BussinessLayer.Features.TestParameters.Commands.Create;
using FMDC.BussinessLayer.Features.TestParameters.Commands.Delete;

namespace FMDC.BussinessLayer.Services
{
    public class TestParameterService : ITestParameterService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public TestParameterService(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }


        public async Task<TestParameterViewModel?> GetTestParameter(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");
            var param = await _sender.Send(new GetTestParameterQuery(id)) ?? throw new FmdcException("Test Parameter could not be found");
            var viewModel = _mapper.Map<TestParameterViewModel>(param);
            return viewModel;
        }

        private async Task<PagedResults<TestParameterViewModel>> FetchTestParameters(DataFilter filter)
        {
            var testParams = await _sender.Send(new ListTestParameterQuery(filter));
            var data = _mapper.Map<IEnumerable<TestParameterViewModel>>(testParams.Data);

            return new PagedResults<TestParameterViewModel>(data, testParams.CurrentPage, testParams.TotalRecords, testParams.PageSize);
        }
        public async Task<PagedResults<TestParameterViewModel>> GetTestParameters(DataFilter filter)
        {

            return await FetchTestParameters(filter);
            


        }
        
        public async Task<IEnumerable<TestParameterViewModel>> GetTestParameters(int testId)
        {
            if (testId <= 0)
                throw new FmdcException("Id cannot be null");
            DataFilter filter = new()
            {
                Id = testId
            };
            return (await FetchTestParameters(filter)).Data;
        }

        public async Task<bool> Update(TestParameterViewModel viewmodel)
        {
            try
            {
                var testParameter = await _sender.Send(new GetTestParameterQuery(viewmodel.Id)) ?? throw new FmdcException("TestParameter could not be found");
                testParameter.Name = viewmodel.Name ?? "";

                testParameter.MaleMaxValue = viewmodel.MaleMaxValue;
                testParameter.MaleMinValue = viewmodel.MaleMinValue;
                testParameter.FemaleMaxValue = viewmodel.FemaleMaxValue;
                testParameter.FemaleMinValue = viewmodel.FemaleMinValue;
                testParameter.Unit = viewmodel.Unit ?? "";
                testParameter.TestId = viewmodel.TestId;
                testParameter.Gender = viewmodel.Gender;
                testParameter.ReferenceRange = viewmodel.ReferenceRange ?? "";
                return await _sender.Send(new UpdateTestParameterCommand(testParameter));
            }
            catch (Exception)
            {

                return false;
            }
        }

        public async Task<bool> Create(TestParameterViewModel viewmodel)
        {
            try
            {
                var model = _mapper.Map<TestParameter>(viewmodel);

                return await _sender.Send(new CreateTestParameterCommand(model));

            }
            catch (Exception)
            {

                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeleteTestParameterCommand(id));
            }
            catch (Exception)
            {

                return false;
            }
        }



    }
}
