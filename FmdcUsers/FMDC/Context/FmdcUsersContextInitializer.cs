using Microsoft.EntityFrameworkCore;

namespace FMDC.Context
{
    public static class FmdcUsersContextInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new FmdcUsersContext(
                serviceProvider.GetRequiredService<
                    DbContextOptions<FmdcUsersContext>>());
            // Look for any movies.

        }
    }
}