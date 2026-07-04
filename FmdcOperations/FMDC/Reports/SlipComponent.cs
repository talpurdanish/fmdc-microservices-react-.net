using Domain.Viewmodels;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;


namespace FMDC.Reports
{
    public class SlipComponent : IComponent
    {

        private readonly SlipViewModel _slip;
        private readonly float _lineWidth = 0.2f;
        private readonly string _path;
        private readonly bool _includePrescription;
        public SlipComponent(SlipViewModel slip, float lineWidth, string path, bool includePrescription = false)
        {
            _slip = slip;
            _lineWidth = lineWidth;
            _path = path;
            _includePrescription = includePrescription;
        }

        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().Component(new ReportHeaderComponent(_slip.Number, "Patient Slip", new DateTime().ToString("dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture)));
                column.Item().LineHorizontal(_lineWidth);
                column.Item().Element(ComposeSlipInfoTable);
                column.Item().LineHorizontal(_lineWidth);
                column.Item().Element(ComposeSlipSidebarTable);
            });
        }

        private void ComposeSlipInfoTable(IContainer container)
        {

            var patientName = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0} (Mr No: {1})", _slip.Name, _slip.PatientNumber);
            var date = DateTime.Now.ToString("dd MMM, yyyy", System.Globalization.CultureInfo.InvariantCulture);
            container.Table(table =>
           {
               table.ColumnsDefinition(columns =>
               {
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
                   columns.RelativeColumn();
               });

               table.Cell().ColumnSpan(2).Element(CellStyle).Text("Patient Name:").SemiBold();
               table.Cell().ColumnSpan(4).Element(CellStyle).Text($"{patientName}").Underline();
               table.Cell().ColumnSpan(3).Element(CellStyle).Text("Father/Husband:").SemiBold();
               table.Cell().ColumnSpan(3).Element(CellStyle).Text($"{_slip.FatherName}").Underline();

               table.Cell().ColumnSpan(1).Element(CellStyle).Text("Phone:").SemiBold();
               table.Cell().ColumnSpan(2).Element(CellStyle).Text($"{_slip.PhoneNo}").Underline();
               table.Cell().ColumnSpan(2).Element(CellStyle).Text("Bloodgroup:").SemiBold();
               table.Cell().ColumnSpan(1).Element(CellStyle).Text($"{_slip.BloodGroup}").Underline();
               table.Cell().ColumnSpan(1).Element(CellStyle).Text("Age:").SemiBold();
               table.Cell().ColumnSpan(5).Element(CellStyle).Text($"{_slip.Age}").Underline();

               table.Cell().ColumnSpan(2).Element(CellStyle).Text("Doctor:").SemiBold();
               table.Cell().ColumnSpan(3).Element(CellStyle).Text($"{_slip.Doctor}").Underline();
               table.Cell().ColumnSpan(2).Element(CellStyle).Text("Address:").SemiBold();
               table.Cell().ColumnSpan(5).Element(CellStyle).Text($"{_slip.Address}").Underline();

               static IContainer CellStyle(IContainer container) => container.AlignLeft().PaddingVertical(6);

           });
        }

