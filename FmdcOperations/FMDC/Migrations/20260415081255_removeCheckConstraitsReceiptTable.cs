using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FMDC.Migrations
{
    /// <inheritdoc />
    public partial class removeCheckConstraitsReceiptTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_ReceiptDetails_ProcedureOrTest",
                table: "ReceiptDetails");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_ReceiptDetails_ProcedureOrTest",
                table: "ReceiptDetails",
                sql: "[ProcedureId] IS NOT NULL OR [TestId] IS NOT NULL");
        }
    }
}
