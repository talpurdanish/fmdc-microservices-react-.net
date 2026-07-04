using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FMDC.Context
{
    public class FmdcOperationsContextFactory : IDesignTimeDbContextFactory<FmdcOperationsContext>
    {
        public FmdcOperationsContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<FmdcOperationsContext>();
            optionsBuilder.UseSqlServer("Data Source=TALPUR-PC;Initial Catalog=FmdcOperationsContext;Integrated Security=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Encrypt=False");
            
            return new FmdcOperationsContext(optionsBuilder.Options);
        }
    }
}
