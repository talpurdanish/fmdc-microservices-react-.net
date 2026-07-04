using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FMDC.Migrations
{
    /// <inheritdoc />
    public partial class improvedNullChecksInReceiptTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TestId",
                table: "ReceiptDetails",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ProcedureId",
                table: "ReceiptDetails",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ReceiptDetails_ProcedureOrTest",
                table: "ReceiptDetails",
                sql: "[ProcedureId] IS NOT NULL OR [TestId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_ReceiptDetails_ProcedureOrTest",
                table: "ReceiptDetails");

            migrationBuilder.AlterColumn<int>(
                name: "TestId",
                table: "ReceiptDetails",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProcedureId",
                table: "ReceiptDetails",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
