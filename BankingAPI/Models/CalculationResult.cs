namespace BankingAPI.Models;

public record CalculationResult(
    decimal Principal,
    decimal MaturityValue,
    decimal TotalInterest,
    DateTime MaturityDate
);