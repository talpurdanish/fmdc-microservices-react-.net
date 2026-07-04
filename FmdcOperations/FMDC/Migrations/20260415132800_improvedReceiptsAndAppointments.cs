using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FMDC.Migrations
{
    /// <inheritdoc />
    public partial class improvedReceiptsAndAppointments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReceiptId1",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ReceiptId1",
                table: "Appointments",
                column: "ReceiptId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Receipts_ReceiptId1",
                table: "Appointments",
                column: "ReceiptId1",
                principalTable: "Receipts",
                principalColumn: "Id");
        }
    }
}
