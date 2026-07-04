using Domain.Viewmodels;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace FMDC.Reports
{
    public class PdfReportGenerator
    {
        private const float _lineWidth = 0.2f;
        private string _path = "";
        public PdfReportGenerator()
        {

        }
        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public bool Generate(string path, ReportType type, bool includePrescription = false)
        {
            try
            {

                if (type is null || type.Model is null)
                    return false;
                else
                {
                    _path = path;
                    var document = Document.Create(container =>
                       {
                           container
                               .Page(page =>
                               {

                                   page.Size(type.Width, type.Height, Unit.Millimetre);
                                   page.MarginTop(0.5f, Unit.Inch);
                                   page.MarginBottom(0.5f, Unit.Inch);
                                   page.MarginLeft(0.5f, Unit.Inch);
                                   page.MarginRight(0.5f, Unit.Inch);
                                   page.PageColor(Colors.White);
                                   page.Header().Component(new HeaderComponent(path));
                                   page.Content().Layers(layers =>
                                    {
                                        // layer below main content
                                        layers
                                            .Layer()
                                            .AlignCenter()
                                            .AlignMiddle()
                                            .Width(400)
                                            .Image(path + "/watermark.png");
                                        layers
                                            .Layer()
                                            .Rotate(-45)
                                            .AlignCenter()
                                            .AlignMiddle()
                                            .Height(PageSizes.A4.Height - 100)
                                            .Text("NOT FOR COURT USE")
                                            .SemiBold()
                                            .FontSize(70)
                                            .FontColor(Colors.Grey.Lighten3);
                                        if (type.Model is SlipViewModel model)
                                        {
                                            layers
                                                    .PrimaryLayer()
                                                    .Component(new SlipComponent(model, _lineWidth, _path, includePrescription));
                                        }
                                        else if (type.Model is ReceiptViewModel model1)
                                        {
                                            layers
                                            .PrimaryLayer()
                                            .Component(new ReceiptComponent(model1, _lineWidth));


                                        }
                                        else if (type.Model is LabReportViewModel model2)
                                        {
                                            layers
                                            .PrimaryLayer()
                                            .Component(new LabReportComponent(model2, _lineWidth));


                                        }
                                    });
                                   page.Footer().Component(new FooterComponent(_lineWidth));
                               });
                       });
                    document.GeneratePdf(path + "/" + type.Filename);
                    //document.ShowInPreviewer();
                    return true;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
                return false;
            }
        }


    }

    public class AddressComponent : IComponent
    {
        private readonly string _address = "";
        private readonly string _phoneNo = "";


        public AddressComponent(string address, string phoneNo)
        {
            _address = address;
            _phoneNo = phoneNo;
        }

        public void Compose(IContainer container)
        {
            container.ShowEntire().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(7);
                            columns.RelativeColumn(3);

                        });

                        table.Cell().AlignLeft().Text(_address);
                        table.Cell().AlignLeft().Text(_phoneNo).FontSize(10).Italic().SemiBold();

                    });
        }
    }

    public class FooterComponent : IComponent
    {
        private readonly float _lineWidth = 0.2f;
        private readonly string _generatedOnText = "Generated on " + DateTime.Now.ToString("dd-MMM-yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture) + " hrs";

        public FooterComponent(float lineWidth)
        {
            _lineWidth = lineWidth;
        }

        public void Compose(IContainer container)
        {
            container.ShowEntire().Table(table =>
                   {
                       table.ColumnsDefinition(columns =>
                       {
                           columns.RelativeColumn(7);
                           columns.RelativeColumn(3);

                       });
                       table.Cell().ColumnSpan(2).LineHorizontal(_lineWidth);
                       table.Cell().AlignLeft().Text(_generatedOnText).FontSize(8);
                       table.Cell().AlignRight().Text(text =>
                      {
                          text.CurrentPageNumber().FontSize(8);
                          text.Span(" / ").FontSize(8);
                          text.TotalPages().FontSize(8);
                      });

                   });
        }
    }

    public class HeaderComponent : IComponent
    {

        private const string _title = "FEDERAL MEDICAL AND DENTAL CENTER";
        private const string _address = "123 Main Street, I-14/1, Main Road";
        private const string _phoneNo = "Phone No: (051)4447654";

        private readonly string _path = "";

        public HeaderComponent(string path)
        {
            _path = path;
        }

        public void Compose(IContainer container)
        {
            container.Row(row =>
            {
                //row.RelativeItem().Column(column =>
                //{
                //    column
                //        .Item().Image("logo.png");
                //});
                row.ConstantItem(50).Height(50).Image(_path + "/logo.png");
                row.RelativeItem().PaddingLeft(5).Column(column =>
                {
                    column.Item().Text($"{_title}")
                        .FontSize(20).SemiBold();
                    column.Spacing(10);
                    column.Item().Row(row =>
                    {
                        row.RelativeItem().Component(new AddressComponent(_address, _phoneNo));
                    });
                    column.Spacing(10);
                });



            });
        }
    }

    public class DateAndNoComponent : IComponent
    {
        private readonly string _no = "";
        public DateAndNoComponent(string no)
        {
            _no = no;
        }
        public void Compose(IContainer container)
        {
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

               table.Cell().ColumnSpan(3).Element(CellStyle).AlignLeft().Text(text =>
               {
                   text.Span("No: ").SemiBold();
                   text.Span($"{_no}").Underline();
               });

               table.Cell().ColumnSpan(6);

               table.Cell().ColumnSpan(3).Element(CellStyle).AlignRight().Text(text =>
               {
                   text.Span("Dated: ").SemiBold();
                   text.Span($"{date}").Underline();
               });

               static IContainer CellStyle(IContainer container) => container.PaddingVertical(8);

           });
        }
    }

    public class ReportHeaderComponent : IComponent
    {
        private readonly string _no = "";
        private readonly string _title = "";
        private readonly string _date = "";
        public ReportHeaderComponent(string no, string title, string date = "")
        {
            _no = no;
            _title = title;
            _date = date;
        }
        public void Compose(IContainer container)
        {
            var date = _date == "" ? DateTime.Now.ToString("dd MMM, yyyy", System.Globalization.CultureInfo.InvariantCulture) : _date;
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

               table.Cell().ColumnSpan(3).Element(CellStyle).AlignLeft().Text(text =>
               {
                   text.Span("No: ").SemiBold();
                   text.Span($"{_no}").Underline();
               });

               table.Cell().ColumnSpan(6).Element(CellStyle).AlignCenter().Border(1).Padding(5).Shrink().Text(_title).Bold();

               table.Cell().ColumnSpan(3).Element(CellStyle).AlignRight().Text(text =>
               {
                   text.Span("Dated: ").SemiBold();
                   text.Span($"{date}").Underline();
               });

               static IContainer CellStyle(IContainer container) => container.PaddingVertical(8);

           });
        }
    }

    public class ReportType
    {
        public string Filename { get; set; } = "";
        public float Height { get; set; }
        public float Width { get; set; }
        public ViewmodelBase Model { get; set; } = new ViewmodelBase();

        public ReportType(string filename, float height, float width, ViewmodelBase model)
        {
            Filename = filename;
            Height = height;
            Width = width;
            Model = model;
        }
    }
}