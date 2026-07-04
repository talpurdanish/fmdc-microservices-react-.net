using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FMDC.Migrations
{
    /// <inheritdoc />
    public partial class updateAnnotations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicationTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProcedureTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProcedureTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Medications",
                columns: table => new
                {
                    Code = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: false),
                    MedicationTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medications", x => x.Code);
                    table.ForeignKey(
                        name: "FK_Medications_MedicationTypes_MedicationTypeId",
                        column: x => x.MedicationTypeId,
                        principalTable: "MedicationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Procedures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Cost = table.Column<double>(type: "float", nullable: false),
                    ProcedureTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Procedures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Procedures_ProcedureTypes_ProcedureTypeId",
                        column: x => x.ProcedureTypeId,
                        principalTable: "ProcedureTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    ReceiptId = table.Column<int>(type: "int", nullable: true),
                    ReceiptId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Prescriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    Diagnosis = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Bp = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Pulse = table.Column<double>(type: "float", nullable: false),
                    Bsr = table.Column<double>(type: "float", nullable: false),
                    Temp = table.Column<double>(type: "float", nullable: false),
                    Wt = table.Column<double>(type: "float", nullable: false),
                    Ht = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Receipts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "getdate()"),
                    Time = table.Column<TimeOnly>(type: "time", nullable: false),
                    Discount = table.Column<double>(type: "float", nullable: false),
                    AuthorizedById = table.Column<int>(type: "int", nullable: false),
                    Paid = table.Column<bool>(type: "bit", nullable: false),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    GrandTotal = table.Column<double>(type: "float", nullable: false),
                    Total = table.Column<double>(type: "float", nullable: false),
                    StripePaymentIntentId = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Receipts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Receipts_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PrescriptionMedications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity = table.Column<double>(type: "float", nullable: false),
                    Units = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Times = table.Column<int>(type: "int", nullable: false),
                    MedicationCode = table.Column<int>(type: "int", nullable: false),
                    PrescriptionId = table.Column<int>(type: "int", nullable: false),
                    PrescriptionId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionMedications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrescriptionMedications_Medications_MedicationCode",
                        column: x => x.MedicationCode,
                        principalTable: "Medications",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PrescriptionMedications_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PrescriptionMedications_Prescriptions_PrescriptionId1",
                        column: x => x.PrescriptionId1,
                        principalTable: "Prescriptions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Tests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Cost = table.Column<double>(type: "float", nullable: false),
                    PrescriptionId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tests_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "LabReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportDate = table.Column<DateTime>(type: "date", nullable: false),
                    ReportTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ReportDeliveryDate = table.Column<DateTime>(type: "date", nullable: false),
                    ReportDeliveryTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    TestId = table.Column<int>(type: "int", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: false),
                    ReportNumber = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    PrescriptionId = table.Column<int>(type: "int", nullable: true),
                    PrescriptionId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LabReports_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LabReports_Prescriptions_PrescriptionId1",
                        column: x => x.PrescriptionId1,
                        principalTable: "Prescriptions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LabReports_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReceiptDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReceiptId = table.Column<int>(type: "int", nullable: false),
                    ProcedureId = table.Column<int>(type: "int", nullable: false),
                    TestId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReceiptDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReceiptDetails_Procedures_ProcedureId",
                        column: x => x.ProcedureId,
                        principalTable: "Procedures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReceiptDetails_Receipts_ReceiptId",
                        column: x => x.ReceiptId,
                        principalTable: "Receipts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReceiptDetails_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TestParameters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    MaleMaxValue = table.Column<double>(type: "float", nullable: false),
                    MaleMinValue = table.Column<double>(type: "float", nullable: false),
                    FemaleMaxValue = table.Column<double>(type: "float", nullable: false),
                    FemaleMinValue = table.Column<double>(type: "float", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    TestId = table.Column<int>(type: "int", nullable: false),
                    ReferenceRange = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Gender = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestParameters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestParameters_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReportValues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(type: "float", nullable: false),
                    TestParameterId = table.Column<int>(type: "int", nullable: false),
                    LabReportId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReportValues_LabReports_LabReportId",
                        column: x => x.LabReportId,
                        principalTable: "LabReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReportValues_TestParameters_TestParameterId",
                        column: x => x.TestParameterId,
                        principalTable: "TestParameters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ReceiptId",
                table: "Appointments",
                column: "ReceiptId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ReceiptId1",
                table: "Appointments",
                column: "ReceiptId1");

            migrationBuilder.CreateIndex(
                name: "IX_LabReports_PrescriptionId",
                table: "LabReports",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_LabReports_PrescriptionId1",
                table: "LabReports",
                column: "PrescriptionId1");

            migrationBuilder.CreateIndex(
                name: "IX_LabReports_TestId",
                table: "LabReports",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_Medications_MedicationTypeId",
                table: "Medications",
                column: "MedicationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionMedications_MedicationCode",
                table: "PrescriptionMedications",
                column: "MedicationCode");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionMedications_PrescriptionId",
                table: "PrescriptionMedications",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionMedications_PrescriptionId1",
                table: "PrescriptionMedications",
                column: "PrescriptionId1");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_AppointmentId",
                table: "Prescriptions",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Procedures_ProcedureTypeId",
                table: "Procedures",
                column: "ProcedureTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ReceiptDetails_ProcedureId",
                table: "ReceiptDetails",
                column: "ProcedureId");

            migrationBuilder.CreateIndex(
                name: "IX_ReceiptDetails_ReceiptId",
                table: "ReceiptDetails",
                column: "ReceiptId");

            migrationBuilder.CreateIndex(
                name: "IX_ReceiptDetails_TestId",
                table: "ReceiptDetails",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_AppointmentId",
                table: "Receipts",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportValues_LabReportId",
                table: "ReportValues",
                column: "LabReportId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportValues_TestParameterId",
                table: "ReportValues",
                column: "TestParameterId");

            migrationBuilder.CreateIndex(
                name: "IX_TestParameters_TestId",
                table: "TestParameters",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_Tests_PrescriptionId",
                table: "Tests",
                column: "PrescriptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Receipts_ReceiptId",
                table: "Appointments",
                column: "ReceiptId",
                principalTable: "Receipts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Receipts_ReceiptId1",
                table: "Appointments",
                column: "ReceiptId1",
                principalTable: "Receipts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Receipts_ReceiptId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Receipts_ReceiptId1",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "PrescriptionMedications");

            migrationBuilder.DropTable(
                name: "ReceiptDetails");

            migrationBuilder.DropTable(
                name: "ReportValues");

            migrationBuilder.DropTable(
                name: "Medications");

            migrationBuilder.DropTable(
                name: "Procedures");

            migrationBuilder.DropTable(
                name: "LabReports");

            migrationBuilder.DropTable(
                name: "TestParameters");

            migrationBuilder.DropTable(
                name: "MedicationTypes");

            migrationBuilder.DropTable(
                name: "ProcedureTypes");

            migrationBuilder.DropTable(
                name: "Tests");

            migrationBuilder.DropTable(
                name: "Prescriptions");

            migrationBuilder.DropTable(
                name: "Receipts");

            migrationBuilder.DropTable(
                name: "Appointments");
        }
    }
}
