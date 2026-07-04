using Domain.Viewmodels;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;


namespace FMDC.Reports
{
    public class ReceiptComponent : IComponent
    {
        private readonly ReceiptViewModel _receipt;
        private readonly float _lineWidth = 0.2f;
        //private readonly string _path;
        public ReceiptComponent(ReceiptViewModel receipt, float lineWidth)
        {
            //, string path
            _receipt = receipt;
            _lineWidth = lineWidth;
            //_path = path;
        }

        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().Component(new ReportHeaderComponent(_receipt.ReceiptNumber, "Receipt", DateTime.Now.ToString("dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture)));
                column.Item().LineHorizontal(_lineWidth);
                column.Item().Element(ComposeInfoTable);
                column.Item().LineHorizontal(_lineWidth);
                column.Item().Element(ComposeDetailsTable);
            });
        }

        private void ComposeInfoTable(IContainer container)
        {

            var patientName = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0} (Mr No: {1})", _receipt.PatientName, _receipt.PatientNumber);
            var date = DateTime.Now.ToString("dd MMM, yyyy", System.Globalization.CultureInfo.InvariantCulture);
            container.Table(table =>
           {
               table.ColumnsDefinition(columns =>
               {
                   columns.RelativeColumn(1.5f);
                   columns.RelativeColumn(3.5f);
                   columns.RelativeColumn(1.5f);
                   columns.RelativeColumn(3.5f);

               });

               table.Cell().Element(CellStyle).Text("Patient:").SemiBold();
               table.Cell().ColumnSpan(3).Element(CellStyle).Text($"{patientName}").Underline();

               table.Cell().Element(CellStyle).Text("Date:").SemiBold();
               table.Cell().Element(CellStyle).Text($"{_receipt.Date} {_receipt.Time}").Underline();
               table.Cell().Element(CellStyle).Text("Doctor:").SemiBold();
               table.Cell().Element(CellStyle).Text($"Dr. {_receipt.Doctor}").Underline();

               table.Cell().Element(CellStyle).Text("Grand Total:").SemiBold();
               table.Cell().Element(CellStyle).Text($"{FormatCurrency(_receipt.GrandTotal)}").Underline();
               table.Cell().Element(CellStyle).Text("Visit:").SemiBold();
               table.Cell().Element(CellStyle).Text($"{_receipt.Appointment}").Underline();


               static IContainer CellStyle(IContainer container) => container.AlignLeft().PaddingVertical(6);

           });
        }

        private void ComposeDetailsTable(IContainer container)
        {
            var headerStyle = TextStyle.Default.SemiBold();
            var authorizedBy = string.IsNullOrEmpty(_receipt.AuthorizedBy) ? "" : "Dr. " + _receipt.AuthorizedBy;
            container.Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(2f);
                    columns.RelativeColumn(2f);
                    columns.RelativeColumn(5f);
                    columns.RelativeColumn(3f);

                });
                table.Header(header =>
                {
                    header.Cell().Text("#");
                    header.Cell().Text("Type").Style(headerStyle);
                    header.Cell().Text("Detail").Style(headerStyle);
                    header.Cell().AlignRight().Text("Cost").Style(headerStyle);
                    header.Cell().ColumnSpan(4).PaddingTop(5).BorderBottom(0.2f).BorderColor(Colors.Black);
                });


                foreach (var item in _receipt.Items)
                {
                    var index = _receipt.Items.IndexOf(item) + 1;

                    table.Cell().Element(CellStyle).Text($"{index}");
                    string type = item.Type == DetailType.procedure ? "Procedure" : "Test";
                    table.Cell().Element(CellStyle).Text(type);
                    table.Cell().Element(CellStyle).Text(item.Detail);
                    table.Cell().Element(CellStyle).AlignRight().Text($"{FormatCurrency(item.Cost)}");
                }

                // Shared cell style
                static IContainer CellStyle(IContainer container) =>
                    container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);

                table.Footer(footer =>
                {
                    footer.Cell().ColumnSpan(4).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(30f);
                            columns.RelativeColumn(35f);
                            columns.RelativeColumn(15f);
                            columns.RelativeColumn(20f);

                        });



                        if (!_receipt.Paid)
                        {
                            table.Cell();
                            table.Cell();
                            table.Cell().Element(CellStyle).Text("Total.:").SemiBold();
                            table.Cell().Element(CellStyle).Text($"{FormatCurrency(_receipt.Total)}");
                            table.Cell();
                            table.Cell();
                            table.Cell().Element(CellStyle).Text("Discount:").SemiBold();
                            table.Cell().Element(CellStyle).AlignRight().Text($"{_receipt.Discount}%");
                        }
                        else
                        {
                            //table.Cell();
                            table.Cell().ColumnSpan(2).RowSpan(2).AlignCenter().AlignMiddle().Element(CellStyle).Border(1).BorderColor(Colors.Red.Lighten1).Shrink().Padding(5).AlignCenter().Text($"This receipt has been PAID in full").ExtraBold().FontColor(Colors.Red.Darken1);
                            table.Cell().Element(CellStyle).Text("Total.:").SemiBold();
                            table.Cell().Element(CellStyle).Text($"{FormatCurrency(_receipt.Total)}");
                            table.Cell().Element(CellStyle).Text("Discount:").SemiBold();
                            table.Cell().Element(CellStyle).AlignRight().Text($"{_receipt.Discount}%");
                        }

                        if (!string.IsNullOrEmpty(_receipt.AuthorizedBy))
                        {
                            table.Cell().Element(CellStyle).AlignRight().Text("Discount Authorized By").SemiBold();
                            table.Cell().Element(CellStyle).Border(1).Shrink().Padding(5).Text($"{authorizedBy}");
                        }
                        else
                        {
                            table.Cell().Element(CellStyle).Text("");
                            table.Cell().Element(CellStyle).Text("");
                        }
                        table.Cell().Element(CellStyle).Text("Grand Total:").SemiBold();
                        table.Cell().Element(CellStyle).Border(1).Shrink().Background(Colors.Grey.Lighten2).Padding(5).Text($"{FormatCurrency(_receipt.GrandTotal)}");


                        static IContainer CellStyle(IContainer container) => container.AlignLeft().AlignMiddle().Padding(5);

                    });
                });
            });
        }


        public string FormatCurrency(double value)
        {
            return "PKR " + value.ToString("F2", System.Globalization.CultureInfo.InvariantCulture);
        }


    }
}