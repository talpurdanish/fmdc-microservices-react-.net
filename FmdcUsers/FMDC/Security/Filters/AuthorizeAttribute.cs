using Domain.Helpers;
using Domain.Viewmodels.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FMDC.Security.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : TypeFilterAttribute
    {
        public AuthorizeAttribute(params Roles[] claim) : base(typeof(AuthorizeFilter))
        {
            Arguments = [claim];
        }
    }

    public class AuthorizeFilter : IAuthorizationFilter
    {
        readonly Roles[] _claim;

        public AuthorizeFilter(params Roles[] claim)
        {
            _claim = claim;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (context.Filters.Any(item => item is IAllowAnonymousFilter))
            {
                return;
            }

            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous)
                return;

            if (context.HttpContext.Items["User"] is UserViewModel user)
            {
                bool flagClaim = false;
                foreach (var item in _claim)
                {
                    flagClaim = user.Role == item;
                    if (flagClaim)
                        break;
                }

                if (!flagClaim)
                {
                    context.Result = new JsonResult(new { message = "Unauthorized" })
                    { StatusCode = StatusCodes.Status401Unauthorized };
                }
            }
            else
            {
                context.Result = new JsonResult(new { message = "Unauthorized" })
                { StatusCode = StatusCodes.Status401Unauthorized };
            }
            return;
        }
    }
}
