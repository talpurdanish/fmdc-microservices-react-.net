using Microsoft.EntityFrameworkCore;

namespace FMDC.Context
{
    public static class FmdcOperationsContextInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new FmdcOperationsContext(
                serviceProvider.GetRequiredService<
                    DbContextOptions<FmdcOperationsContext>>());
            // Look for any movies.

        }
    }
}