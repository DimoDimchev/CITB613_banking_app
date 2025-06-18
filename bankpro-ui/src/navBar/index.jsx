import { NavLink } from 'react-router-dom';
import {
    Building2
  } from "lucide-react";
  import React from "react";

function Navbar() {
  return (
    <header className="w-full h-[65px] bg-white border-b border-solid shadow-[0px_1px_2px_#0000000d]">
          <div className="max-w-[1280px] h-16 mx-auto px-8">
            <div className="flex items-center justify-between h-full">
                <NavLink
                    to="/"
                >
              <div className="flex items-center h-11">
                  <div className="w-9 h-11 bg-blue-800 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3 font-bold text-gray-900 text-xl leading-7">
                    BankHub
                  </div>
              </div>
                </NavLink>

              <nav className="flex space-x-8">
                <NavLink
                    to="/"
                    className="font-medium text-gray-700 text-base leading-6"
                >
                    Home
                </NavLink>
                <NavLink
                    to="/deposit-search"
                    className="font-medium text-gray-700 text-base leading-6"
                >
                    Deposit Search
                </NavLink>
              </nav>
            </div>
          </div>
        </header>
  );
}

export default Navbar;