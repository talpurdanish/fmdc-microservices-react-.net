using Microsoft.AspNetCore.Mvc;

namespace Domain.Helpers
{
    public static class FmdcResult
    {
        public static JsonResult Success( object? results, int statusCode)
        {
            return new JsonResult(new
            {

                error = false,
                message = "",
                code = statusCode,
                results
            });

        }

        public static JsonResult Success(string message, object? results, int statusCode)
        {
            return new JsonResult(new
            {

                error = false,
                message,
                code = statusCode,
                results
            });

        }

        public static JsonResult Success(string message, int statusCode)
        {
            return new JsonResult(new
            {
                error = false,
                message,
                code = statusCode,
                results = ""
            });

        }

        public static JsonResult Error(string message, int statusCode)
        {
            IList<int> codes = new List<int> { 200, 201, 400, 401, 404, 403, 422, 500 };

            // Get matched code
            var findCode = codes.Any((code) => code == statusCode);

            if (!findCode) statusCode = 500;


            return new JsonResult(new
            {
                message,
                error = true,
                statusCode,
            });
        }
    }
}
