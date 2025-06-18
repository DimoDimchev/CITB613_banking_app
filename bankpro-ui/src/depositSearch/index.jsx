import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { List, Search, SlidersHorizontal } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const DEPOSIT_TYPES = {
  0: "TermDeposit",
  1: "DemandDeposit",
  2: "SavingsDeposit"
};

const INTEREST_TYPES = {
  0: "Fixed",
  1: "Variable"
};

const INTEREST_PAYOUT_SCHEDULES = {
  0: "Monthly",
  1: "Quarterly",
  2: "At Maturity",
};

const CURRENCY_CODES = ['BGN', 'EUR', 'USD', 'GBP', 'CHF']; // Common currency codes

export default function DepositSearch() {
  const [searchParams, setSearchParams] = useState({
    type: "TermDeposit",
    currency: "",
    interestType: "Fixed",
    minAmount: "",
    maxAmount: "",
    minTermMonths: "",
    allowsOverdraft: "",
    bankId: ""
  });
  
  const [formErrors, setFormErrors] = useState({
    currency: '',
    minAmount: '',
    maxAmount: '',
    minTermMonths: '',
  });
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("http://localhost:5122/banks");
        setBanks(response.data);
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setBanksLoading(false);
      }
    };
    
    fetchBanks();
  }, []);

  const depositTypes = [
    { id: "TermDeposit", label: "Срочен депозит" },
    { id: "DemandDeposit", label: "Безсрочен депозит" },
    { id: "SavingsDeposit", label: "Спестовен депозит" },
  ];

  const interestTypes = [
    { id: "Fixed", label: "Фиксирана лихва" },
    { id: "Variable", label: "Променлива лихва" },
  ];

  const overdraftOptions = [
    { id: "true", label: "Да" },
    { id: "false", label: "Не" },
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'currency':
        if (value && !CURRENCY_CODES.includes(value.toUpperCase())) {
          return 'Моля, въведете валидна валута (BGN, EUR, USD и др.)';
        }
        return '';
      
      case 'minAmount':
        if (value && (isNaN(value) || parseFloat(value) <= 0)) {
          return 'Моля, въведете положителна сума';
        }
        if (value && parseFloat(value) > 10000000) {
          return 'Сумата не може да надвишава 10,000,000';
        }
        if (searchParams.maxAmount && value && parseFloat(value) > parseFloat(searchParams.maxAmount)) {
          return 'Минималната сума не може да бъде по-голяма от максималната';
        }
        return '';
      
      case 'maxAmount':
        if (value && (isNaN(value) || parseFloat(value) <= 0)) {
          return 'Моля, въведете положителна сума';
        }
        if (value && parseFloat(value) > 10000000) {
          return 'Сумата не може да надвишава 10,000,000';
        }
        if (searchParams.minAmount && value && parseFloat(value) < parseFloat(searchParams.minAmount)) {
          return 'Максималната сума не може да бъде по-малка от минималната';
        }
        return '';
      
      case 'minTermMonths':
        if (value && (isNaN(value) || parseInt(value) <= 0)) {
          return 'Моля, въведете положителен брой месеци';
        }
        if (value && !Number.isInteger(Number(value))) {
          return 'Моля, въведете цяло число';
        }
        if (value && parseInt(value) > 360) {
          return 'Максималният срок е 360 месеца (30 години)';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // Validate the field
    const error = validateField(id, value);
    setFormErrors(prev => ({
      ...prev,
      [id]: error
    }));
    
    // Update the field value
    setSearchParams(prev => ({ 
      ...prev, 
      [id]: value 
    }));
  };

  const handleRadioChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate currency
    const currencyError = validateField('currency', searchParams.currency);
    if (currencyError) {
      newErrors.currency = currencyError;
      isValid = false;
    }
    
    // Validate minAmount if provided
    if (searchParams.minAmount) {
      const minAmountError = validateField('minAmount', searchParams.minAmount);
      if (minAmountError) {
        newErrors.minAmount = minAmountError;
        isValid = false;
      }
    }
    
    // Validate maxAmount if provided
    if (searchParams.maxAmount) {
      const maxAmountError = validateField('maxAmount', searchParams.maxAmount);
      if (maxAmountError) {
        newErrors.maxAmount = maxAmountError;
        isValid = false;
      }
    }
    
    // Validate minTermMonths if provided
    if (searchParams.minTermMonths) {
      const minTermError = validateField('minTermMonths', searchParams.minTermMonths);
      if (minTermError) {
        newErrors.minTermMonths = minTermError;
        isValid = false;
      }
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSearch = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [
          key,
          value === "" ? undefined : value
        ])
      );

      const response = await axios.get("http://localhost:5122/deposits", { params });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBankName = (bankId) => {
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : "Unknown Bank";
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Search Card */}
      <Card className="w-full mb-6 shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-3" />
            <CardTitle className="text-xl md:text-2xl font-semibold text-gray-900">
              Търсене на депозити
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Deposit Type */}
            <div>
              <Label className="block mb-3 font-medium text-gray-700">
                Вид на депозита
              </Label>
              <RadioGroup 
                value={searchParams.type}
                onValueChange={(value) => handleRadioChange("type", value)}
                className="space-y-2"
              >
                {depositTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={type.id}
                      id={type.id}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={type.id} className="text-gray-900">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Basic Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-700">
                  Валута
                </Label>
                <Input
                  id="currency"
                  value={searchParams.currency}
                  onChange={handleInputChange}
                  placeholder="BGN, EUR, USD"
                  className={formErrors.currency ? 'border-red-500' : ''}
                />
                {formErrors.currency && (
                  <p className="text-sm text-red-600">{formErrors.currency}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="minAmount" className="text-gray-700">
                  Минимална сума
                </Label>
                <Input
                  id="minAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={searchParams.minAmount}
                  onChange={handleInputChange}
                  placeholder="100"
                  className={formErrors.minAmount ? 'border-red-500' : ''}
                />
                {formErrors.minAmount && (
                  <p className="text-sm text-red-600">{formErrors.minAmount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount" className="text-gray-700">
                  Максимална сума
                </Label>
                <Input
                  id="maxAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={searchParams.maxAmount}
                  onChange={handleInputChange}
                  placeholder="10000"
                  className={formErrors.maxAmount ? 'border-red-500' : ''}
                />
                {formErrors.maxAmount && (
                  <p className="text-sm text-red-600">{formErrors.maxAmount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="minTermMonths" className="text-gray-700">
                  Срок (месеци)
                </Label>
                <Input
                  id="minTermMonths"
                  type="number"
                  min="1"
                  value={searchParams.minTermMonths}
                  onChange={handleInputChange}
                  placeholder="12"
                  className={formErrors.minTermMonths ? 'border-red-500' : ''}
                />
                {formErrors.minTermMonths && (
                  <p className="text-sm text-red-600">{formErrors.minTermMonths}</p>
                )}
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <Button
              variant="ghost"
              className="w-full md:w-auto flex items-center text-gray-700"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showAdvanced ? "Скрий" : "Покажи"} разширени филтри
            </Button>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="block mb-3 font-medium text-gray-700">
                    Тип лихва
                  </Label>
                  <RadioGroup 
                    value={searchParams.interestType}
                    onValueChange={(value) => handleRadioChange("interestType", value)}
                    className="space-y-2"
                  >
                    {interestTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={type.id}
                          id={`interest-${type.id}`}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`interest-${type.id}`} className="text-gray-900">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label className="block mb-3 font-medium text-gray-700">
                    Позволява овърдрафт
                  </Label>
                  <RadioGroup 
                    value={searchParams.allowsOverdraft}
                    onValueChange={(value) => handleRadioChange("allowsOverdraft", value)}
                    className="space-y-2"
                  >
                    {overdraftOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.id}
                          id={`overdraft-${option.id}`}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`overdraft-${option.id}`} className="text-gray-900">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Search Button */}
            <Button 
              className="w-full md:w-auto" 
              onClick={handleSearch}
              disabled={loading || Object.values(formErrors).some(error => error)}
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Търсене..." : "Търси депозити"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center">
            <List className="w-4 h-4 mr-2" />
            <CardTitle className="text-lg md:text-xl font-medium text-gray-900">
              Резултати от търсенето
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Зареждане...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((deposit) => (
                <Card key={deposit.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{deposit.name}</h3>
                      <p className="text-gray-600">{getBankName(deposit.bankId)}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {DEPOSIT_TYPES[deposit.type] || "Unknown Type"}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Лихва</p>
                      <p className="font-medium">{deposit.interestRate}% ({INTEREST_TYPES[deposit.interestType]})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Срок</p>
                      <p className="font-medium">{deposit.termMonths} месеца</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Минимална сума</p>
                      <p className="font-medium">{deposit.amount} {deposit.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Изплащане на лихви</p>
                      <p className="font-medium">{INTEREST_PAYOUT_SCHEDULES[deposit.interestPayoutSchedule]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Допълнителни вноски</p>
                      <p className="font-medium">{deposit.allowsAdditionalDeposits ? "Да" : "Не"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Предсрочно теглене</p>
                      <p className="font-medium">{deposit.allowsEarlyWithdrawal ? "Да" : "Не"}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link to={`/deposit-calculator?id=${deposit.id}`}>
                      <Button>
                        Изчисли доходност
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="w-9 h-9 mb-4 text-gray-400" />
              <p className="text-gray-500">
                {banksLoading ? "Зареждане на банки..." : "Използвайте филтрите по-горе за да намерите подходящ депозит"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}