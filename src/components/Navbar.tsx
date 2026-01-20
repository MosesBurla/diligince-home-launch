
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`w-full py-4 px-4 md:px-8 fixed top-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary shadow-lg" : "bg-primary"
      }`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={location.pathname === '/signup' || location.pathname === '/signin' || location.pathname === '/login'
                ? "/diligence-no-bg-white.svg"
                : "/logo-main-no-bg.svg"
              }
              alt="Diligince.ai"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-white">Diligince.ai</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`text-white hover:text-primary-foreground/80 transition-colors ${location.pathname === '/' ? 'text-primary-foreground/80 font-medium border-b border-primary-foreground/20' : ''}`}>
            Home
          </Link>
          <Link to="/about" className={`text-white hover:text-primary-foreground/80 transition-colors ${location.pathname === '/about' ? 'text-primary-foreground/80 font-medium border-b border-primary-foreground/20' : ''}`}>
            About
          </Link>
          <Link to="/pricing" className={`text-white hover:text-primary-foreground/80 transition-colors ${location.pathname === '/pricing' ? 'text-primary-foreground/80 font-medium border-b border-primary-foreground/20' : ''}`}>
            Pricing
          </Link>
          <Link to="/contact" className={`text-white hover:text-primary-foreground/80 transition-colors ${location.pathname === '/contact' ? 'text-primary-foreground/80 font-medium border-b border-primary-foreground/20' : ''}`}>
            Contact
          </Link>
          {/* <Button variant="outline" className="mr-2 bg-transparent border-white text-white hover:bg-white hover:text-primary transition-all duration-200" asChild>
            <Link to="/signin">Log In</Link>
          </Button>
          <Button className="bg-white text-primary hover:bg-primary/5 hover:text-primary transition-all duration-200" asChild>
            <Link to="/signup">Sign In</Link>
          </Button> */}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMenu} className="text-white hover:bg-primary/80">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-primary shadow-lg animate-fade-in border-t border-primary/80">
          <div className="flex flex-col py-4 px-4">
            <Link to="/" className={`py-2 text-white hover:text-primary-foreground/80 transition-colors ${location.pathname === '/' ? 'text-primary-foreground/80 font-medium' : ''}`}>
              Home
            </Link>
            <Link to="/about" className={`py-2 text-white hover:text-primary-foreground/80 transition-colors ${location.pathname === '/about' ? 'text-primary-foreground/80 font-medium' : ''}`}>
              About
            </Link>
            <Link to="/pricing" className={`py-2 text-white hover:text-primary-foreground/80 transition-colors ${location.pathname === '/pricing' ? 'text-primary-foreground/80 font-medium' : ''}`}>
              Pricing
            </Link>
            <Link to="/contact" className={`py-2 text-white hover:text-primary-foreground/80 transition-colors ${location.pathname === '/contact' ? 'text-primary-foreground/80 font-medium' : ''}`}>
              Contact
            </Link>
            <div className="flex flex-col space-y-2 mt-4">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button className="bg-white text-primary hover:bg-primary/5 hover:text-primary" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
