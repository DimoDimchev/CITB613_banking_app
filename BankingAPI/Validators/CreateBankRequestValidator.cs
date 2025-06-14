
using BankingAPI.DTOs;
using BankingAPI.Models;
using FluentValidation;

namespace BankingAPI.Validators;

public class CreateBankRequestValidator : AbstractValidator<CreateBankRequest>
{
    public CreateBankRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Bank name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Code)
            .MaximumLength(20).WithMessage("Code cannot exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.Code));

        RuleFor(x => x.Address)
            .MaximumLength(200).WithMessage("Address cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Address));
    }
}