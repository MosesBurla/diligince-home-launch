import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, Building2, Factory, Warehouse, Package, Network, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center mt-16 bg-white overflow-hidden">
      <div className="container-responsive max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center py-12 lg:py-16">
          {/* Left Content Section - 60% */}
          <div className="lg:col-span-3 text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Eyebrow Text */}
            <div className="inline-block">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#153b60] bg-[#153b60]/5 border border-[#153b60]/20 px-4 py-2 rounded-full">
                AI-Powered Industrial Network
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto lg:mx-0">
              Connect. Collaborate.{" "}
              <span className="text-[#153b60]">Transform</span> Your Industrial Operations
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Streamline vendor management, professional hiring, and logistics across India's industrial sector
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Button
                size="lg"
                className="bg-[#153b60] hover:bg-[#1e4976] text-white font-medium text-base shadow-md hover:shadow-lg transition-all duration-300 group"
                asChild
              >
                <Link to="/signup">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 font-medium text-base group"
              >
                <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                See How It Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 lg:pt-8">
              <p className="text-sm text-gray-500 mb-4">Trusted by 500+ industrial companies</p>
              <div className="flex gap-6 justify-center lg:justify-start items-center opacity-60">
                <Building2 className="h-8 w-8 text-gray-400" />
                <Factory className="h-8 w-8 text-gray-400" />
                <Warehouse className="h-8 w-8 text-gray-400" />
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Right Decorative Section - 40% */}
          <div className="lg:col-span-2 relative hidden lg:block">
            <div className="relative h-[500px] hero-gradient rounded-3xl p-8">
              {/* Floating Decorative Elements */}
              <div className="absolute top-12 left-12 w-32 h-32 hero-decoration-circle rounded-full animate-float" />
              <div className="absolute top-32 right-16 w-24 h-24 hero-decoration-square rounded-2xl animate-float-delayed rotate-12" />
              <div className="absolute bottom-24 left-20 w-28 h-28 hero-decoration-circle rounded-full animate-float" style={{ animationDelay: '1s' }} />

              {/* Icon Elements */}
              <div className="absolute top-20 right-12 bg-white rounded-2xl p-4 shadow-lg animate-float">
                <Network className="h-8 w-8 text-[#153b60]" />
              </div>
              <div className="absolute bottom-32 left-16 bg-white rounded-2xl p-4 shadow-lg animate-float-delayed">
                <Zap className="h-8 w-8 text-[#1e4976]" />
              </div>

              {/* Central Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[#153b60]/20 to-[#1e4976]/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

/* 
// OLD HERO SECTION - Commented out for reference
import { Button } from "@/components/ui/button";
import heroImage from "../assets/hero-image.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative min-h-[70vh] flex items-center mt-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center py-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in">
          Revolutionize Industrial Services with AI
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Connect with Vendors, Professionals and Logistics seamlessly with Industries in India
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="font-medium text-base hover:scale-105 transition-transform duration-300 hero-btn" 
            asChild
          >
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="font-medium text-base text-white border-white hover:bg-white/20 hover:text-white"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};
*/
