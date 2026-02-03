import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { 
  Download, Image, FileText, Newspaper, Mail, 
  Calendar, Users, Building, ExternalLink
} from "lucide-react";

const PressKit = () => {
  const brandAssets = [
    {
      title: "Primary Logo",
      description: "Full color logo for light backgrounds",
      format: "SVG, PNG",
      icon: Image
    },
    {
      title: "Logo Mark",
      description: "Icon only for small spaces",
      format: "SVG, PNG",
      icon: Image
    },
    {
      title: "Logo - Dark",
      description: "White logo for dark backgrounds",
      format: "SVG, PNG",
      icon: Image
    },
    {
      title: "Brand Guidelines",
      description: "Complete brand usage guidelines",
      format: "PDF",
      icon: FileText
    }
  ];

  const pressReleases = [
    {
      title: "Diligince.ai Announces Series A Funding to Accelerate AI-Powered Procurement",
      date: "January 15, 2026",
      excerpt: "Leading industrial procurement platform secures significant investment to expand operations across India."
    },
    {
      title: "Diligince.ai Launches New AI-Powered Vendor Matching Engine",
      date: "November 20, 2025",
      excerpt: "Revolutionary technology matches industries with optimal vendors based on multiple criteria."
    },
    {
      title: "Diligince.ai Expands to 5 New Industrial Hubs in India",
      date: "September 5, 2025",
      excerpt: "Platform now serves major industrial regions including Chennai, Pune, and Ahmedabad."
    }
  ];

  const companyFacts = [
    { label: "Founded", value: "2024" },
    { label: "Headquarters", value: "Visakhapatnam, India" },
    { label: "Team Size", value: "50+ employees" },
    { label: "Industries Served", value: "500+" },
    { label: "Vendors Onboarded", value: "2,000+" },
    { label: "Platform Users", value: "10,000+" }
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-full mb-6">
              <Newspaper className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Media Resources</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Press Kit
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Brand assets, press releases, and company information for media professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Brand Assets
            </h2>
            <p className="text-gray-600">
              Download our official logos and brand materials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandAssets.map((asset, index) => (
              <div 
                key={index}
                className="group p-6 bg-white border border-gray-200/50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-primary-50 group-hover:to-primary-100 transition-colors">
                  <asset.icon className="w-16 h-16 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{asset.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{asset.description}</p>
                <p className="text-gray-400 text-xs mb-4">{asset.format}</p>
                <button className="inline-flex items-center gap-2 text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-corporate-navy-600 hover:bg-corporate-navy-700 text-white rounded-xl font-medium transition-colors">
              <Download className="w-5 h-5" />
              Download All Assets (ZIP)
            </button>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Press Releases
            </h2>
            <p className="text-gray-600">
              Latest news and announcements
            </p>
          </div>

          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <a 
                key={index}
                href="#"
                className="group block p-6 bg-white border border-gray-200/50 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {release.date}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {release.title}
                </h3>
                <p className="text-gray-600 text-sm">{release.excerpt}</p>
                <span className="inline-flex items-center mt-4 text-primary-600 text-sm font-medium">
                  Read full release
                  <ExternalLink className="w-4 h-4 ml-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Company Facts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Company Facts
            </h2>
            <p className="text-gray-600">
              Key information about Diligince.ai
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {companyFacts.map((fact, index) => (
              <div 
                key={index}
                className="text-center p-4 bg-gray-50 rounded-xl"
              >
                <div className="text-2xl font-bold text-corporate-navy-600 mb-1">
                  {fact.value}
                </div>
                <div className="text-gray-600 text-sm">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Media Contact
              </h2>
              <p className="text-gray-300 mb-6">
                For press inquiries, interview requests, or additional information, 
                please contact our communications team.
              </p>
              <div className="space-y-4">
                <a 
                  href="mailto:press@Diligince.ai"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary-400" />
                  press@Diligince.ai
                </a>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Request an Interview</h3>
              <p className="text-gray-400 text-sm mb-4">
                Our leadership team is available for interviews on topics including 
                AI in procurement, industrial digitization, and startup growth.
              </p>
              <a 
                href="mailto:press@Diligince.ai?subject=Interview Request"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Request Interview
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PressKit;
