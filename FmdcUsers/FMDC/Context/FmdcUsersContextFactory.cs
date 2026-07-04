using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FMDC.Context
{
    public class FmdcUsersContextFactory : IDesignTimeDbContextFactory<FmdcUsersContext>
    {
        public FmdcUsersContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<FmdcUsersContext>();
            optionsBuilder.UseSqlServer("Data Source=TALPUR-PC;Initial Catalog=FmdcUsersContext;Integrated Security=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Encrypt=False");
            return new FmdcUsersContext(optionsBuilder.Options);
        }
    }
}
