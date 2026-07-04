using Domain.Helpers;
using Domain.Models;
using FMDC.BussinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FMDC.BussinessLayer.RabbitMQ
{
    public class RpcMessageHandler(IUserService userService, IPatientService patientService, ICityService cityService)
    {
        private readonly IUserService _userService = userService;
        private readonly IPatientService _patientService = patientService;
        private readonly ICityService _cityService = cityService;

        public async Task<JsonResult> Handle(string message)
        {
            try
            {
                if (message == null)
                    return FmdcResult.Error("Message is null", 404);
                var messageParts = message.Split(':');
                if (messageParts.Length != 2)
                    return FmdcResult.Error("Invalid message format", 400);
                var method = messageParts[0];
                var parameterIsNumber = int.TryParse(messageParts[1], out int id);

                if (!parameterIsNumber)
                    return FmdcResult.Error("Parameter is not a valid number", 400);
                switch (method)
                {
                    case "GetUser":
                        var user = await _userService.GetUser(id);
                        if (user == null || user!.Name == Roles.Administrator)
                        {
                            return FmdcResult.Error("User does not exists", 500);
                        }
                        return FmdcResult.Success(user, 200);

                    case "GetPatient":
                        var patient = await _patientService.GetPatient(id);
                        return FmdcResult.Success("", patient, 200);
                    case "GetCity":
                        var cities = await _cityService.GetCity(id);
                        return FmdcResult.Success("", cities, 200);
                    default:
                        return FmdcResult.Error("Unknown method", 400);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("User does not exists", 500);
            }
        }
    }
}
