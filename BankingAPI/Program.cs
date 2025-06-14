using BankingAPI.Data;
using BankingAPI.Models;
using BankingAPI.DTOs;
using BankingAPI.Validators;
using BankingAPI.Services;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add validation
builder.Services.AddValidatorsFromAssemblyContaining<DepositCreateRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateBankRequestValidator>();
builder.Services.AddScoped<DepositCalculatorService>();

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "BankingAPI", Version = "v1" });
});

builder.Services.Configure<JsonOptions>(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.Configure<Microsoft.AspNetCore.Mvc.JsonOptions>(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var app = builder.Build();

// Enable Swagger UI in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "BankingAPI v1");
    });
}

// Enable automatic validation
app.Use(async (context, next) =>
{
    var validator = context.RequestServices.GetService<IValidator<Deposit>>();
    await next();
});

// Deposit Endpoints
app.MapGet("/deposits", async (
    AppDbContext db,
    DepositType? type,
    string? currency,
    InterestType? interestType,
    decimal? minAmount,
    decimal? maxAmount,
    int? minTermMonths,
    bool? allowsOverdraft,
    int? bankId) =>
{
    var query = db.Deposits.AsQueryable();

    // Apply filters (all optional)
    if (type.HasValue) query = query.Where(d => d.Type == type);
    if (!string.IsNullOrEmpty(currency)) query = query.Where(d => d.Currency == currency);
    if (interestType.HasValue) query = query.Where(d => d.InterestType == interestType);
    if (minAmount.HasValue) query = query.Where(d => d.Amount >= minAmount);
    if (maxAmount.HasValue) query = query.Where(d => d.Amount <= maxAmount);
    if (minTermMonths.HasValue) query = query.Where(d => d.TermMonths >= minTermMonths);
    if (allowsOverdraft.HasValue) query = query.Where(d => d.OverdraftAllowed == allowsOverdraft);
    if (bankId.HasValue) query = query.Where(d => d.BankId == bankId);

    return await query.ToListAsync();
});

app.MapGet("/deposits/{id}", async (int id, AppDbContext db) =>
    await db.Deposits.FindAsync(id) is Deposit deposit
        ? Results.Ok(deposit)
        : Results.NotFound());

app.MapPost("/deposits", async (
    [FromBody] DepositCreateRequest request,
    AppDbContext db,
    IValidator<DepositCreateRequest> validator) =>
{
    // Validate request
    var validationResult = await validator.ValidateAsync(request);
    if (!validationResult.IsValid)
    {
        return Results.ValidationProblem(validationResult.ToDictionary());
    }

    // Verify bank exists
    if (!await db.Banks.AnyAsync(b => b.Id == request.BankId))
        return Results.BadRequest("Invalid Bank ID");

    var deposit = new Deposit
    {
        BankId = request.BankId,
        Name = request.Name,
        Type = request.Type,
        Amount = request.Amount,
        Currency = request.Currency,
        InterestType = request.InterestType,
        InterestRate = request.InterestRate,
        TermMonths = request.TermMonths,
        AllowsEarlyWithdrawal = request.AllowsEarlyWithdrawal,
        AllowsAdditionalDeposits = request.AllowsAdditionalDeposits,
        InterestPayoutSchedule = request.InterestPayoutSchedule,
        OverdraftAllowed = request.OverdraftAllowed,
        TargetAudience = request.TargetAudience,
        IsActive = true // Default value for new deposits
    };

    db.Deposits.Add(deposit);
    await db.SaveChangesAsync();
    return Results.Created($"/deposits/{deposit.Id}", deposit);
});

app.MapGet("/deposits/{id}/calculate", async (
    int id,
    [FromQuery] decimal principal,
    [FromQuery] int durationMonths,
    [FromServices] AppDbContext db,
    [FromServices] DepositCalculatorService calculator) =>
{
    var deposit = await db.Deposits.FindAsync(id);
    if (deposit is null) return Results.NotFound();

    var result = calculator.Calculate(deposit, principal, durationMonths);
    return Results.Ok(result);
});

app.MapGet("/banks", async (AppDbContext db) =>
    await db.Banks.ToListAsync());

app.MapPost("/banks", async (
    [FromBody] CreateBankRequest request,
    AppDbContext db,
    IValidator<CreateBankRequest> validator) =>
{
    // Validate request
    var validationResult = await validator.ValidateAsync(request);
    if (!validationResult.IsValid)
    {
        return Results.ValidationProblem(validationResult.ToDictionary());
    }

    // Create new bank
    var bank = new Bank
    {
        Name = request.Name,
        Code = request.Code,
        Address = request.Address
    };

    db.Banks.Add(bank);
    await db.SaveChangesAsync();

    return Results.Created($"/banks/{bank.Id}", bank);
});

app.Run();