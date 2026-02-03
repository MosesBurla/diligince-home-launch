import { Link } from "react-router-dom";
import { Globe, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700 text-white py-20 relative overflow-hidden" id="contact">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, currentColor 1px, transparent 1px),
              linear-gradient(currentColor 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section - Brand & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 pb-16 border-b border-white/10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <img src="/diligence-no-bg-white.svg" alt="Diligince.ai" className="w-8 h-8" />
              </div>
              <span className="text-3xl font-bold text-white">Diligince.ai</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              Connecting industries, professionals, and vendors through intelligent AI-powered business solutions for accelerated growth and success.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="group w-11 h-11 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                <Globe className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="group w-11 h-11 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:pl-12">
            <h4 className="text-2xl font-bold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-6">
              Get the latest insights on AI-powered procurement and industry trends.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all backdrop-blur-sm"
              />
              <button
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
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
            <h4 className="text-lg font-bold text-white mb-4 relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-400"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Press Kit
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 relative inline-block">
              Solutions
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-400"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/solutions/industries" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  For Industries
                </Link>
              </li>
              <li>
                <Link to="/solutions/professionals" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  For Professionals
                </Link>
              </li>
              <li>
                <Link to="/solutions/vendors" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  For Vendors
                </Link>
              </li>
              <li>
                <Link to="/solutions/enterprise" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 relative inline-block">
              Resources
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-400"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 relative inline-block">
              Legal
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-400"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Diligince.ai. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm">Made with AI-Powered Intelligence</span>
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
