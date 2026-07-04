using Domain.Viewmodels;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace FMDC.Reports
{
    public class LabReportComponent : IComponent
    {
        private readonly LabReportViewModel _LabReport;
        private readonly float _lineWidth = 0.2f;
        //private readonly string _path;
        public LabReportComponent(LabReportViewModel LabReport, float lineWidth)
        {
            //, string path
            _LabReport = LabReport;
            _lineWidth = lineWidth;
            //_path = path;
        }

        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().Component(new ReportHeaderComponent(_LabReport.ReportNoString, "TEST REPORT", _LabReport.ReportDate));
                column.Item().LineHorizontal(_lineWidth);
                column.Item().Element(ComposeInfoTable);
                column.Item().LineHorizontal(_lineWidth);
                column.Item().Element(ComposeDetailsTable);
            });
        }

        private void ComposeInfoTable(IContainer container)
        {

            var patientName = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0} (Mr No: {1})", _LabReport.PatientName, _LabReport.PatientNumber);
            var date = DateTime.Now.ToString("dd MMM, yyyy", System.Globalization.CultureInfo.InvariantCulture);
            container.Table(table =>
           {
               table.ColumnsDefinition(columns =>
               {
                   columns.RelativeColumn(1f);
                   columns.RelativeColumn(6f);
                   columns.RelativeColumn(1f);
                   columns.RelativeColumn(2f);

               });

               table.Cell().Element(CellStyle).Text("Patient:").SemiBold();
               table.Cell().Element(CellStyle).Text($"{_LabReport.PatientName}").Underline();
               table.Cell().Element(CellStyle).Text("MR No:").SemiBold();
               table.Cell().Element(CellStyle).Text($"{_LabReport.PatientNumber}").Underline();

               table.Cell().Element(CellStyle).Text("Age:").SemiBold();
               table.Cell().Element(CellStyle).Text($"{_LabReport.PatientAge}").Underline();
               table.Cell().Element(CellStyle).Text("Gender:").SemiBold();
               table.Cell().Element(CellStyle).Text($"{FormatGender(_LabReport.PatientGender)}").Underline();

               table.Cell().Element(CellStyle).Text("Doctor:").SemiBold();
               table.Cell().Element(CellStyle).Text($"Dr. {_LabReport.Doctor}").Underline();
               table.Cell().Element(CellStyle).Text("PMDC:").SemiBold();
               table.Cell().Element(CellStyle).Text($"{_LabReport.DoctorPMDCNo}").Underline();


               static IContainer CellStyle(IContainer container) => container.AlignLeft().PaddingVertical(6);

           });
        }

        private void ComposeDetailsTable(IContainer container)
        {
            var headerStyle = TextStyle.Default.SemiBold();
            container.ExtendVertical().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(1f);
                    columns.RelativeColumn(2.5f);
                    columns.RelativeColumn(1.5f);
                    columns.RelativeColumn(2.5f);
                    columns.RelativeColumn(2.5f);

                });
                table.Header(header =>
                {
                    header.Cell().AlignCenter().Text("#");
                    header.Cell().Text("Parameter").Style(headerStyle);
                    header.Cell().AlignCenter().Text("Value").Style(headerStyle);
                    header.Cell().Text("Range").Style(headerStyle);
                    header.Cell().Text("Reference").Style(headerStyle);

                    header.Cell().ColumnSpan(5).PaddingTop(5).BorderBottom(0.2f);
                });

                foreach (var item in _LabReport.TestParameters)
                {
                    var index = _LabReport.TestParameters.IndexOf(item) + 1;
                    var valid = CheckValidity(item.Value, item.MaleMaxValue, item.MaleMinValue, item.FemaleMaxValue, item.FemaleMinValue, _LabReport.PatientGender);
                    table.Cell().Element(CellStyle).AlignCenter().Text($"{index}").FontSize(10);
                    table.Cell().Element(CellStyle).Text($"{item.Name}").FontSize(10);
                    if (valid)
                        table.Cell().Element(CellStyle).AlignCenter().Text($"{item.Value}");
                    else
                        table.Cell().Element(CellStyle).AlignCenter().Text($"{item.Value}").SemiBold().Underline().FontColor(Colors.Red.Lighten1);
                    table.Cell().Element(CellStyle).Text($"{FormatRange(item.MaleMaxValue, item.MaleMinValue, item.FemaleMaxValue, item.FemaleMinValue, item.Gender)}").FontSize(8);
                    table.Cell().Element(CellStyle).Text($"{item.ReferenceRange}").FontSize(8);

                    static IContainer CellStyle(IContainer container) => container.BorderBottom(0.2f).PaddingVertical(5).AlignMiddle();
                }
                table.Footer(footer =>
               {
                   footer.Cell().ColumnSpan(5).ShowEntire().Padding(10).PaddingTop(20).Column(column =>
                        {
                            column.Spacing(5);
                            column.Item().PaddingBottom(15).Text("Note").FontSize(14).SemiBold();
                            column.Item().Text(_LabReport.Note);
                        });
               });

            });
        }

        private static bool CheckValidity(double value, double maleMax, double maleMin, double femaleMax, double femaleMin, string gender)
        {

            var valid = false;


            if (gender == "1")
            {
                valid = value >= femaleMin && value <= femaleMax;
            }
            else
            {
                valid = value >= maleMin && value <= maleMax;
            }
            return valid;
        }


        private static string FormatRange(double maleMax, double maleMin, double femaleMax, double femaleMin, bool gender)
        {
            var mmin = maleMin.ToString("0.####", System.Globalization.CultureInfo.InvariantCulture);
            var mmax = maleMax.ToString("0.####", System.Globalization.CultureInfo.InvariantCulture);
            var fmin = femaleMin.ToString("0.####", System.Globalization.CultureInfo.InvariantCulture);
            var fmax = femaleMax.ToString("0.####", System.Globalization.CultureInfo.InvariantCulture);


            var common = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0} - {1}", mmin, mmax);
            var strMale = string.Format(System.Globalization.CultureInfo.InvariantCulture, "Male: ({0} - {1})", mmin, mmax);
            var strFemale = string.Format(System.Globalization.CultureInfo.InvariantCulture, " Female: ({0} - {1})", fmin, fmax);


            return !gender ? common : strMale + strFemale;
        }


        private static string FormatGender(string gender)
        {

            return gender == "0" ? "Male" : gender == "1" ? "Female" : "Other";
        }
    }
}
