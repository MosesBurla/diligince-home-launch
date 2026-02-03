import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Shield, Lock, UserCheck, Eye, Database, Bell, Mail, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Privacy = () => {
  const overviewCards = [
    {
      icon: Database,
      title: "Data Collection",
      description: "We collect only essential information needed to provide our services"
    },
    {
      icon: Shield,
      title: "Security Measures",
      description: "Enterprise-grade encryption and security protocols protect your data"
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      description: "Full control over your data with access, correction, and deletion rights"
    }
  ];

  const sections = [
    {
      id: "information-collect",
      title: "Information We Collect",
      content: `We collect information you provide directly to us when you:
      
• Create an account and complete your profile
• Use our platform to connect with vendors, professionals, or industries
• Submit requirements, quotes, or purchase orders
• Communicate with other users through our messaging system
• Contact our support team

This includes:
- Personal identification information (name, email, phone number)
- Business information (company name, industry, role)
- Transaction data (requirements, quotes, orders)
- Communications (messages, support tickets)
- Usage data (how you interact with our platform)`
    },
    {
      id: "how-use",
      title: "How We Use Your Information",
      content: `We use your information to:

• Provide, maintain, and improve our services
• Process transactions and send related information
• Match industries with suitable vendors and professionals
• Send you technical notices, updates, and security alerts
• Respond to your comments, questions, and support requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions
• Personalize and improve your experience on our platform`
    },
    {
      id: "data-sharing",
      title: "Data Sharing & Third Parties",
      content: `We may share your information in the following situations:

• With vendors/professionals when you submit requirements or accept quotes
• With service providers who perform services on our behalf
• To comply with legal obligations or protect our rights
• In connection with a merger, acquisition, or sale of assets
• With your consent or at your direction

We do NOT sell your personal information to third parties for marketing purposes.`
    },
    {
      id: "your-rights",
      title: "Your Rights & Choices",
      content: `You have the right to:

• Access your personal data
• Correct inaccurate or incomplete data
• Request deletion of your data
• Object to processing of your data
• Export your data in a portable format
• Withdraw consent at any time

To exercise these rights, contact us at privacy@Diligince.ai`
    },
    {
      id: "data-security",
      title: "Data Security",
      content: `We implement industry-standard security measures:

• 256-bit SSL/TLS encryption for data in transit
• AES-256 encryption for data at rest
• Regular security audits and penetration testing
• Multi-factor authentication options
• Role-based access controls
• Automated threat detection and monitoring
• Secure data centers with 24/7 physical security`
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      content: `We use cookies and similar technologies to:

• Keep you logged in
• Remember your preferences
• Analyze how you use our platform
• Improve our services

You can manage cookie preferences in your browser settings. For more details, see our Cookie Policy.`
    },
    {
      id: "contact",
      title: "Contact Us",
      content: `If you have questions about this Privacy Policy or our data practices, contact us:

Email: privacy@Diligince.ai
Phone: +91 9848756956
Address: Visakhapatnam, Andhra Pradesh, India

Data Protection Officer: dpo@Diligince.ai`
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
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
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-corporate-navy-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-full mb-6">
              <Lock className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Your Privacy Matters</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              We're committed to protecting your privacy and being transparent about how we handle your data.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: February 2, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {overviewCards.map((card, index) => (
              <div 
                key={index}
                className="group p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <card.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections - Accordion */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Detailed Privacy Information
            </h2>
            <p className="text-gray-600">
              Click on each section to learn more about our privacy practices
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section, index) => (
              <AccordionItem 
                key={section.id} 
                value={section.id}
                className="bg-white border border-gray-200/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm font-semibold text-primary-600">
                      {index + 1}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-12 prose prose-gray max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm leading-relaxed bg-transparent p-0 m-0">
                      {section.content}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700 relative overflow-hidden">
        {/* Background Pattern */}
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

        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 text-center">
          <Mail className="w-12 h-12 text-primary-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Questions About Your Privacy?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Our dedicated privacy team is here to help. Contact us anytime with questions about your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:privacy@Diligince.ai"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              Contact Privacy Team
            </a>
            <Link 
              to="/security"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <Shield className="w-5 h-5" />
              View Security Practices
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
