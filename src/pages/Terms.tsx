import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { FileText, Users, CreditCard, AlertTriangle, Scale, Shield, Mail, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Terms: React.FC = () => {
  const overviewCards = [
    {
      icon: Users,
      title: "Account Terms",
      description: "Requirements for creating and maintaining your Diligince.ai account"
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      description: "Billing cycles, subscription management, and refund policies"
    },
    {
      icon: Scale,
      title: "Usage Rights",
      description: "Your rights and responsibilities when using our platform"
    }
  ];

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: `By accessing or using the Diligince.ai platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.

These Terms apply to all visitors, users, and others who access or use the Service. By using the Service, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms.

We may update these Terms from time to time. Continued use of the Service after any changes constitutes acceptance of the new Terms.`
    },
    {
      id: "accounts",
      title: "Account Registration & Security",
      content: `When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.

Account Responsibilities:
• Maintain the security of your password
• Notify us immediately of any unauthorized access
• Accept responsibility for all activities under your account
• Keep your contact information up to date

We reserve the right to suspend or terminate accounts that:
• Contain false or misleading information
• Violate these Terms or our policies
• Engage in fraudulent or illegal activities`
    },
    {
      id: "subscriptions",
      title: "Subscriptions & Payments",
      content: `Subscription Terms:
• Subscriptions are billed in advance on a recurring basis
• Billing cycles depend on the plan selected (monthly/annual)
• Automatic renewal unless cancelled before the billing date

Payment Processing:
• All payments are processed through secure third-party providers
• You authorize us to charge your payment method for all fees
• Failed payments may result in service suspension

Cancellation & Refunds:
• Cancel anytime through your account settings
• Changes take effect at the end of the current billing period
• Refunds are provided in accordance with our refund policy
• Annual subscriptions may be eligible for prorated refunds`
    },
    {
      id: "platform-usage",
      title: "Platform Usage & Restrictions",
      content: `Permitted Uses:
• Connect with vendors, professionals, and industries
• Submit and respond to requirements and quotes
• Manage purchase orders and transactions
• Communicate through our messaging system

Prohibited Activities:
• Using the platform for illegal purposes
• Submitting false or misleading information
• Attempting to gain unauthorized access
• Interfering with the platform's operation
• Scraping or automated data collection
• Impersonating other users or entities
• Distributing malware or harmful code
• Violating intellectual property rights`
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      content: `Diligince.ai Ownership:
The Service and its original content, features, and functionality are owned by Diligince.ai and are protected by copyright, trademark, and other intellectual property laws.

Your Content:
• You retain ownership of content you submit
• You grant us a license to use, display, and distribute your content
• You are responsible for ensuring you have rights to submitted content

Trademarks:
Our trademarks and trade dress may not be used without prior written consent.`
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: `To the maximum extent permitted by law, Diligince.ai shall not be liable for:

• Indirect, incidental, special, or consequential damages
• Loss of profits, data, or business opportunities
• Service interruptions or system failures
• Third-party conduct on the platform
• Transactions between users

Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.

This limitation applies regardless of the theory of liability.`
    },
    {
      id: "indemnification",
      title: "Indemnification",
      content: `You agree to defend, indemnify, and hold harmless Diligince.ai and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from:

• Your use of the Service
• Your violation of these Terms
• Your violation of any third-party rights
• Content you submit to the platform

This indemnification obligation survives termination of your account.`
    },
    {
      id: "termination",
      title: "Termination",
      content: `Account Termination:
• You may terminate your account at any time
• We may suspend or terminate accounts for Terms violations
• Termination does not relieve payment obligations

Effect of Termination:
• Access to the Service will cease immediately
• Your data may be deleted after a retention period
• Certain provisions survive termination (liability, indemnification)

Upon termination, you must stop using the Service and any content obtained from it.`
    },
    {
      id: "governing-law",
      title: "Governing Law & Disputes",
      content: `These Terms are governed by the laws of India, without regard to conflict of law principles.

Dispute Resolution:
• Disputes shall first be attempted to resolve through negotiation
• Mediation may be pursued if negotiation fails
• Arbitration in Visakhapatnam, Andhra Pradesh for unresolved disputes
• Courts of Visakhapatnam have exclusive jurisdiction

Class Action Waiver:
You agree to resolve disputes individually and waive any right to participate in class actions.`
    },
    {
      id: "contact",
      title: "Contact Information",
      content: `For questions about these Terms of Service, contact us:

Email: legal@Diligince.ai
Phone: +91 9848756956
Address: Visakhapatnam, Andhra Pradesh, India

For urgent legal matters: legal-urgent@Diligince.ai`
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
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-corporate-navy-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-full mb-6">
              <FileText className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Legal Agreement</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Please read these terms carefully before using our platform. They govern your use of Diligince.ai services.
            </p>
            <p className="text-sm text-gray-500">
              Effective Date: February 2, 2026
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

      {/* Important Notice */}
      <section className="py-8 bg-amber-50/50">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="flex items-start gap-4 p-6 bg-white border border-amber-200/50 rounded-xl">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Important Notice</h3>
              <p className="text-gray-600 text-sm">
                By using Diligince.ai, you agree to these Terms. If you do not agree, please do not use our services. 
                These Terms constitute a legally binding agreement between you and Diligince.ai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Sections - Accordion */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Complete Terms of Service
            </h2>
            <p className="text-gray-600">
              Click on each section to view the full terms
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
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 text-center">
          <Mail className="w-12 h-12 text-primary-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Have Questions About Our Terms?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Our legal team is happy to clarify any questions about our terms of service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:legal@Diligince.ai"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              Contact Legal Team
            </a>
            <Link 
              to="/privacy"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <Shield className="w-5 h-5" />
              View Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
