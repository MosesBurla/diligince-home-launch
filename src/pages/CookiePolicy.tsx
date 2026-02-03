import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Cookie, Settings, BarChart, Target, Shield, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      description: "Required for the platform to function. Cannot be disabled.",
      required: true,
      examples: ["Session management", "Security tokens", "Load balancing"]
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      description: "Remember your preferences and settings for a better experience.",
      required: false,
      examples: ["Language preferences", "Theme settings", "Saved filters"]
    },
    {
      icon: BarChart,
      title: "Analytics Cookies",
      description: "Help us understand how you use our platform to improve it.",
      required: false,
      examples: ["Page views", "Feature usage", "Performance metrics"]
    },
    {
      icon: Target,
      title: "Marketing Cookies",
      description: "Used to deliver relevant content and measure campaign effectiveness.",
      required: false,
      examples: ["Ad tracking", "Campaign attribution", "Retargeting"]
    }
  ];

  const sections = [
    {
      id: "what-are-cookies",
      title: "What Are Cookies?",
      content: `Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences, understand how you use the site, and provide personalized experiences.

There are two main types:
• Session Cookies: Temporary cookies deleted when you close your browser
• Persistent Cookies: Remain on your device for a set period or until manually deleted

We also use similar technologies like local storage, session storage, and pixels.`
    },
    {
      id: "how-we-use",
      title: "How We Use Cookies",
      content: `We use cookies to:

• Keep you logged in securely
• Remember your preferences and settings
• Understand how you use our platform
• Improve our services based on usage patterns
• Protect against fraud and abuse
• Deliver relevant content and features

We do not sell data collected through cookies to third parties.`
    },
    {
      id: "third-party",
      title: "Third-Party Cookies",
      content: `Some cookies on our platform are placed by trusted third parties:

Analytics Partners:
• Google Analytics - Usage analysis
• Mixpanel - Feature engagement

Payment Processors:
• Stripe - Secure payment processing

These partners have their own privacy policies governing cookie use.`
    },
    {
      id: "manage-cookies",
      title: "Managing Your Cookies",
      content: `You can control cookies in several ways:

Browser Settings:
• Most browsers let you block or delete cookies
• Check your browser's help documentation for instructions

Platform Settings:
• Use the cookie preferences panel (when available)
• Adjust settings in your account preferences

Opt-Out Links:
• Google Analytics: tools.google.com/dlpage/gaoptout
• NAI Opt-Out: optout.networkadvertising.org

Note: Blocking essential cookies may affect platform functionality.`
    },
    {
      id: "retention",
      title: "Cookie Retention",
      content: `Different cookies have different lifespans:

• Session cookies: Deleted when you close your browser
• Authentication cookies: Up to 30 days
• Preference cookies: Up to 1 year
• Analytics cookies: Up to 2 years
• Marketing cookies: Varies by partner (typically 30-90 days)

You can clear cookies at any time through your browser settings.`
    },
    {
      id: "updates",
      title: "Updates to This Policy",
      content: `We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated effective date.

For significant changes, we may:
• Display a notice on our platform
• Send an email notification
• Require you to acknowledge the changes

Last updated: February 2, 2026`
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-amber-200/50 rounded-full mb-6">
              <Cookie className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">Cookie Information</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Learn how we use cookies and similar technologies to improve your experience on Diligince.ai.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: February 2, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Types Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Types of Cookies We Use
            </h2>
            <p className="text-gray-600">
              We use different categories of cookies for various purposes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {cookieTypes.map((type, index) => (
              <div 
                key={index}
                className="p-6 bg-white border border-gray-200/50 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      type.required 
                        ? 'bg-gradient-to-br from-green-100 to-green-200' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <type.icon className={`w-6 h-6 ${
                        type.required ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{type.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {type.required ? (
                      <span className="text-xs text-green-600 font-medium">Always On</span>
                    ) : (
                      <Switch disabled className="opacity-50" />
                    )}
                  </div>
                </div>
                <div className="pl-16">
                  <p className="text-xs text-gray-500 mb-2">Examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            * Cookie preference controls are for illustration. Actual controls may vary based on your account settings.
          </p>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Cookie Policy Details
            </h2>
            <p className="text-gray-600">
              Everything you need to know about our cookie usage
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
                    <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm font-semibold text-amber-600">
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
          <Cookie className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Questions About Cookies?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            If you have any questions about our cookie policy or how we use your data, we're here to help.
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

export default CookiePolicy;
