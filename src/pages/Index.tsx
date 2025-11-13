import React, { useEffect } from "react";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Clock,
  Star,
  Target,
  Workflow,
  MessageSquare,
  FileText,
  Award,
  BarChart3,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useStaggeredAnimation } from "../hooks/useScrollAnimation";
import { useUser } from "@/contexts/UserContext";
import { getDashboardRoute } from "@/types/shared";
import HeroSection from "@/components/HeroSection";

const Index: React.FC = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  
  // Call hooks before any conditional returns
  const { elementRef: servicesRef, visibleItems } = useStaggeredAnimation(3, 200);
  
  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!isLoading && user) {
      const dashboardUrl = getDashboardRoute(user);
      navigate(dashboardUrl, { replace: true });
    }
  }, [user, isLoading, navigate]);
  
  // Show nothing while checking auth or redirecting
  if (isLoading || user) {
    return null;
  }
  const services = [
    {
      title: "Enterprise Industries",
      description:
        "Streamline procurement processes with AI-powered vendor matching and requirement management for enterprise-level efficiency",
      icon: Building2,
      gradient: "from-[#153b60] to-[#1e4976]",
      features: [
        "AI-Powered Vendor Matching",
        "Automated RFQ Processing",
        "Real-time Project Analytics",
        "Compliance Management",
        "ROI Optimization Tools",
      ],
      metrics: {
        improvement: "65% Faster",
        description: "Procurement Cycles",
      },
    },
    {
      title: "Certified Professionals",
      description:
        "Connect with vetted industry experts and showcase your expertise through our premium professional network platform",
      icon: Users,
      gradient: "from-[#1e4976] to-[#2a5f8f]",
      features: [
        "Verified Expert Network",
        "Skills Assessment Tools",
        "Portfolio Management",
        "Direct Client Communication",
        "Performance Analytics",
      ],
      metrics: {
        improvement: "85% Success",
        description: "Project Completion Rate",
      },
    },
    {
      title: "Premium Vendors",
      description:
        "Access high-value opportunities and deliver exceptional solutions through our enterprise vendor marketplace",
      icon: Truck,
      gradient: "from-[#2a5f8f] to-[#3a7baf]",
      features: [
        "Enterprise Opportunity Access",
        "Automated Quote Generation",
        "Supply Chain Integration",
        "Quality Assurance Tools",
        "Payment Protection",
      ],
      metrics: {
        improvement: "40% Higher",
        description: "Contract Values",
      },
    },
  ];
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Connect with the right professionals in minutes, not days",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Enterprise-grade security with verified professionals",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Access talent and opportunities from around the world",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Data-driven insights to optimize your business decisions",
    },
  ];
  const howItWorks = [
    {
      step: "01",
      title: "Post Your Requirements",
      description: "Industries post detailed project requirements with budget and timeline",
      icon: FileText,
      color: "text-[#153b60] bg-[#153b60]/10",
    },
    {
      step: "02",
      title: "Get Proposals",
      description: "Professionals show interest and vendors submit competitive quotations",
      icon: Target,
      color: "text-[#1e4976] bg-[#1e4976]/10",
    },
    {
      step: "03",
      title: "Collaborate & Deliver",
      description: "Direct communication, project tracking, and successful delivery with trust",
      icon: Workflow,
      color: "text-[#2a5f8f] bg-[#2a5f8f]/10",
    },
  ];
  const benefits = [
    {
      icon: Clock,
      title: "75% Faster",
      subtitle: "Project Completion",
      description: "Streamlined workflows reduce project timelines significantly",
    },
    {
      icon: Star,
      title: "98% Success",
      subtitle: "Rate",
      description: "High-quality matches lead to successful project outcomes",
    },
    {
      icon: Award,
      title: "24/7 Support",
      subtitle: "Available",
      description: "Round-the-clock assistance for all your business needs",
    },
  ];
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Helmet>
        <title>Diligence.ai - AI-Powered Procurement Platform</title>
        <meta
          name="description"
          content="Streamline your procurement process with AI-powered vendor matching, requirement management, and workflow automation."
        />
      </Helmet>

      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-50 flex justify-center">
        <div className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl w-[80%]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#fff] rounded-md flex items-center justify-center font-bold text-white">
                  <img src="/logo-main-no-bg.svg" alt="Diligence.ai" />
                </div>
                <span className="text-xl font-bold text-[#153b60]">Diligence.ai</span>
              </Link>
              <div className="flex items-center space-x-6">
                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link to="/about" className="text-[#333333] hover:text-[#153b60] transition-colors font-medium">
                    About
                  </Link>
                  <Link to="/pricing" className="text-[#333333] hover:text-[#153b60] transition-colors font-medium">
                    Pricing
                  </Link>
                  <Link to="/contact" className="text-[#333333] hover:text-[#153b60] transition-colors font-medium">
                    Contact
                  </Link>
                </nav>

                <Link
                  to="/signin"
                  className="bg-gradient-to-r from-[#153b60] to-[#1e4976] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-white relative" id="features">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
        <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #153b60 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#153b60]/5 border border-[#153b60]/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#153b60] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#153b60]">AI-Powered Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
              Why Choose <span className="text-[#153b60]">Diligence.ai</span>?
            </h2>
            <p className="text-[#828282] text-lg max-w-2xl mx-auto">
              Experience the power of artificial intelligence in business connections with our comprehensive platform
              features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:-translate-y-3 transition-all duration-500"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#153b60]/10 to-[#1e4976]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#153b60]/20 to-[#1e4976]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <feature.icon className="w-8 h-8 text-[#153b60]" />
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[#153b60] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#828282] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div
            className=" rounded-3xl p-8 md:p-12 relative overflow-hidden"
            id="benefits"
            style={{
                    boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff'
                  }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute bottom-0 right-0 w-60 h-60 bg-[#1e4976] rounded-full blur-3xl animate-pulse"
                style={{
                  animationDelay: "1s",
                }}
              ></div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-black mb-4">AI-Driven Results</h3>
              <p className="text-black text-xl">See why thousands of businesses trust our intelligent platform</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300 bg-white rounded-3xl p-8"
                  
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#153b60]/10 to-[#1e4976]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300">
                    <benefit.icon className="w-8 h-8 text-[#153b60]" />
                  </div>
                  <h4 className="text-3xl font-bold text-[#333333] mb-2">{benefit.title}</h4>
                  <p className="text-[#153b60] font-semibold mb-3 text-lg">{benefit.subtitle}</p>
                  <p className="text-[#828282] leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-[#FAFAFA] to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#153b60] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#1e4976] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-[#153b60]/5 border border-[#153b60]/20 rounded-full px-4 py-2 mb-6 relative">
              <div className="absolute inset-0 bg-[#153b60]/10 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-[#153b60] rounded-full animate-pulse relative z-10"></div>
              <span className="text-sm font-medium text-[#153b60] relative z-10">AI-Powered Workflow</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
              How It <span className="text-[#153b60]">Works</span>
            </h2>
            
            {/* Visual Separator */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#153b60]"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#153b60]/50 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-[#1e4976]"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1e4976]/50 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-[#2a5f8f]"></div>
            </div>
            
            <p className="text-[#828282] text-lg max-w-2xl mx-auto">
              Simple, intelligent, and effective. Our AI streamlines your business processes in three easy steps.
            </p>
          </div>

          <div className="relative">
            {/* Enhanced Desktop Connection Line with Animated Flow */}
            <div className="hidden lg:block absolute top-[120px] left-[10%] right-[10%] h-1">
              {/* Base Line */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#153b60] via-[#1e4976] to-[#2a5f8f] rounded-full opacity-20"></div>
              
              {/* Animated Flowing Dots */}
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="w-3 h-3 bg-[#153b60] rounded-full animate-flow-1 shadow-lg"></div>
                <div className="w-3 h-3 bg-[#1e4976] rounded-full animate-flow-2 shadow-lg"></div>
                <div className="w-3 h-3 bg-[#2a5f8f] rounded-full animate-flow-3 shadow-lg"></div>
              </div>
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="lg:hidden absolute left-8 top-0 bottom-0 w-px">
              <div className="absolute inset-0 bg-gradient-to-b from-[#153b60] via-[#1e4976] to-[#2a5f8f] opacity-20"></div>
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#153b60] rounded-full animate-pulse-flow-down shadow-lg"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 relative">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  {/* Enhanced Step Card */}
                  <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-[#E0E0E0] hover:border-[#153b60]/30 group hover:-translate-y-2 relative overflow-hidden">
                    {/* Gradient Background on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#153b60]/5 via-transparent to-[#1e4976]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating Step Number Badge */}
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#153b60]/5 border-2 border-[#153b60]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10">
                      <span className="text-lg font-bold text-[#153b60]">{step.step}</span>
                    </div>
                    
                    <div className="text-center relative z-10">
                      {/* Enhanced Icon Container */}
                      <div className="relative inline-block mb-8">
                        <div
                          className={`w-24 h-24 ${step.color} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden shadow-lg`}
                        >
                          {/* Outer Glow Ring */}
                          <div className="absolute -inset-2 bg-gradient-to-br from-[#153b60]/20 to-[#1e4976]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
                          
                          {/* Inner Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <step.icon className="w-12 h-12 relative z-10 text-[#153b60] group-hover:text-[#153b60] transition-all duration-300" />
                        </div>
                      </div>
                      <br></br>
                      {/* Title with Animated Underline */}
                      <h3 className="text-2xl font-bold text-[#333333] mb-4 group-hover:text-[#153b60] transition-colors duration-300 relative inline-block">
                        {step.title}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#153b60] group-hover:w-full transition-all duration-500"></span>
                      </h3>
                      
                      <p className="text-[#828282] leading-relaxed text-lg mb-6">{step.description}</p>
                      
                      {/* Activity Indicator Dots */}
                      <div className="flex justify-center gap-2 opacity-100 transition-opacity duration-500">
                        <div className="w-1.5 h-1.5 bg-[#153b60] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#1e4976] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#2a5f8f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Step Connector */}
                  {index < howItWorks.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-8 mb-8">
                      <div className="w-px h-12 bg-gradient-to-b from-[#153b60] via-[#1e4976] to-[#2a5f8f] opacity-30"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Enterprise Solutions */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden" id="modules">
        {/* Minimal Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #153b60 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center space-x-2 bg-[#153b60]/5 border border-[#153b60]/20 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-4 h-4 text-[#153b60]" />
              <span className="text-sm font-medium text-[#153b60]">Enterprise Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6">
              Enterprise <span className="text-[#153b60]">Solutions</span>
            </h2>
            
            {/* Minimal Decorative Line */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-[2px] bg-[#153b60]"></div>
              <div className="w-2 h-2 rounded-full bg-[#153b60]"></div>
              <div className="w-12 h-[2px] bg-[#153b60]"></div>
            </div>

            <p className="text-[#828282] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Empowering businesses with AI-driven procurement intelligence and seamless stakeholder collaboration
            </p>
          </div>

          {/* Service Cards Grid */}
          <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const keyFeatures = service.features.slice(0, 3);
              
              return (
                <article
                  key={index}
                  className={`group bg-white rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 opacity-0 ${visibleItems[index] ? "animate-fade-in" : ""}`}
                  style={{
                    animationDelay: visibleItems[index] ? `${index * 0.15}s` : "0s",
                    animationFillMode: "forwards",
                    boxShadow: '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff',
                  }}
                >
                  {/* Icon with Gradient Background */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#153b60] to-[#1e4976] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <IconComponent className="w-8 h-8 text-white relative z-10" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#333333] mb-3 group-hover:text-[#153b60] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <div className="w-12 h-1 bg-[#153b60]/30 rounded-full mb-4 group-hover:w-24 transition-all duration-300"></div>
                    <p className="text-[#828282] text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="mb-6">
                    <ul className="space-y-3">
                      {keyFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-[#333333]">
                          <CheckCircle className="w-4 h-4 text-[#153b60] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics Box with Neumorphic Design */}
                  <div 
                    className="rounded-2xl p-5 mb-6 group-hover:scale-105 transition-transform duration-300"
                    style={{
                      boxShadow: 'inset 3px 3px 6px #d1d1d1, inset -3px -3px 6px #ffffff',
                      background: '#fafafa'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#153b60] mb-1">
                        {service.metrics.improvement}
                      </div>
                      <div className="text-sm text-[#828282] font-medium">
                        {service.metrics.description}
                      </div>
                    </div>
                  </div>

                  {/* CTA Link */}
                  <button className="w-full group/btn flex items-center justify-center text-[#153b60] hover:text-[#1e4976] font-semibold text-base transition-all duration-300">
                    <span className="relative">
                      Learn More
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#153b60] group-hover/btn:w-full transition-all duration-300"></span>
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-2" />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Ready to Transform */}
      <section className="py-32 bg-[#FAFAFA] relative overflow-hidden">
        {/* Minimal Geometric Background Elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          {/* Top Right Circle */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full border-[80px] border-[#153b60] translate-x-1/3 -translate-y-1/3"></div>
          {/* Bottom Left Square */}
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] border-[60px] border-[#1e4976] -translate-x-1/4 translate-y-1/4 rotate-12"></div>
          {/* Center Triangle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[200px] border-l-transparent border-r-[200px] border-r-transparent border-b-[300px] border-b-[#2a5f8f] opacity-50"></div>
        </div>

        {/* Floating Dots Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-[10%] w-3 h-3 bg-[#153b60] rounded-full animate-float"></div>
          <div className="absolute top-40 right-[15%] w-2 h-2 bg-[#1e4976] rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-[#2a5f8f] rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 right-[25%] w-3 h-3 bg-[#153b60] rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Minimal Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 border-2 border-[#153b60]/10" 
                 style={{
                   boxShadow: '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
                 }}>
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-[#153b60] rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-[#153b60] rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-semibold text-[#153b60] tracking-wide">TRUSTED BY 10,000+ BUSINESSES</span>
            </div>
          </div>

          {/* Main Heading with Modern Typography */}
          <div className="text-center mb-8">
            <h2 className="text-5xl md:text-7xl font-bold text-[#333333] mb-6 leading-[1.1] tracking-tight">
              Ready to Transform
              <span className="block mt-3 bg-gradient-to-r from-[#153b60] via-[#1e4976] to-[#2a5f8f] bg-clip-text text-transparent">
                Your Business?
              </span>
            </h2>
            
            {/* Minimal Decorative Line */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-12 h-[2px] bg-[#153b60]"></div>
              <div className="w-2 h-2 rounded-full bg-[#153b60]"></div>
              <div className="w-12 h-[2px] bg-[#153b60]"></div>
            </div>

            <p className="text-xl md:text-2xl text-[#828282] max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of successful businesses using AI-powered intelligence to streamline operations and accelerate growth.
            </p>
          </div>

          {/* CTA Buttons with Neumorphic Design */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link
              to="/signup"
              className="group relative bg-gradient-to-r from-[#153b60] to-[#1e4976] text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="relative flex items-center justify-center space-x-3">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </Link>

            <button 
              className="relative bg-white text-[#153b60] px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 group"
              style={{
                boxShadow: '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff'
              }}
            >
              <span className="flex items-center justify-center space-x-3">
                <span>Schedule Demo</span>
                <div className="w-8 h-8 rounded-full bg-[#153b60]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#153b60] group-hover:scale-110">
                  <div className="w-0 h-0 border-l-[6px] border-l-[#153b60] border-y-[4px] border-y-transparent ml-0.5 transition-colors duration-300 group-hover:border-l-white"></div>
                </div>
              </span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-[#828282] text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-[#153b60]" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-[#153b60]" />
              <span className="font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-[#153b60]" />
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-20 bg-white relative">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(45deg, #2F80ED 25%, transparent 25%), linear-gradient(-45deg, #2F80ED 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2F80ED 75%), linear-gradient(-45deg, transparent 75%, #2F80ED 75%)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#F2994A]/5 border border-[#F2994A]/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#F2994A] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#F2994A]">Trusted Worldwide</span>
            </div>
            <h2 className="text-4xl font-bold text-[#333333] mb-4">Trusted by Industry Leaders</h2>
            <p className="text-[#828282] text-xl">Join our growing community of AI-powered businesses</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-24 h-24 bg-gradient-to-br from-[#2F80ED] to-[#1A2A4F] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform duration-300">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-5xl font-bold text-[#333333] mb-3">2,500+</h3>
              <p className="text-[#828282] font-semibold text-lg">Active Industries</p>
            </div>
            <div>
              <div className="w-24 h-24 bg-gradient-to-br from-[#27AE60] to-[#2F80ED] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-5xl font-bold text-[#333333] mb-3">12,000+</h3>
              <p className="text-[#828282] font-semibold text-lg">AI-Matched Professionals</p>
            </div>
            <div>
              <div className="w-24 h-24 bg-gradient-to-br from-[#F2994A] to-[#27AE60] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-5xl font-bold text-[#333333] mb-3">8,000+</h3>
              <p className="text-[#828282] font-semibold text-lg">Verified Smart Vendors</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer - Modern Minimalistic Corporate Design */}
      <footer className="bg-[#FAFAFA] text-[#333333] py-20 relative overflow-hidden" id="contact">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(45deg, #153b60 25%, transparent 25%), linear-gradient(-45deg, #153b60 25%, transparent 25%)`,
              backgroundSize: "60px 60px",
              backgroundPosition: "0 0, 30px 30px",
            }}
          ></div>
        </div>

        {/* Geometric Accent Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#153b60]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1e4976]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Section - Brand & Newsletter */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16 pb-16 border-b-2 border-[#153b60]/10">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#153b60] to-[#1e4976] rounded-xl flex items-center justify-center">
                  <img src="/logo-main-no-bg.svg" alt="Diligence.ai" className="w-8 h-8" />
                </div>
                <span className="text-3xl font-bold text-[#153b60]">Diligence.ai</span>
              </div>
              <p className="text-[#828282] text-lg leading-relaxed mb-6 max-w-md">
                Connecting industries, professionals, and vendors through intelligent AI-powered business solutions for accelerated growth and success.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                <a href="#" className="group w-11 h-11 bg-white rounded-xl flex items-center justify-center hover:-translate-y-1 transition-all duration-300"
                   style={{
                     boxShadow: '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
                   }}>
                  <Globe className="w-5 h-5 text-[#828282] group-hover:text-[#153b60] transition-colors" />
                </a>
                <a href="#" className="group w-11 h-11 bg-white rounded-xl flex items-center justify-center hover:-translate-y-1 transition-all duration-300"
                   style={{
                     boxShadow: '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff'
                   }}>
                  <MessageSquare className="w-5 h-5 text-[#828282] group-hover:text-[#153b60] transition-colors" />
                </a>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="lg:pl-12">
              <h4 className="text-2xl font-bold text-[#333333] mb-4">Stay Updated</h4>
              <p className="text-[#828282] mb-6">
                Get the latest insights on AI-powered procurement and industry trends.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-xl bg-white text-[#333333] placeholder:text-[#828282] focus:outline-none focus:ring-2 focus:ring-[#153b60]/30 transition-all"
                  style={{
                    boxShadow: 'inset 3px 3px 6px #d1d1d1, inset -3px -3px 6px #ffffff'
                  }}
                />
                <button 
                  className="px-8 py-3 bg-gradient-to-r from-[#153b60] to-[#1e4976] text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Middle Section - Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {/* Company */}
            <div>
              <h4 className="text-lg font-bold text-[#333333] mb-4 relative inline-block">
                Company
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#153b60]"></span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Press Kit
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-lg font-bold text-[#333333] mb-4 relative inline-block">
                Solutions
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#153b60]"></span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    For Industries
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    For Professionals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    For Vendors
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-bold text-[#333333] mb-4 relative inline-block">
                Resources
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#153b60]"></span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-bold text-[#333333] mb-4 relative inline-block">
                Legal
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#153b60]"></span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="pt-8 border-t-2 border-[#153b60]/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#828282] text-sm">
                © 2025 Diligence.ai. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-[#828282] text-sm">Made with AI-Powered Intelligence</span>
                <div className="w-2 h-2 rounded-full bg-[#153b60] animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Index;
