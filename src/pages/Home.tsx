import React from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const services = [
    {
      title: "For Industries",
      description:
        "Post requirements and connect with qualified professionals and vendors to solve your business challenges",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      features: ["Post Requirements", "Review Proposals", "Manage Projects", "Track Progress"],
    },
    {
      title: "For Professionals",
      description: "Discover opportunities, showcase your expertise, and collaborate with leading industries",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
      features: ["Browse Opportunities", "Submit Proposals", "Direct Communication", "Build Portfolio"],
    },
    {
      title: "For Vendors",
      description: "Access business requirements, submit competitive quotations, and grow your client base",
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpg?auto=compress&cs=tinysrgb&w=800",
      features: ["View Requirements", "Send Quotations", "Negotiate Terms", "Deliver Solutions"],
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
      color: "text-[#2F80ED] bg-[#2F80ED]/10",
    },
    {
      step: "02",
      title: "Get Proposals",
      description: "Professionals show interest and vendors submit competitive quotations",
      icon: Target,
      color: "text-[#27AE60] bg-[#27AE60]/10",
    },
    {
      step: "03",
      title: "Collaborate & Deliver",
      description: "Direct communication, project tracking, and successful delivery with trust",
      icon: Workflow,
      color: "text-[#F2994A] bg-[#F2994A]/10",
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
      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-50 flex justify-center">
        <div className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl w-[80%]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#2F80ED] rounded-md flex items-center justify-center font-bold text-white">
                  D
                </div>
                <span className="text-xl font-bold text-[#1A2A4F]">Deligence.ai</span>
              </div>

              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-[#333333] hover:text-[#2F80ED] transition-colors font-medium">
                  Features
                </a>
                <a href="#modules" className="text-[#333333] hover:text-[#2F80ED] transition-colors font-medium">
                  Modules
                </a>
                <a href="#benefits" className="text-[#333333] hover:text-[#2F80ED] transition-colors font-medium">
                  Benefits
                </a>
                <a href="#pricing" className="text-[#333333] hover:text-[#2F80ED] transition-colors font-medium">
                  Pricing
                </a>
                <a href="#contact" className="text-[#333333] hover:text-[#2F80ED] transition-colors font-medium">
                  Contact
                </a>
              </nav>

              <Link
                to="/login"
                className="bg-gradient-to-r from-[#1A2A4F] to-[#2F80ED] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-purple-800 text-white text-white pt-40 pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#27AE60] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              {/* AI Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 ">
                <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-pulse"></div>
                {/* <span className="text-sm font-medium">World's #1 AI-Native Business Platform</span> */}
                <span className="text-sm font-medium">World's #1 B2B & B2C AI-Native Business Platform</span>

                <span className="bg-[#F2994A] text-white text-xs px-2 py-1 rounded-full font-bold">New</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Streamline Requirements,
                <span className="block text-[#bfdbfe]">Connect Expertise</span>
                <span className="block text-4xl md:text-5xl">with Deligence’s</span>
                <span className="block text-[#bfdbfe]">Powerful AI Platform</span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
                From automated requirement matching to intelligent vendor selection—our AI-driven platform empowers
                industries to streamline operations, connect with qualified professionals, and optimize business
                outcomes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/signup"
                  className="bg-white text-black px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center space-x-2 font-semibold backdrop-blur-sm">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            {/* Right Dashboard Preview */}
            <div className="relative z-10">
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-white-600">Deligence.AI Dashboard</span>
                  </div>

                  {/* Dashboard Content */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white-600">EFFICIENCY RATE</span>
                      <span className="text-sm text-[#fff] font-medium">Live</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-[#fff]">98.5%</span>
                      <span className="text-sm bg-[#27AE60]/10 text-[#27AE60] px-2 py-1 rounded-full font-medium">
                        +12%
                      </span>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3 mt-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-white-600">Requirements Matched</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#2F80ED] to-[#27AE60] h-2 rounded-full"
                          style={{ width: "87%" }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-white-600">Vendor Response Rate</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#F2994A] to-[#27AE60] h-2 rounded-full"
                          style={{ width: "94%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Cards */}
                <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-white/30 text-white border border-gray-100">
                  <div className="text-center">
                    <div className="text-sm text-[#f2994a] mb-1">MONTHLY ROI</div>
                    <div className="text-2xl font-bold text-[#000]">$2.4M</div>
                    <div className="text-xs text-[#27AE60] font-medium">↗ +23%</div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-white/30 text-white border border-gray-100">
                  <div className="text-center">
                    <div className="text-sm text-[#01bab5] mb-1">ACTIVE PROJECTS</div>
                    <div className="text-2xl font-bold text-[#000]">156</div>
                    <div className="text-xs text-[#27AE60] font-medium">↗ +8%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #2F80ED 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#2F80ED]/5 border border-[#2F80ED]/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#2F80ED] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#2F80ED]">AI-Powered Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
              Why Choose <span className="text-[#2F80ED]">Deligince.ai</span>?
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
                <div className="w-20 h-20 bg-gradient-to-br from-[#2F80ED]/10 to-[#27AE60]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2F80ED]/20 to-[#27AE60]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <feature.icon className="w-8 h-8 text-[#2F80ED]" />
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[#2F80ED] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#828282] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-[#1A2A4F] via-[#2F80ED] to-purple-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute bottom-0 right-0 w-60 h-60 bg-[#27AE60] rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-white mb-4">AI-Driven Results</h3>
              <p className="text-blue-100 text-xl">See why thousands of businesses trust our intelligent platform</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-3xl font-bold text-white mb-2">{benefit.title}</h4>
                  <p className="text-blue-200 font-semibold mb-3 text-lg">{benefit.subtitle}</p>
                  <p className="text-blue-100 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-[#FAFAFA] to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#2F80ED] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#27AE60] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#27AE60]/5 border border-[#27AE60]/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#27AE60]">AI-Powered Workflow</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">How It Works</h2>
            <p className="text-[#828282] text-lg max-w-2xl mx-auto">
              Simple, intelligent, and effective. Our AI streamlines your business processes in three easy steps.
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#2F80ED] via-[#27AE60] to-[#F2994A] transform -translate-y-1/2 rounded-full opacity-30"></div>

            <div className="grid lg:grid-cols-3 gap-12 relative">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#E0E0E0] hover:border-[#2F80ED]/30 group hover:-translate-y-2">
                    <div className="text-center">
                      <div
                        className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <step.icon className="w-10 h-10 relative z-10" />
                      </div>
                      <div className="text-6xl font-bold text-[#E0E0E0] mb-4 group-hover:text-[#2F80ED]/20 transition-colors">
                        {step.step}
                      </div>
                      <h3 className="text-2xl font-bold text-[#333333] mb-4 group-hover:text-[#2F80ED] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-[#828282] leading-relaxed text-lg">{step.description}</p>
                    </div>
                  </div>

                  {/* Step connector for mobile */}
                  {index < howItWorks.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-6 mb-6">
                      <div className="w-8 h-8 bg-[#2F80ED]/10 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-[#2F80ED]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#333333] mb-4">Our Services</h2>
            <p className="text-[#828282] text-lg max-w-2xl mx-auto">
              Tailored solutions for every stakeholder in the business ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#E0E0E0]"
              >
                <img src={service.image} alt={service.title} className="w-full h-56 object-cover" />
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-[#333333] mb-3">{service.title}</h3>
                  <p className="text-[#828282] mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-[#333333]">
                        <CheckCircle className="w-4 h-4 text-[#27AE60] mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-[#2F80ED] to-[#27AE60] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1A2A4F] via-[#2F80ED] to-purple-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-80 h-80 bg-[#27AE60]/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-white">Join 10,000+ Businesses</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block bg-[#F2994A] bg-clip-text text-transparent">Business with AI?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful businesses already using Deligince.ai's intelligent platform to streamline
            operations, connect with qualified professionals, and accelerate growth through AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="bg-white text-[#1A2A4F] px-10 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border-2 border-white/30 text-white px-10 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 font-bold text-lg backdrop-blur-sm hover:border-white/50 flex items-center justify-center space-x-2">
              <span>Schedule Demo</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        {/* Background Pattern */}
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
      </section>

      {/* Footer */}
      <footer className="bg-[#333333] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2F80ED] to-[#27AE60] rounded-lg flex items-center justify-center font-bold text-white">
                  D
                </div>
                <span className="text-2xl font-bold">Deligence.ai</span>
              </div>
              <p className="text-gray-300 mb-4">
                Connecting industries, professionals, and vendors through intelligent business solutions for accelerated
                growth and success.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-[#2F80ED] transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-[#2F80ED] transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Deligence.ai. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
