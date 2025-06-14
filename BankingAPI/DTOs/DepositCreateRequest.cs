using System.ComponentModel.DataAnnotations;
using BankingAPI.Models;
using System.Text.Json.Serialization;

namespace BankingAPI.DTOs;

public class DepositCreateRequest
{

    [Required(ErrorMessage = "Bank ID is required")]
    public int BankId { get; set; }

    [Required(ErrorMessage = "Deposit name is required")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public DepositType Type { get; set; }

    [Required(ErrorMessage = "Amount is required")]
    [Range(10, 1_000_000, ErrorMessage = "Amount must be between 10 and 1,000,000")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Currency is required")]
    [StringLength(3, MinimumLength = 3, ErrorMessage = "Currency must be 3 characters")]
    public string Currency { get; set; } = "BGN";

    [Required(ErrorMessage = "Interest type is required")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public InterestType InterestType { get; set; }

    [Required(ErrorMessage = "Interest rate is required")]
    [Range(0.01, 20.00, ErrorMessage = "Interest rate must be 0.01-20.00%")]
    public decimal InterestRate { get; set; }

    [Required(ErrorMessage = "Term is required")]
    [Range(1, 60, ErrorMessage = "Term must be 1-60 months")]
    public int TermMonths { get; set; }

    public bool AllowsEarlyWithdrawal { get; set; }
    public bool AllowsAdditionalDeposits { get; set; }

    [Required(ErrorMessage = "Interest payout schedule is required")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public InterestPayout InterestPayoutSchedule { get; set; }

    public bool OverdraftAllowed { get; set; }

    [Required(ErrorMessage = "Target audience is required")]
    public string TargetAudience { get; set; } = "Individuals";
}