        private void ComposeSlipSidebarTable(IContainer container)
        {

            container.Table(table =>
                   {
                       table.ColumnsDefinition(columns =>
                       {
                           columns.RelativeColumn(3.3f);
                           columns.RelativeColumn(6.7f);
                       });
                       table.Cell().PaddingRight(5).Table(table =>
                       {
                           table.ColumnsDefinition(columns =>
                           {
                               columns.RelativeColumn(1.5f);
                               columns.RelativeColumn(2.5f);
                               columns.RelativeColumn(2f);
                               columns.RelativeColumn(2.5f);
                           });
                           table.Cell().ColumnSpan(4).PaddingVertical(10).Text("Parameters:").Underline().SemiBold();
                           table.Cell().Element(CellStyle).Text("BP:");
                           table.Cell().BorderBottom(_lineWidth).Text($"{FormatVitals(_includePrescription, _slip.Bp)}");
                           table.Cell().Element(CellStyle).Text("Pulse:");
                           table.Cell().BorderBottom(_lineWidth).Text($"{FormatVitals(_includePrescription, _slip.Pulse)}");

                           table.Cell().Element(CellStyle).Text("BSR:");
                           table.Cell().BorderBottom(_lineWidth).Text($"{FormatVitals(_includePrescription, _slip.Bsr)}");
                           table.Cell().Element(CellStyle).Text("Temp:");
                           table.Cell().BorderBottom(_lineWidth).Text($"{FormatVitals(_includePrescription, _slip.Temp)}");

                           table.Cell().Element(CellStyle).Text("Wt:");
                           table.Cell().BorderBottom(_lineWidth).Text($"{FormatVitals(_includePrescription, _slip.Wt)}");
                           table.Cell().Element(CellStyle).Text("Ht:");
                           table.Cell().BorderBottom(_lineWidth).Text($"{FormatVitals(_includePrescription, _slip.Ht)}");
                       });
                       if (!_includePrescription)
                       {
                           table.Cell().ExtendVertical().Padding(5).BorderLeft(_lineWidth).Element(
                               ele =>
                               {

                                   ele.Width(15, Unit.Point)
                                       .PaddingTop(20)
                                       .PaddingLeft(15)
                                       .Image(_path + "/rx.jpg");
                               });
                       }
                       else
                       {
                           table.Cell().ExtendVertical().Padding(5).BorderLeft(_lineWidth).Element(
                            ele =>
                            {
                                ele.Table(table =>
                                    {
                                        table.ColumnsDefinition(columns =>
                                        {
                                            columns.RelativeColumn(0.7f);
                                            columns.RelativeColumn(0.3f);
                                        });
                                        table.Cell().ColumnSpan(2).Element(CellStyle1).Width(15, Unit.Point)
                                        .PaddingTop(10)
                                        .PaddingLeft(5)
                                        .Image(_path + "/rx.jpg");
                                        table.Cell().ColumnSpan(2).Element(CellStyle1).Text("Diagnosis:").SemiBold().Underline();
                                        table.Cell().ColumnSpan(2).Element(CellStyle1).PaddingTop(5).Text($"{_slip.Diagnosis}");

                                        table.Cell().ColumnSpan(2).Element(CellStyle1).PaddingTop(5).Text("Clinical Remarks:").SemiBold().Underline();
                                        table.Cell().ColumnSpan(2).Element(CellStyle1).PaddingTop(5).Text($"{_slip.Remarks}");
                                        table.Cell().ColumnSpan(2).Element(CellStyle1).PaddingTop(5).Text("Medications:").SemiBold().Underline();

                                        if (_slip.Medstrings.Count > 0)
                                        {
                                            foreach (var medString in _slip.Medstrings)
                                            {
                                                table.Cell().ColumnSpan(2).Element(CellStyle1).PaddingTop(5).Text(medString.ToString());
                                            }
                                        }
                                        table.Cell().ColumnSpan(2).Element(CellStyle1).PaddingTop(5).Text("Tests Advised:").SemiBold().Underline();
                                        if (_slip.Tests.Count > 0)
                                        {
                                            foreach (var test in _slip.Tests)
                                            {
                                                table.Cell().ColumnSpan(2).Element(CellStyle1).PaddingTop(5).Text(test);
                                            }
                                        }
                                    });
                            });
                       }


                   });
            static IContainer CellStyle(IContainer container) => container.AlignLeft().PaddingLeft(3).AlignBottom();
            static IContainer CellStyle1(IContainer container) => container.AlignLeft().Padding(5).AlignMiddle();
        }


        private static string FormatVitals(bool pres, double value)
        {
            return pres ? value.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture) : "";
        }
        private static string FormatVitals(bool pres, string value)
        {
            return pres ? value : "";
        }
    }
}