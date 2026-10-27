using DeliveryFinance.Api.Data;
using DeliveryFinance.Api.Extensions;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Register Core Infrastructure & Clean Architecture Layers via Extension Methods
builder.Services
    .AddDatabase(builder.Configuration)
    .AddIdentityAndAuth(builder.Configuration)
    .AddApplicationServices()
    .AddAppCors(builder.Configuration)
    .AddSwaggerDocumentation();

builder.Services.AddControllers();

var app = builder.Build();

// Automated Database Migration & Baseline Seeding
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        await DbInitializer.InitializeAsync(app.Services, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to apply database migrations or seed initial roles.");
    }
}

// Support Render & reverse proxies (SSL termination)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Enable Swagger in Development and Cloud/Production environments
if (app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("EnableSwagger", true))
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fleet Tracking API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAll");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// Render Root & Health Check Endpoints
app.MapGet("/", () => Results.Ok(new
{
    status = "healthy",
    service = "Fleet Tracking Management System API",
    version = "1.0.0",
    docs = "/swagger"
}));

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.MapControllers();

app.Run();
