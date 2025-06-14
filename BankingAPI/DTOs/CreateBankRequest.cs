using System.ComponentModel.DataAnnotations;

namespace BankingAPI.DTOs;

public class CreateBankRequest
{
    [Required(ErrorMessage = "Bank name is required")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    [StringLength(20, ErrorMessage = "Code cannot exceed 20 characters")]
    public string? Code { get; set; }

    [StringLength(200, ErrorMessage = "Address cannot exceed 200 characters")]
    public string? Address { get; set; }
}