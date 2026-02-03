import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { 
  HelpCircle, Search, BookOpen, CreditCard, Settings, 
  Zap, MessageCircle, Phone, Mail, ChevronRight, ExternalLink
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "New to Diligince.ai? Start here",
      link: "/documentation",
      color: "from-green-100 to-green-200",
      iconColor: "text-green-600"
    },
    {
      icon: Settings,
      title: "Account & Settings",
      description: "Manage your profile and preferences",
      link: "#account",
      color: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600"
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Subscriptions, invoices, and payments",
      link: "#billing",
      color: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600"
    },
    {
      icon: BookOpen,
      title: "Platform Guides",
      description: "Detailed how-to guides and tutorials",
      link: "/documentation",
      color: "from-amber-100 to-amber-200",
      iconColor: "text-amber-600"
    }
  ];

  const faqs = [
    {
      id: "create-account",
      question: "How do I create an account?",
      answer: "Click 'Sign Up' on our homepage and select your user type (Industry, Vendor, or Professional). Fill in your details, verify your email, and complete your profile. The process takes about 5 minutes."
    },
    {
      id: "user-types",
      question: "What's the difference between user types?",
      answer: "Industries post requirements and manage procurement. Vendors respond to requirements and submit quotes. Professionals offer consulting and specialized services. Each has tailored features for their needs."
    },
    {
      id: "submit-requirement",
      question: "How do I submit a requirement?",
      answer: "Navigate to 'Requirements' in your dashboard, click 'Create New', fill in the details (title, description, specifications, deadline), and publish. Matched vendors will be notified automatically."
    },
    {
      id: "vendor-verification",
      question: "How does vendor verification work?",
      answer: "Vendors submit documents (GST, company registration, certifications) during onboarding. Our team reviews submissions within 2-3 business days. Verified vendors receive a badge on their profile."
    },
    {
      id: "pricing-plans",
      question: "What pricing plans are available?",
      answer: "We offer Free, Professional, and Enterprise plans. Free includes basic features. Professional adds advanced analytics and priority support. Enterprise includes custom integrations and dedicated support."
    },
    {
      id: "change-plan",
      question: "How do I change my subscription plan?",
      answer: "Go to Settings > Subscription, select your desired plan, and confirm. Upgrades take effect immediately. Downgrades apply at the end of your current billing cycle."
    },
    {
      id: "data-security",
      question: "How is my data protected?",
      answer: "We use 256-bit encryption, secure data centers, and regular security audits. Your data is never sold to third parties. See our Security page for full details."
    },
    {
      id: "support-contact",
      question: "How do I contact support?",
      answer: "Email us at support@Diligince.ai, use the in-app chat, or call +91 9848756956 during business hours (9 AM - 6 PM IST, Mon-Fri)."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-gray-50">
          <div className="absolute inset-0 opacity-30">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">We're Here to Help</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Find answers to common questions or reach out to our support team.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 shadow-lg transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group p-6 bg-white border border-gray-200/50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <ChevronRight className="w-5 h-5 text-gray-400 mt-3 group-hover:translate-x-1 group-hover:text-primary-600 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="bg-white border border-gray-200/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 transition-colors text-left">
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support - Dark Section */}
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

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto">
              Our support team is available to assist you with any questions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a 
              href="mailto:support@Diligince.ai"
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all text-center"
            >
              <div className="w-14 h-14 mx-auto bg-primary-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
              <p className="text-gray-400 text-sm">support@Diligince.ai</p>
            </a>

            <a 
              href="tel:+919848756956"
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all text-center"
            >
              <div className="w-14 h-14 mx-auto bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Call Us</h3>
              <p className="text-gray-400 text-sm">+91 9848756956</p>
            </a>

            <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-center">
              <div className="w-14 h-14 mx-auto bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Live Chat</h3>
              <p className="text-gray-400 text-sm">9 AM - 6 PM IST</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;
