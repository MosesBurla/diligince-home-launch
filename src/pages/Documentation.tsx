import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { 
  BookOpen, Rocket, Building, Users, Truck, 
  FileText, Clock, ChevronRight, Play, ExternalLink
} from "lucide-react";

const Documentation = () => {
  const guideCategories = [
    {
      icon: Rocket,
      title: "Quick Start",
      description: "Get up and running in minutes",
      guides: ["Creating your account", "Completing your profile", "First requirement"],
      color: "from-green-100 to-green-200",
      iconColor: "text-green-600"
    },
    {
      icon: Building,
      title: "For Industries",
      description: "Manage procurement efficiently",
      guides: ["Posting requirements", "Managing quotes", "Purchase orders"],
      color: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "For Vendors",
      description: "Win more business",
      guides: ["Profile optimization", "Submitting quotes", "Managing orders"],
      color: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600"
    },
    {
      icon: Users,
      title: "For Professionals",
      description: "Find opportunities",
      guides: ["Setting up portfolio", "Applying to projects", "Building reputation"],
      color: "from-amber-100 to-amber-200",
      iconColor: "text-amber-600"
    },
    {
      icon: Truck,
      title: "Logistics",
      description: "Manage deliveries",
      guides: ["Fleet management", "Delivery tracking", "Route optimization"],
      color: "from-cyan-100 to-cyan-200",
      iconColor: "text-cyan-600"
    },
    {
      icon: FileText,
      title: "Best Practices",
      description: "Tips for success",
      guides: ["Writing requirements", "Quote strategies", "Communication tips"],
      color: "from-rose-100 to-rose-200",
      iconColor: "text-rose-600"
    }
  ];

  const featuredGuides = [
    {
      title: "Complete Platform Overview",
      description: "A comprehensive walkthrough of all Diligince.ai features and how they work together.",
      readTime: "15 min read",
      type: "Guide"
    },
    {
      title: "Mastering the Approval Workflow",
      description: "Learn how to set up and manage approval matrices for streamlined operations.",
      readTime: "10 min read",
      type: "Guide"
    },
    {
      title: "Analytics & Reporting Deep Dive",
      description: "Understand your metrics and make data-driven decisions with our analytics tools.",
      readTime: "12 min read",
      type: "Guide"
    }
  ];

  const videoTutorials = [
    {
      title: "Getting Started with Diligince.ai",
      duration: "5:30",
      thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070"
    },
    {
      title: "Creating Your First Requirement",
      duration: "4:15",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"
    },
    {
      title: "Managing Vendor Quotes",
      duration: "6:45",
      thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50">
          <div className="absolute inset-0 opacity-30">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Platform Guides</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about using Diligince.ai effectively.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600">
              Find guides tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideCategories.map((category, index) => (
              <div 
                key={index}
                className="group p-6 bg-white border border-gray-200/50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className={`w-7 h-7 ${category.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.guides.map((guide, i) => (
                    <li key={i}>
                      <a 
                        href="#"
                        className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors group/link"
                      >
                        <ChevronRight className="w-4 h-4 mr-1 text-gray-400 group-hover/link:text-primary-600 group-hover/link:translate-x-1 transition-all" />
                        {guide}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Guides
            </h2>
            <p className="text-gray-600">
              In-depth guides to master the platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredGuides.map((guide, index) => (
              <a 
                key={index}
                href="#"
                className="group p-6 bg-white border border-gray-200/50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                    {guide.type}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    {guide.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-600 text-sm">{guide.description}</p>
                <div className="flex items-center mt-4 text-primary-600 text-sm font-medium">
                  Read guide
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Video Tutorials
            </h2>
            <p className="text-gray-600">
              Visual guides to help you get started faster
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-corporate-navy-600 ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {video.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, currentColor 1px, transparent 1px),
                linear-gradient(currentColor 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Can't Find What You Need?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Our support team is ready to help you with any questions about the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/help"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Visit Help Center
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Documentation;
