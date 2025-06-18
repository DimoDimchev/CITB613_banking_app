import {
  BarChart4,
  Building2,
  CreditCard,
  Home,
  TrendingUp,
  Umbrella,
  Zap,
} from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Body() {
  const services = [
    {
      icon: <Building2 className="w-5 h-5 md:w-[22.5px] md:h-5" />,
      bgColor: "bg-blue-100",
      title: "Депозити и сметки",
      description: "Savings accounts and deposit solutions",
      message: "Открий най-добрите депозитни продукти от водещи банки. Сравнявай лихвени проценти, срокове и условия, за да избереш най-подходящия начин да спестяваш сигурно и изгодно.",
    },
    {
      icon: <Home className="w-5 h-5 md:w-[22.5px] md:h-5" />,
      bgColor: "bg-green-100",
      title: "Ипотечни кредити",
      description: "Home mortgage loans",
      message: "Очаквайте скоро",

    },
    {
      icon: <CreditCard className="w-5 h-5 md:w-[22.5px] md:h-5" />,
      bgColor: "bg-purple-100",
      title: "Потребителски кредити",
      description: "Personal consumer loans",
      message: "Очаквайте скоро",
    },
    {
      icon: <BarChart4 className="w-5 h-5 md:w-[25px] md:h-5" />,
      bgColor: "bg-orange-100",
      title: "Финансови консултации",
      description: "Financial advisory services",
      message: "Очаквайте скоро",
    },
    {
      icon: <Umbrella className="w-5 h-5 md:w-[22.5px] md:h-5" />,
      bgColor: "bg-indigo-100",
      title: "Пенсионни фондове",
      description: "Retirement pension funds",
      message: "Очаквайте скоро",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      bgColor: "bg-teal-100",
      title: "Инвестиции",
      description: "Investment opportunities",
      message: "Очаквайте скоро",
    },
    {
      icon: <Zap className="w-5 h-5 md:w-[17.5px] md:h-5" />,
      bgColor: "bg-red-100",
      title: "Бързи кредити",
      description: "Quick loan solutions",
      message: "Очаквайте скоро",
    },
  ];

  return (
    <div className="relative bg-gray-50">
      {/* Hero Section */}
      <section className="w-full h-[300px] md:h-[400px] relative">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,64,175,1)_0%,rgba(59,130,246,1)_100%)]">
          <div className="absolute inset-0 opacity-20 bg-[url(/img.png)] bg-cover bg-center"></div>
        </div>

        <div className="relative max-w-[1280px] h-full mx-auto px-4 md:px-8 flex items-center">
          <div className="max-w-[715px]">
            <h1 className="font-bold text-white text-3xl md:text-5xl leading-[1.2]">
              Your Financial Future Starts Here
            </h1>
            <p className="mt-4 md:mt-6 font-normal text-white text-lg md:text-2xl leading-[1.5]">
              Discover comprehensive banking solutions tailored to your needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-bold text-gray-900 text-2xl md:text-3xl leading-[1.3] mb-3 md:mb-4">
            Explore Our Services
          </h2>
          <p className="font-normal text-gray-600 text-base md:text-lg leading-[1.5] max-w-[480px] mx-auto">
            Choose from our comprehensive range of financial products
          </p>
        </div>

        <div className="max-w-full md:max-w-[896px] mx-auto">
          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            {services.map((service, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-solid rounded-lg md:rounded-xl shadow-sm md:shadow-[0px_1px_2px_#0000000d] bg-white overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-4 md:px-6 md:py-6 hover:no-underline">
                  <div className="flex items-center w-full">
                    <div
                      className={`w-10 h-10 md:w-[46px] md:h-[52px] ${service.bgColor} rounded-md md:rounded-lg flex items-center justify-center`}
                    >
                      {service.icon}
                    </div>
                    <div className="ml-3 md:ml-4 text-left">
                      <div className="font-semibold text-gray-900 text-base md:text-lg leading-[1.5]">
                        {service.title}
                      </div>
                      <div className="font-normal text-gray-600 text-xs md:text-sm leading-[1.4]">
                        {service.description}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-3 md:pb-4">
                  <Card>
                    <CardContent className="p-3 md:p-4">
                      <p className="text-gray-600 text-sm md:text-base">
                        {service.message}
                      </p>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full h-[120px] md:h-[180px] bg-gray-900">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-full flex flex-col items-center justify-center">
          <div className="flex items-center">
            <div className="w-8 h-9 md:w-9 md:h-11 bg-blue-800 rounded-md md:rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="ml-2 md:ml-3 font-bold text-white text-lg md:text-xl leading-[1.5]">
              BankHub
            </div>
          </div>
          <div className="mt-2 md:mt-4 font-normal text-gray-400 text-sm md:text-base leading-[1.5]">
            Your trusted financial partner
          </div>
        </div>
      </footer>
    </div>
  );
}
  