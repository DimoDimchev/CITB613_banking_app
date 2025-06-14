using System;
using BankingAPI.Models;

namespace BankingAPI.Services;

public class DepositCalculatorService
{
    public CalculationResult Calculate(Deposit deposit, decimal principal, int months)
    {
        decimal rate = deposit.InterestRate / 100m;
        int periodsPerYear = GetPeriodsPerYear(deposit.InterestPayoutSchedule);
        decimal periodicRate = rate / periodsPerYear;
        int totalPeriods = (int)(periodsPerYear * (months / 12m));

        var schedule = new List<PaymentScheduleItem>();
        decimal balance = principal;

        for (int i = 1; i <= totalPeriods; i++)
        {
            decimal interest = balance * periodicRate;
            balance += interest;
            
            schedule.Add(new PaymentScheduleItem(
                Period: i,
                Date: DateTime.UtcNow.AddMonths((int)(i * (12m / periodsPerYear))),
                Interest: interest,
                Balance: balance
            ));
        }

        return new CalculationResult(
            principal,
            balance,
            balance - principal,
            DateTime.UtcNow.AddMonths(months),
            schedule
        );
    }

    private int GetPeriodsPerYear(InterestPayout schedule) => schedule switch
    {
        InterestPayout.Monthly => 12,
        InterestPayout.Quarterly => 4,
        InterestPayout.AtMaturity => 1,
        _ => throw new ArgumentException("Invalid payout schedule")
    };
}

public record CalculationResult(
    decimal Principal,
    decimal MaturityValue,
    decimal TotalInterest,
    DateTime MaturityDate,
    List<PaymentScheduleItem> PaymentSchedule);

public record PaymentScheduleItem(
    int Period,
    DateTime Date,
    decimal Interest,
    decimal Balance);