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
import Footer from "@/components/Footer";

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
        <title>Diligince.ai - AI-Powered Procurement Platform</title>
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
                  <img src="/logo-main-no-bg.svg" alt="Diligince.ai" />
                </div>
                <span className="text-xl font-bold text-[#153b60]">Diligince.ai</span>
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
                  to="/login"
                  className="bg-gradient-to-r from-[#153b60] to-[#1e4976] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Sign In
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
              Why Choose <span className="text-[#153b60]">Diligince.ai</span>?
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
            className="relative overflow-hidden py-16 md:py-20"
            id="benefits"
          >
            {/* Multi-Layer Animated Background */}
            {/* Layer 1 - Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAFA] via-white to-[#F5F5F5]"></div>

            {/* Layer 2 - Floating Geometric Shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-20 h-20 bg-corporate-navy-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-32 right-20 w-16 h-16 bg-corporate-navy-400/5 rounded-2xl blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-corporate-navy-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-corporate-navy-300/5 rounded-2xl blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-32 right-16 w-28 h-28 bg-corporate-navy-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Layer 3 - Animated Dot Grid */}
            <div
              className="absolute inset-0 opacity-[0.03] animate-grid-pulse"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(210, 64%, 23%) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            ></div>

            {/* Layer 4 - Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-corporate-navy-500/5 to-transparent rounded-full blur-3xl animate-orb-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-gradient-to-tl from-corporate-navy-400/5 to-transparent rounded-full blur-3xl animate-orb-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-gradient-to-br from-corporate-navy-300/5 to-transparent rounded-full blur-3xl animate-orb-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Layer 5 - Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-corporate-navy-500/20 rounded-full animate-float-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${10 + Math.random() * 5}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Layer 6 - Scanline Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-corporate-navy-500/10 to-transparent animate-scanline"></div>
            </div>

            {/* Content Wrapper */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center mb-12 md:mb-16">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-white/90 backdrop-blur-sm border border-corporate-navy-500/20 rounded-full shadow-sm">
                  <svg className="w-4 h-4 text-corporate-navy-500 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-semibold text-corporate-navy-700">Proven Results</span>
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-5xl font-extrabold text-[#333333] mb-3 tracking-tight">
                  AI-Driven{' '}
                  <span className="bg-gradient-to-r from-corporate-navy-500 via-corporate-navy-400 to-corporate-navy-300 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                    Results
                  </span>
                </h3>

                {/* Description */}
                <p className="text-base md:text-xl text-corporate-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
                  See why thousands of businesses trust our intelligent platform
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {benefits.map((benefit, index) => (
                  <article
                    key={index}
                    className="group text-center bg-white/80 backdrop-blur-sm border border-corporate-navy-500/5 rounded-2xl p-6 md:p-8 hover:-translate-y-3 hover:scale-[1.02] hover:border-corporate-navy-500/20 hover:bg-white/95 transition-all duration-500 animate-fade-up-stagger"
                    style={{
                      boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.9), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'backwards'
                    }}
                    aria-label={`Benefit card: ${benefit.title}`}
                  >
                    {/* Icon Container */}
                    <div
                      className="w-16 h-16 bg-gradient-to-br from-corporate-navy-500/8 via-corporate-navy-400/8 to-corporate-navy-300/8 border-2 border-corporate-navy-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg transition-all duration-500 animate-gradient-shift bg-[length:200%_auto]"
                      style={{
                        boxShadow: 'inset 0 2px 8px rgba(21, 59, 96, 0.05)'
                      }}
                    >
                      <benefit.icon className="w-7 h-7 text-corporate-navy-600" />
                    </div>

                    {/* Title */}
                    <h4
                      className="text-xl md:text-2xl font-bold text-[#333333] mb-2 tracking-tight leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        animation: 'fade-up-stagger 0.4s ease-out forwards',
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {benefit.title}
                    </h4>

                    {/* Subtitle */}
                    <p
                      className="text-base text-corporate-navy-600 font-semibold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        animation: 'fade-up-stagger 0.4s ease-out forwards',
                        animationDelay: `${index * 100 + 100}ms`
                      }}
                    >
                      {benefit.subtitle}
                    </p>

                    {/* Description */}
                    <p
                      className="text-sm md:text-base text-corporate-gray-500 leading-relaxed font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        animation: 'fade-up-stagger 0.4s ease-out forwards',
                        animationDelay: `${index * 100 + 200}ms`
                      }}
                    >
                      {benefit.description}
                    </p>
                  </article>
                ))}
              </div>
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
      <section className="py-20 md:py-28 lg:py-36 relative overflow-hidden" id="modules">
        {/* Background Pattern */}
        {/* <div className="absolute inset-0 opacity-10">
 ̰          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
        linear-gradient(#153b60 1px, transparent 1px),
        linear-gradient(90deg, #153b60 1px, transparent 1px)
      `,
              backgroundSize: "50px 50px"
            }}
          ></div>
        </div> */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
        linear-gradient(#153b60 1px, transparent 1px),
        linear-gradient(90deg, #153b60 1px, transparent 1px)
      `,
              backgroundSize: "50px 50px",
              WebkitMaskImage: "radial-gradient(circle, white 60%, transparent 100%)",
              maskImage: "radial-gradient(circle, white 60%, transparent 100%)",
            }}
          ></div>
        </div>
        {/* Edge Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(250,250,250,0.6)_100%)]"></div>

        {/* Minimal Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[12%] w-2 h-2 bg-[#153b60] rounded-full opacity-[0.08] animate-float" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-[35%] right-[18%] w-2.5 h-2.5 bg-[#1e4976] rounded-full opacity-[0.10] animate-float" style={{ animationDelay: '2s', animationDuration: '9s' }}></div>
          <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-[#2a5f8f] rounded-full opacity-[0.09] animate-float" style={{ animationDelay: '4s', animationDuration: '7s' }}></div>
          <div className="absolute top-[60%] right-[25%] w-3 h-3 bg-[#153b60] rounded-full opacity-[0.08] animate-float" style={{ animationDelay: '1s', animationDuration: '8.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Premium Section Header */}
          <div className="text-center mb-24 lg:mb-32 animate-slide-up">
            {/* Elevated Neumorphic Badge */}
            <div
              className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3.5 mb-10 border border-[#153b60]/8 animate-pulse-slow group cursor-default"
              style={{
                boxShadow: '6px 6px 16px #e0e0e0, -6px -6px 16px #ffffff'
              }}
            >
              <div className="relative">
                <Building2 className="w-6 h-6 text-[#153b60] group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-[#153b60] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <span className="text-sm font-bold text-[#153b60] tracking-[0.15em] uppercase">Enterprise Solutions</span>
            </div>

            {/* Enhanced Title with Refined Typography */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] mb-10 px-4 leading-[1.1] tracking-tighter">
              Enterprise{" "}
              <span className="relative inline-block">
                <span
                  className="bg-gradient-to-r from-[#153b60] via-[#1e4976] to-[#2a5f8f] bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'gradient-text-shift 5s ease infinite'
                  }}
                >
                  Solutions
                </span>
              </span>
            </h2>

            {/* Refined Description */}
            <p className="text-base md:text-lg text-[#666666] max-w-3xl mx-auto leading-relaxed font-light px-6 tracking-wide mb-16">
              Comprehensive platform solutions designed for organizations seeking to streamline their procurement processes and maximize operational efficiency.
            </p>
          </div>

          {/* Premium Service Cards Grid */}
          <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const keyFeatures = service.features.slice(0, 3);

              return (
                <article
                  key={index}
                  className={`group bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] border border-[#153b60]/6 cursor-default ${visibleItems[index] ? "opacity-0 animate-fade-in" : "opacity-100"}`}
                  style={{
                    animationDelay: visibleItems[index] ? `${index * 0.2}s` : "0s",
                    animationFillMode: "forwards",
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(21, 59, 96, 0.12), 0 4px 12px rgba(21, 59, 96, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(21, 59, 96, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.borderColor = 'rgba(21, 59, 96, 0.06)';
                  }}
                  aria-label={`${service.title} enterprise solution card`}
                >
                  {/* Refined Icon Container */}
                  <div className="mb-8 relative">
                    <div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#153b60] via-[#1e4976] to-[#2a5f8f] flex items-center justify-center transition-all duration-500 group-hover:scale-[1.08] group-hover:rotate-4 relative overflow-hidden"
                      style={{
                        boxShadow: '0 8px 24px rgba(21, 59, 96, 0.25)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <IconComponent className="w-8 h-8 text-white relative z-10 transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-white blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-br from-[#153b60]/20 to-[#2a5f8f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  </div>

                  {/* Refined Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-4 transition-all duration-300 group-hover:text-[#153b60] leading-tight tracking-tight">
                    {service.title}
                    <div className="h-1 w-12 bg-gradient-to-r from-[#153b60] to-[#2a5f8f] rounded-full mt-3 transition-all duration-500 group-hover:w-24"></div>
                  </h3>

                  {/* Refined Description */}
                  <p className="text-[#666666] text-sm md:text-base leading-relaxed mb-8 font-normal transition-colors duration-300 group-hover:text-[#4a4a4a]">
                    {service.description}
                  </p>

                  {/* Premium Key Features */}
                  <div className="space-y-4 mb-8">
                    {keyFeatures.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start space-x-3 transition-all duration-300 group-hover:translate-x-1"
                        style={{ transitionDelay: `${featureIndex * 50}ms` }}
                      >
                        <CheckCircle className="w-6 h-6 text-[#153b60] flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-[#333333] font-medium text-sm md:text-base leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Premium Metrics Display */}
                  {/* {service.metrics && (
                    <div 
                      className="rounded-2xl p-6 mb-8 transition-all duration-500 group-hover:scale-105 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
                        boxShadow: 'inset 4px 4px 12px #e5e5e5, inset -4px -4px 12px #ffffff'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#153b60]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="text-center relative z-10">
                        <div className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-[#153b60] via-[#1e4976] to-[#2a5f8f] bg-clip-text text-transparent leading-none tracking-tighter">
                          {service.metrics.improvement}
                        </div>
                        <div className="text-sm md:text-base text-[#828282] font-semibold tracking-wider uppercase">
                          {service.metrics.description}
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* Premium CTA Button */}
                  <button
                    className="w-full bg-white text-[#153b60] font-bold text-base md:text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group/btn relative overflow-hidden"
                    style={{
                      boxShadow: '4px 4px 12px #e5e5e5, -4px -4px 12px #ffffff'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'inset 3px 3px 8px #e5e5e5, inset -3px -3px 8px #ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '4px 4px 12px #e5e5e5, -4px -4px 12px #ffffff';
                    }}
                  >
                    <span className="relative z-10 transition-all duration-300 group-hover/btn:tracking-wider">Learn More</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover/btn:translate-x-2 relative z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#153b60] to-[#2a5f8f] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500"></div>
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
                <span>Sign In</span>
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

      <Footer />
    </div>
  );
};
export default Index;
