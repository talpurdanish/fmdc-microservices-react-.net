using dotenv.net;
using FMDC.BussinessLayer.Clients;
using FMDC.Context;
using FMDC.Helpers;
using FMDC.BussinessLayer.Interfaces;
using FMDC.BussinessLayer.Services;
using FMDC.Profiles;

using FMDC.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Infrastructure;
using Stripe;
//using System.Web.Http;


DotEnv.Load();
QuestPDF.Settings.License = LicenseType.Community;
var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
var services = builder.Services;
//var env = builder.Environment;

services.AddHttpLogging(logging =>
{
    logging.LoggingFields = HttpLoggingFields.All;
    logging.RequestHeaders.Add("sec-ch-ua");
    logging.ResponseHeaders.Add("MyResponseHeader");
    logging.MediaTypeOptions.AddText("application/javascript");
    logging.RequestBodyLogLimit = 4096;
    logging.ResponseBodyLogLimit = 4096;

});

services.AddDbContext<FmdcOperationsContext>(options =>
    options.UseSqlServer("name=ConnectionStrings:DefaultConnection"));

services.AddSession(options =>
{
    options.Cookie.Name = ".fmdc.Session";
    options.IdleTimeout = TimeSpan.FromSeconds(300);
    options.Cookie.IsEssential = true;
});

services.Configure<JsonOptions>(options =>
{
    //options.SerializerOptions.PropertyNameCaseInsensitive = false;
    options.SerializerOptions.PropertyNamingPolicy = null;
    //options.SerializerOptions.WriteIndented = true;
});

services.AddControllers();
// Register liveness/health checks
services.AddHealthChecks();
//builder.Services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

builder.Services.AddSignalR();

services.AddMvc().AddRazorOptions(options =>
{
    options.ViewLocationFormats.Add("/{0}.cshtml");
});
services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly));

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = !builder.Environment.IsProduction() ? "http://localhost:6400" : builder.Configuration["AppSettings:Issuer"],
        ValidAudience = !builder.Environment.IsProduction() ? "http://localhost:5173" : builder.Configuration["AppSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Secret"]!))
    };
});

services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
{
    builder
        .WithOrigins("http://localhost:3000", "http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
}));
services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<AppointmentProfile>();
    cfg.AddProfile<MedicationProfile>();
    cfg.AddProfile<MedicationTypeProfile>();
    cfg.AddProfile<ProcedureProfile>();
    cfg.AddProfile<ProcedureTypeProfile>();
    cfg.AddProfile<TestProfile>();
    cfg.AddProfile<TestParameterProfile>();
    cfg.AddProfile<ReportProfile>();
    cfg.AddProfile<PrescriptionProfile>();
    cfg.AddProfile<ReceiptProfile>();

});


services.AddHttpContextAccessor();

services.AddScoped<IClientService, ClientService>();
services.AddScoped<IJwtUtils, JwtUtils>();
services.AddScoped<IEncryptionHandler, EncryptionHandler>();

services.AddScoped<IAppointmentService, AppointmentService>();
services.AddScoped<IProcedureService, ProcedureService>();
services.AddScoped<IProcedureTypeService, ProcedureTypeService>();
services.AddScoped<IMedicationService, MedicationService>();
services.AddScoped<IMedicationTypeService, MedicationTypeService>();
services.AddScoped<ITestService, TestService>();
services.AddScoped<ITestParameterService, TestParameterService>();
services.AddScoped<IReportService, ReportService>();
services.AddScoped<IPrescriptionService, PrescriptionService>();
services.AddScoped<IReceiptService, ReceiptService>();
services.AddScoped<INotificationService, NotificationService>();


//services.Configure<IISOptions>(options => {
//  options.AutomaticAuthentication = true;
//});
services.AddLogging(logging => logging.AddConsole());
//builder.WebHost.UseIISIntegration();

var app = builder.Build();

//app.UseStaticFiles();
//app.UseStaticFiles(new StaticFileOptions()
//{
//    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
//    RequestPath = new PathString("/Resources")
//});

// Conditionally use HTTPS redirection only in development
if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseHttpLogging();
app.UseMiddleware<JwtMiddleware>();
app.UseRouting();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

//Add health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
    .WithName("Health");

var url = app.Environment.IsProduction()
    ? "http://+:4000"
    : "https://localhost:6400";
//var url =  "https://localhost:4000";
app.Run(url);
