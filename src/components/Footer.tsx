import { Link } from "react-router-dom";
import { Globe, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
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
                <img src="/diligence-no-bg-white.svg" alt="Diligince.ai" className="w-8 h-8" />
              </div>
              <span className="text-3xl font-bold text-[#153b60]">Diligince.ai</span>
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
                <Link to="/about" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <a href="#" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                  Press Kit
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                  Blog
                </Link>
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
                <Link to="/privacy" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#828282] hover:text-[#153b60] transition-colors duration-200 text-sm">
                  Terms of Service
                </Link>
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
              © 2025 Diligince.ai. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[#828282] text-sm">Made with AI-Powered Intelligence</span>
              <div className="w-2 h-2 rounded-full bg-[#153b60] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
