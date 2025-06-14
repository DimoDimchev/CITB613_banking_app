using Microsoft.EntityFrameworkCore;
using BankingAPI.Models;

namespace BankingAPI.Data;

public class AppDbContext : DbContext
{
    public DbSet<Bank> Banks => Set<Bank>();

    public DbSet<Deposit> Deposits => Set<Deposit>();

    // Placeholders (open for extension)
    public DbSet<Mortgage> Mortgages => Set<Mortgage>();
    public DbSet<PersonalLoan> PersonalLoans => Set<PersonalLoan>();
    public DbSet<QuickLoan> QuickLoans => Set<QuickLoan>();
    public DbSet<Investment> Investments => Set<Investment>();
    public DbSet<RetirementFund> RetirementFunds => Set<RetirementFund>();
    public DbSet<FinancialConsultation> FinancialConsultations => Set<FinancialConsultation>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Deposit>()
            .HasOne(d => d.Bank)
            .WithMany(b => b.Deposits)
            .HasForeignKey(d => d.BankId);

        // Seed example banks
        modelBuilder.Entity<Bank>().HasData(
        new Bank { Id = 1, Name = "National Savings Bank", Code = "NSB001" },
        new Bank { Id = 2, Name = "Global Credit Union", Code = "GCU002" }
    );
}
}