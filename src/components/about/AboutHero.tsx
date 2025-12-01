import { Building2, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AboutHero = () => {
  const { elementRef: leftRef, isVisible: leftVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: rightRef, isVisible: rightVisible } = useScrollAnimation({ threshold: 0.2, rootMargin: "0px 0px -100px 0px" });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-corporate-navy-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-200/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Thinkvate Solutions */}
          <div
            ref={leftRef}
            className={`transition-all duration-1000 ${
              leftVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-corporate-navy-500/10 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-corporate-navy-600" />
              <span className="text-sm font-medium text-corporate-navy-700">Established 2024</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Thinkvate
              <br />
              <span className="text-corporate-navy-600">Solutions</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-corporate-navy-700 mb-8 leading-relaxed">
              Innovation in Industrial Intelligence
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Building the future of industrial ecosystems through intelligent technology solutions.
            </p>
          </div>

          {/* Right Side - Diligince.ai */}
          <div
            ref={rightRef}
            className={`transition-all duration-1000 delay-300 ${
              rightVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20 blur-3xl rounded-3xl" />
              
              <div className="relative bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">AI-Powered Platform</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Diligince.ai
                </h2>
                
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  AI-Powered Procurement Revolution
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
                  <span className="text-2xl font-bold text-primary-600">2025</span>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Connecting industrial plants with vendors, professionals, and logistics through intelligent automation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-corporate-navy-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-corporate-navy-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
