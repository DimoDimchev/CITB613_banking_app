using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Collections.Generic;

namespace DepositApp
{
    public partial class Form1 : Form
    {
        private readonly HttpClient _httpClient;

        public Form1()
        {
            InitializeComponent();
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("http://localhost:5122/");
        }

        private async void Form1_Load(object sender, EventArgs e)
        {
            comboBoxProductType.Items.Add("Deposit");
            comboBoxProductType.Items.Add("Other");
            comboBoxProductType.SelectedIndex = 0;

            comboBoxAudience.Items.Add("Individuals");
            comboBoxAudience.Items.Add("Businesses");
            comboBoxAudience.SelectedIndex = 0;

            comboBoxDepositType.Items.AddRange(Enum.GetNames(typeof(DepositType)));
            comboBoxDepositType.SelectedIndex = 0;

            comboBoxInterestType.Items.AddRange(Enum.GetNames(typeof(InterestType)));
            comboBoxInterestType.SelectedIndex = 0;

            comboBoxPayoutSchedule.Items.Add("Monthly");
            comboBoxPayoutSchedule.Items.Add("Quarterly");
            comboBoxPayoutSchedule.Items.Add("Annually");
            comboBoxPayoutSchedule.SelectedIndex = 0;

            await LoadDepositsFromApi();
        }

        private async Task LoadDepositsFromApi()
        {
            try
            {
                var deposits = await _httpClient.GetFromJsonAsync<List<Deposit>>("deposits");
                listBoxDeposits.Items.Clear();
                if (deposits != null)
                {
                    foreach (var d in deposits)
                    {
                        listBoxDeposits.Items.Add($"{d.Name} - {d.Amount} {d.Currency}");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error loading deposits: " + ex.Message);
            }
        }

        private async void buttonAdd_Click(object sender, EventArgs e)
        {
            if (comboBoxProductType.SelectedItem?.ToString() == "Other")
            {
                string otherName = textBoxOtherName.Text;
                MessageBox.Show($"Other product '{otherName}' added (demo).");
                return;
            }

            var deposit = new DepositCreateRequest
            {
                Name = textBoxName.Text,
                Amount = decimal.TryParse(textBoxAmount.Text, out var amount) ? amount : 0,
                TermMonths = int.TryParse(textBoxTerm.Text, out var term) ? term : 0,
                Currency = textBoxCurrency.Text,
                BankId = 1,
                Type = Enum.TryParse<DepositType>(comboBoxDepositType.SelectedItem?.ToString(), out var type) ? type : DepositType.Term,
                InterestType = Enum.TryParse<InterestType>(comboBoxInterestType.SelectedItem?.ToString(), out var iType) ? iType : InterestType.Fixed,
                InterestRate = 1.5m,
                AllowsEarlyWithdrawal = checkBoxEarlyWithdraw.Checked,
                AllowsAdditionalDeposits = checkBoxAdditionalDeposits.Checked,
                InterestPayoutSchedule = comboBoxPayoutSchedule.SelectedItem?.ToString() ?? "Monthly",
                OverdraftAllowed = checkBoxOverdraft.Checked,
                TargetAudience = comboBoxAudience.SelectedItem?.ToString() ?? "Individuals"
            };

            var response = await _httpClient.PostAsJsonAsync("deposits", deposit);
            if (response.IsSuccessStatusCode)
            {
                MessageBox.Show("Deposit added successfully!");
                await LoadDepositsFromApi();
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                MessageBox.Show("Error adding deposit: " + error);
            }
        }

        private void comboBoxProductType_SelectedIndexChanged(object sender, EventArgs e)
        {
            bool isDeposit = comboBoxProductType.SelectedItem?.ToString() == "Deposit";

            labelName.Visible = isDeposit;
            labelAmount.Visible = isDeposit;
            labelTerm.Visible = isDeposit;
            labelCurrency.Visible = isDeposit;
            labelAudience.Visible = isDeposit;
            labelDepositType.Visible = isDeposit;
            labelInterestType.Visible = isDeposit;
            labelPayoutSchedule.Visible = isDeposit;
            checkBoxEarlyWithdraw.Visible = isDeposit;
            checkBoxAdditionalDeposits.Visible = isDeposit;
            checkBoxOverdraft.Visible = isDeposit;

            textBoxName.Visible = isDeposit;
            textBoxAmount.Visible = isDeposit;
            textBoxTerm.Visible = isDeposit;
            textBoxCurrency.Visible = isDeposit;
            comboBoxAudience.Visible = isDeposit;
            comboBoxDepositType.Visible = isDeposit;
            comboBoxInterestType.Visible = isDeposit;
            comboBoxPayoutSchedule.Visible = isDeposit;

            labelOtherName.Visible = !isDeposit;
            textBoxOtherName.Visible = !isDeposit;
        }
    }

    // DTOs
    public class Deposit
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
    }

    public class DepositCreateRequest
    {
        public int BankId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DepositType Type { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public InterestType InterestType { get; set; }
        public decimal InterestRate { get; set; }
        public int TermMonths { get; set; }
        public bool AllowsEarlyWithdrawal { get; set; }
        public bool AllowsAdditionalDeposits { get; set; }
        public string InterestPayoutSchedule { get; set; } = string.Empty;
        public bool OverdraftAllowed { get; set; }
        public string TargetAudience { get; set; } = string.Empty;
    }

    public enum DepositType { Demand, Term }
    public enum InterestType { Fixed, Variable }
}
