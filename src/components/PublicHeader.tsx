import React from "react";
import { Link, useLocation } from "react-router-dom";

const PublicHeader = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <div className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl w-[80%]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#2F80ED] rounded-md flex items-center justify-center font-bold text-white">
                <img src="/logo-main-no-bg.svg" alt="Diligince.ai" />
              </div>
              <span className="text-xl font-bold text-[#1A2A4F]">Diligince.ai</span>
            </Link>
            <div className="flex items-center space-x-6">
              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link 
                  to="/about" 
                  className={`transition-colors font-medium ${
                    isActive('/about') 
                      ? 'text-[#2F80ED]' 
                      : 'text-[#333333] hover:text-[#2F80ED]'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/pricing" 
                  className={`transition-colors font-medium ${
                    isActive('/pricing') 
                      ? 'text-[#2F80ED]' 
                      : 'text-[#333333] hover:text-[#2F80ED]'
                  }`}
                >
                  Pricing
                </Link>
                <Link 
                  to="/contact" 
                  className={`transition-colors font-medium ${
                    isActive('/contact') 
                      ? 'text-[#2F80ED]' 
                      : 'text-[#333333] hover:text-[#2F80ED]'
                  }`}
                >
                  Contact
                </Link>
              </nav>

              <Link
                to="/signin"
                className="bg-gradient-to-r from-[#1A2A4F] to-[#2F80ED] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;