namespace DepositApp
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
                components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.labelProductType = new System.Windows.Forms.Label();
            this.comboBoxProductType = new System.Windows.Forms.ComboBox();
            this.labelName = new System.Windows.Forms.Label();
            this.textBoxName = new System.Windows.Forms.TextBox();
            this.labelAmount = new System.Windows.Forms.Label();
            this.textBoxAmount = new System.Windows.Forms.TextBox();
            this.labelTerm = new System.Windows.Forms.Label();
            this.textBoxTerm = new System.Windows.Forms.TextBox();
            this.labelCurrency = new System.Windows.Forms.Label();
            this.textBoxCurrency = new System.Windows.Forms.TextBox();
            this.labelAudience = new System.Windows.Forms.Label();
            this.comboBoxAudience = new System.Windows.Forms.ComboBox();
            this.labelDepositType = new System.Windows.Forms.Label();
            this.comboBoxDepositType = new System.Windows.Forms.ComboBox();
            this.labelInterestType = new System.Windows.Forms.Label();
            this.comboBoxInterestType = new System.Windows.Forms.ComboBox();
            this.labelPayoutSchedule = new System.Windows.Forms.Label();
            this.comboBoxPayoutSchedule = new System.Windows.Forms.ComboBox();
            this.checkBoxEarlyWithdraw = new System.Windows.Forms.CheckBox();
            this.checkBoxAdditionalDeposits = new System.Windows.Forms.CheckBox();
            this.checkBoxOverdraft = new System.Windows.Forms.CheckBox();
            this.labelOtherName = new System.Windows.Forms.Label();
            this.textBoxOtherName = new System.Windows.Forms.TextBox();
            this.buttonAdd = new System.Windows.Forms.Button();
            this.listBoxDeposits = new System.Windows.Forms.ListBox();
            this.SuspendLayout();
            // 
            // labelProductType
            this.labelProductType.Text = "Product Type";
            this.labelProductType.Location = new System.Drawing.Point(20, 20);
            // 
            // comboBoxProductType
            this.comboBoxProductType.Location = new System.Drawing.Point(140, 17);
            this.comboBoxProductType.SelectedIndexChanged += new System.EventHandler(this.comboBoxProductType_SelectedIndexChanged);
            // 
            // labelName
            this.labelName.Text = "Name";
            this.labelName.Location = new System.Drawing.Point(20, 50);
            // 
            // textBoxName
            this.textBoxName.Location = new System.Drawing.Point(140, 47);
            // 
            // labelAmount
            this.labelAmount.Text = "Amount";
            this.labelAmount.Location = new System.Drawing.Point(20, 80);
            // 
            // textBoxAmount
            this.textBoxAmount.Location = new System.Drawing.Point(140, 77);
            // 
            // labelTerm
            this.labelTerm.Text = "Term (months)";
            this.labelTerm.Location = new System.Drawing.Point(20, 110);
            // 
            // textBoxTerm
            this.textBoxTerm.Location = new System.Drawing.Point(140, 107);
            // 
            // labelCurrency
            this.labelCurrency.Text = "Currency";
            this.labelCurrency.Location = new System.Drawing.Point(20, 140);
            // 
            // textBoxCurrency
            this.textBoxCurrency.Location = new System.Drawing.Point(140, 137);
            // 
            // labelAudience
            this.labelAudience.Text = "Target Audience";
            this.labelAudience.Location = new System.Drawing.Point(20, 170);
            // 
            // comboBoxAudience
            this.comboBoxAudience.Location = new System.Drawing.Point(140, 167);
            // 
            // labelDepositType
            this.labelDepositType.Text = "Deposit Type";
            this.labelDepositType.Location = new System.Drawing.Point(20, 200);
            // 
            // comboBoxDepositType
            this.comboBoxDepositType.Location = new System.Drawing.Point(140, 197);
            // 
            // labelInterestType
            this.labelInterestType.Text = "Interest Type";
            this.labelInterestType.Location = new System.Drawing.Point(20, 230);
            // 
            // comboBoxInterestType
            this.comboBoxInterestType.Location = new System.Drawing.Point(140, 227);
            // 
            // labelPayoutSchedule
            this.labelPayoutSchedule.Text = "Payout Schedule";
            this.labelPayoutSchedule.Location = new System.Drawing.Point(20, 260);
            // 
            // comboBoxPayoutSchedule
            this.comboBoxPayoutSchedule.Location = new System.Drawing.Point(140, 257);
            // 
            // checkBoxEarlyWithdraw
            this.checkBoxEarlyWithdraw.Text = "Allows Early Withdrawal";
            this.checkBoxEarlyWithdraw.Location = new System.Drawing.Point(20, 290);
            // 
            // checkBoxAdditionalDeposits
            this.checkBoxAdditionalDeposits.Text = "Allows Additional Deposits";
            this.checkBoxAdditionalDeposits.Location = new System.Drawing.Point(20, 320);
            // 
            // checkBoxOverdraft
            this.checkBoxOverdraft.Text = "Overdraft Allowed";
            this.checkBoxOverdraft.Location = new System.Drawing.Point(20, 350);
            // 
            // labelOtherName
            this.labelOtherName.Text = "Other Name";
            this.labelOtherName.Location = new System.Drawing.Point(20, 50);
            this.labelOtherName.Visible = false;
            // 
            // textBoxOtherName
            this.textBoxOtherName.Location = new System.Drawing.Point(140, 47);
            this.textBoxOtherName.Visible = false;
            // 
            // buttonAdd
            this.buttonAdd.Text = "Add Product";
            this.buttonAdd.Location = new System.Drawing.Point(140, 380);
            this.buttonAdd.Click += new System.EventHandler(this.buttonAdd_Click);
            // 
            // listBoxDeposits
            this.listBoxDeposits.Location = new System.Drawing.Point(320, 20);
            this.listBoxDeposits.Size = new System.Drawing.Size(300, 390);
            // 
            // Form1
            this.ClientSize = new System.Drawing.Size(640, 430);
            this.Controls.AddRange(new Control[] {
                labelProductType, comboBoxProductType,
                labelName, textBoxName,
                labelAmount, textBoxAmount,
                labelTerm, textBoxTerm,
                labelCurrency, textBoxCurrency,
                labelAudience, comboBoxAudience,
                labelDepositType, comboBoxDepositType,
                labelInterestType, comboBoxInterestType,
                labelPayoutSchedule, comboBoxPayoutSchedule,
                checkBoxEarlyWithdraw, checkBoxAdditionalDeposits, checkBoxOverdraft,
                labelOtherName, textBoxOtherName,
                buttonAdd, listBoxDeposits
            });
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "Form1";
            this.Text = "Bank Product Manager";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        // Controls
        private Label labelProductType, labelName, labelAmount, labelTerm, labelCurrency,
                      labelAudience, labelOtherName, labelDepositType, labelInterestType, labelPayoutSchedule;
        private TextBox textBoxName, textBoxAmount, textBoxTerm, textBoxCurrency, textBoxOtherName;
        private ComboBox comboBoxProductType, comboBoxAudience, comboBoxDepositType,
                         comboBoxInterestType, comboBoxPayoutSchedule;
        private CheckBox checkBoxEarlyWithdraw, checkBoxAdditionalDeposits, checkBoxOverdraft;
        private Button buttonAdd;
        private ListBox listBoxDeposits;
    }
}
