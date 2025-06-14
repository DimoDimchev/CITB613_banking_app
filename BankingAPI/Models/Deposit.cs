using System.ComponentModel.DataAnnotations;

namespace BankingAPI.Models;

public enum DepositType
{
    TermDeposit,
    DemandDeposit,
    SavingsDeposit
}
public enum InterestType { Fixed, Variable }
public enum InterestPayout { Monthly, Quarterly, AtMaturity }

public class Deposit : BankingProduct
{
    [Required(ErrorMessage = "Deposit type is required")]
    public DepositType Type { get; set; }

    [Range(10, 1_000_000, ErrorMessage = "Amount must be between 10 and 1,000,000")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Currency is required")]
    [StringLength(3, MinimumLength = 3, ErrorMessage = "Currency must be 3 characters (e.g., BGN)")]
    public string Currency { get; set; } = "BGN";

    [Required(ErrorMessage = "Interest type is required")]
    public InterestType InterestType { get; set; }

    [Range(0.01, 20.00, ErrorMessage = "Interest rate must be 0.01-20.00%")]
    public decimal InterestRate { get; set; }

    [Range(1, 60, ErrorMessage = "Term must be 1-60 months")]
    public int TermMonths { get; set; }

    public bool AllowsEarlyWithdrawal { get; set; }
    public bool AllowsAdditionalDeposits { get; set; }

    [Required(ErrorMessage = "Interest payout schedule is required")]
    public InterestPayout InterestPayoutSchedule { get; set; }

    public bool OverdraftAllowed { get; set; }

    [Required(ErrorMessage = "Target audience is required")]
    public string TargetAudience { get; set; } = "Individuals";

    public int InterestPayoutPeriodsPerYear()
    {
        return InterestPayoutSchedule switch
        {
            InterestPayout.Monthly => 12,
            InterestPayout.Quarterly => 4,
            InterestPayout.AtMaturity => 1,
            _ => throw new InvalidOperationException("Unknown payout schedule")
        };
    }
}