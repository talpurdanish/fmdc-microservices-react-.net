using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Appointments.Commands.AddEndDate
{
    public class AddEndDateCommandHandler(FmdcOperationsContext context) : IRequestHandler<AddEndDateCommand, bool>
    {
        public async Task<bool> Handle(AddEndDateCommand request, CancellationToken cancellationToken)
        {
            if (request.Id <= 0)
            {
                throw new FmdcException("Id is not valid");
            }

            var currentDate = DateTime.Now;
            Appointment? model;
            if (request.Type == "a")
            {
                model = await context.Appointments.FirstOrDefaultAsync(a => a.Id == request.Id && a.EndDate == null, cancellationToken);
            }
            else
            {
                model = await context.Appointments.FirstOrDefaultAsync(a => a.PatientId == request.Id && a.EndDate == null, cancellationToken);
            }

            if (model == null)
            {
                throw new FmdcException("Appointment could not be found");
            }
            model.EndDate = currentDate;
            model.EndTime = TimeOnly.FromDateTime(currentDate);
            context.Appointments.Update(model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);

            return rowsChanged > 0;

        }
    }
}
