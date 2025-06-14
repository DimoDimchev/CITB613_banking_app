using BankingAPI.DTOs;
using BankingAPI.Models;
using FluentValidation;

namespace BankingAPI.Validators;

public class DepositCreateRequestValidator : AbstractValidator<DepositCreateRequest>
{
    public DepositCreateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Deposit name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid deposit type");

        RuleFor(x => x.Amount)
            .GreaterThanOrEqualTo(10).WithMessage("Minimum amount is 10")
            .LessThanOrEqualTo(1_000_000).WithMessage("Maximum amount is 1,000,000");

        RuleFor(x => x.Currency)
            .Length(3).WithMessage("Currency must be 3 characters")
            .Must(BeSupportedCurrency).WithMessage("Unsupported currency");

        RuleFor(x => x.InterestRate)
            .InclusiveBetween(0.01M, 20.00M).WithMessage("Interest rate must be 0.01-20.00%");

        RuleFor(x => x.TermMonths)
            .InclusiveBetween(1, 60).WithMessage("Term must be 1-60 months");

        RuleFor(x => x.TargetAudience)
            .Must(BeValidAudience).WithMessage("Target audience must be 'Individuals' or 'Businesses'");

        // Custom rule: Term deposits require ≥3 months
        RuleFor(x => x)
            .Must(x => x.Type != DepositType.TermDeposit || x.TermMonths >= 3)
            .WithMessage("Term deposits require at least 3 months");
    }

    private bool BeSupportedCurrency(string currency)
        => new[] { "BGN", "EUR", "USD" }.Contains(currency);

    private bool BeValidAudience(string audience)
        => new[] { "Individuals", "Businesses" }.Contains(audience);
}