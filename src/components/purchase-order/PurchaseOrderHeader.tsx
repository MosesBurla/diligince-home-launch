
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const PurchaseOrderHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/industry-dashboard" className="text-xl font-bold text-blue-600">
            Diligince.ai
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/industry-dashboard" 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/create-requirement" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Requirements
            </Link>
            <Link 
              to="/create-purchase-order" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Purchase Orders
            </Link>
            <Link 
              to="/industry-messages" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Messages
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/industry-dashboard" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PurchaseOrderHeader;
