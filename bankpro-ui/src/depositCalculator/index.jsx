import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2Icon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function DepositCalculator() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [formData, setFormData] = useState({
    principal: 10000,
    durationMonths: 12,
  });
  const [formErrors, setFormErrors] = useState({
    principal: '',
    durationMonths: '',
  });
  const [depositDetails, setDepositDetails] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchDepositDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5122/deposits/${id}`);
          setDepositDetails(response.data);
        } catch (err) {
          console.error("Error fetching deposit details:", err);
        }
      };
      fetchDepositDetails();
    }
  }, [id]);

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'principal') {
      if (isNaN(value) || value === '') {
        error = 'Моля, въведете валидна сума';
      } else if (value <= 0) {
        error = 'Сумата трябва да е положително число';
      } else if (value > 10000000) {
        error = 'Сумата не може да надвишава 10,000,000 лв';
      } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        error = 'Моля, въведете сума с максимум 2 десетични цифри';
      }
    }
    
    if (name === 'durationMonths') {
      if (isNaN(value) || value === '') {
        error = 'Моля, въведете валиден срок';
      } else if (value <= 0) {
        error = 'Срокът трябва да е положително число';
      } else if (!Number.isInteger(Number(value))) {
        error = 'Срокът трябва да е цяло число';
      } else if (value > 360) {
        error = 'Максималният срок е 360 месеца (30 години)';
      } else if (depositDetails && depositDetails.minDurationMonths && value < depositDetails.minDurationMonths) {
        error = `Минималният срок за този депозит е ${depositDetails.minDurationMonths} месеца`;
      } else if (depositDetails && depositDetails.maxDurationMonths && value > depositDetails.maxDurationMonths) {
        error = `Максималният срок за този депозит е ${depositDetails.maxDurationMonths} месеца`;
      }
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Only update form data if validation passes
    if (!error) {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'durationMonths' ? parseInt(value) : parseFloat(value)
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validate principal
    const principalError = validateField('principal', formData.principal);
    if (principalError) {
      newErrors.principal = principalError;
      isValid = false;
    }
    
    // Validate duration
    const durationError = validateField('durationMonths', formData.durationMonths);
    if (durationError) {
      newErrors.durationMonths = durationError;
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    
    // Validate the entire form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        principal: formData.principal,
        durationMonths: formData.durationMonths
      }).toString();

      const response = await axios.get(`http://localhost:5122/deposits/${id}/calculate?${params}`);
      
      setPaymentSchedule(response.data.paymentSchedule);
      setTotalAmount(response.data.maturityValue);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const financialData = [
    {
      value: `${formData.principal.toLocaleString()} лв`,
      label: "Начална сума",
      valueColor: "text-blue-600",
    },
    {
      value: depositDetails ? `${depositDetails.interestRate.toFixed(2)}%` : "-",
      label: "Годишна лихва",
      valueColor: "text-green-600",
    },
    {
      value: `${formData.durationMonths} месеца`,
      label: "Срок",
      valueColor: "text-purple-600",
    },
    {
      value: totalAmount > 0 
        ? `${totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} лв`
        : "-",
      label: "Обща сума",
      valueColor: "text-orange-600",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG');
  };

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <p>Моля, изберете депозит от списъка</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <header className="w-full mb-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {depositDetails ? depositDetails.name : "График на плащания за депозит"}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Детайлен преглед на вашия депозитен план
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="principal" className="block text-sm font-medium text-gray-700 mb-1">
              Начална сума (лв)
            </Label>
            <Input
              type="number"
              id="principal"
              name="principal"
              min="1"
              step="0.01"
              value={formData.principal}
              onChange={handleInputChange}
              className="w-full"
              required
            />
            {formErrors.principal && (
              <p className="mt-1 text-sm text-red-600">{formErrors.principal}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700 mb-1">
              Срок (месеци)
            </Label>
            <Input
              type="number"
              id="durationMonths"
              name="durationMonths"
              min="1"
              value={formData.durationMonths}
              onChange={handleInputChange}
              className="w-full"
              required
            />
            {formErrors.durationMonths && (
              <p className="mt-1 text-sm text-red-600">{formErrors.durationMonths}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <Button
            type="submit"
            disabled={isLoading || !depositDetails || Object.values(formErrors).some(error => error)}
            className="w-full md:w-auto"
          >
            {isLoading ? 'Изчисляване...' : 'Изчисли'}
          </Button>
        </div>
        
        {error && (
          <div className="mt-3 text-sm text-red-600">
            Грешка: {error}
          </div>
        )}
      </form>
      </header>

      <div className="space-y-6">
        <Card className="w-full shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-2 gap-4">
              {financialData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`font-bold ${item.valueColor} text-lg md:text-xl text-center`}>
                    {item.value}
                  </div>
                  <div className="font-normal text-gray-500 text-xs md:text-sm text-center mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {paymentSchedule.length > 0 && (
          <Card className="w-full rounded-lg overflow-hidden border shadow-sm">
            <CardHeader className="bg-gray-50 border-b px-4 py-3 md:px-6 md:py-4">
              <div className="flex items-center">
                <BarChart2Icon className="w-4 h-4 md:w-[17.5px] md:h-5 mr-2 md:mr-3" />
                <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
                  График на плащания
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="py-3 px-4 md:py-4 md:px-6 font-semibold text-xs">
                        Месец
                      </TableHead>
                      <TableHead className="py-3 px-4 md:py-4 md:px-6 font-semibold text-xs">
                        Дата
                      </TableHead>
                      <TableHead className="py-3 px-4 md:py-4 md:px-6 font-semibold text-xs text-right">
                        Начален Баланс
                      </TableHead>
                      <TableHead className="py-3 px-4 md:py-4 md:px-6 font-semibold text-xs text-right">
                        Лихва за месец
                      </TableHead>
                      <TableHead className="py-3 px-4 md:py-4 md:px-6 font-semibold text-xs text-right">
                        Краен Баланс
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paymentSchedule.map((row, index) => (
                      <TableRow
                        key={row.period}
                        className={`${index === paymentSchedule.length - 1 ? "bg-blue-50" : ""} border-t`}
                      >
                        <TableCell className="py-3 px-4 md:py-4 md:px-6">
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${index === paymentSchedule.length - 1 ? "bg-blue-600" : "bg-blue-100"}`}
                            >
                              <span
                                className={`text-xs md:text-sm ${index === paymentSchedule.length - 1 ? "text-white" : "text-blue-600"}`}
                              >
                                {row.period}
                              </span>
                            </div>
                            <span
                              className={`ml-2 text-xs md:text-sm ${index === paymentSchedule.length - 1 ? "font-bold" : "font-medium"} text-gray-900`}
                            >
                              Месец {row.period}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-600">
                          {formatDate(row.date)}
                        </TableCell>

                        <TableCell className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-900 text-right">
                          {row.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} лв
                        </TableCell>

                        <TableCell className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-green-600 text-right">
                          +{row.interest.toFixed(2)} лв
                        </TableCell>

                        <TableCell className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-right">
                          <span
                            className={`font-bold ${index === paymentSchedule.length - 1 ? "text-blue-600" : "text-gray-900"}`}
                          >
                            {row.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} лв
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-t gap-2">
                <div className="flex items-center">
                  <InfoIcon className="w-3 h-3 md:w-3.5 md:h-3.5 mr-2 md:mr-[18px]" />
                  <span className="text-xs md:text-sm text-gray-600">
                    Общо натрупана лихва:
                  </span>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm text-green-600 font-semibold">
                    {paymentSchedule.reduce((sum, row) => sum + row.interest, 0).toFixed(2)} лв
                  </span>
                </div>

                <div className="flex items-center">
                  <BarChart2Icon className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-[10px]" />
                  <span className="text-xs md:text-sm text-gray-600">
                    Ефективна доходност:
                  </span>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm text-blue-600 font-semibold">
                    {((paymentSchedule[paymentSchedule.length - 1]?.balance / paymentSchedule[0]?.balance - 1) * 100 || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}