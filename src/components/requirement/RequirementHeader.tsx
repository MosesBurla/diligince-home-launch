
import React from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const RequirementHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[#1890ff] text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-xl"
          >
            <span>Diligince.ai</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium opacity-90 hover:opacity-100">
              Dashboard
            </Link>
            <Link to="/create-requirement" className="text-sm font-medium opacity-90 hover:opacity-100">
              Requirements
            </Link>
            <Link to="/" className="text-sm font-medium opacity-90 hover:opacity-100">
              Stakeholders
            </Link>
            <Link to="/" className="text-sm font-medium opacity-90 hover:opacity-100">
              Messages
            </Link>
            <Link to="/" className="text-sm font-medium opacity-90 hover:opacity-100">
              Documents
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" className="text-white hover:bg-[#0c80e6] hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button size="icon" variant="ghost" className="text-white hover:bg-[#0c80e6] hover:text-white">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            size="icon" 
            variant="ghost" 
            className="md:hidden text-white hover:bg-[#0c80e6]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1890ff] pb-4">
          <nav className="flex flex-col gap-2 px-4">
            <Link to="/" className="p-2 text-sm font-medium text-white opacity-90 hover:opacity-100">
              Dashboard
            </Link>
            <Link to="/create-requirement" className="p-2 text-sm font-medium text-white opacity-90 hover:opacity-100">
              Requirements
            </Link>
            <Link to="/" className="p-2 text-sm font-medium text-white opacity-90 hover:opacity-100">
              Stakeholders
            </Link>
            <Link to="/" className="p-2 text-sm font-medium text-white opacity-90 hover:opacity-100">
              Messages
            </Link>
            <Link to="/" className="p-2 text-sm font-medium text-white opacity-90 hover:opacity-100">
              Documents
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default RequirementHeader;
