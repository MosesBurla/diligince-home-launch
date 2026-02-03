import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { 
  Shield, Lock, Eye, Server, Key, Users, 
  CheckCircle, AlertTriangle, Globe, FileCheck,
  Mail, ExternalLink
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Security = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "256-bit AES encryption for data at rest and TLS 1.3 for data in transit"
    },
    {
      icon: Key,
      title: "Multi-Factor Authentication",
      description: "Optional 2FA via authenticator apps, SMS, or hardware security keys"
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Enterprise-grade cloud infrastructure with 99.9% uptime SLA"
    },
    {
      icon: Eye,
      title: "24/7 Monitoring",
      description: "Continuous threat detection and real-time security alerts"
    },
    {
      icon: Users,
      title: "Access Controls",
      description: "Role-based permissions and granular access management"
    },
    {
      icon: FileCheck,
      title: "Regular Audits",
      description: "Annual third-party security assessments and penetration testing"
    }
  ];

  const certifications = [
    {
      name: "ISO 27001",
      description: "Information Security Management",
      status: "In Progress"
    },
    {
      name: "SOC 2 Type II",
      description: "Security & Availability",
      status: "Planned Q3 2026"
    },
    {
      name: "GDPR",
      description: "Data Protection Compliance",
      status: "Compliant"
    }
  ];

  const securityPractices = [
    {
      id: "data-protection",
      title: "Data Protection",
      content: `Our comprehensive data protection measures include:

• Data Classification: All data is classified and handled according to sensitivity levels
• Encryption: AES-256 encryption for stored data, TLS 1.3 for all transmissions
• Key Management: Secure key rotation and hardware security modules (HSM)
• Data Minimization: We collect only necessary data and retain it only as needed
• Secure Deletion: Cryptographic erasure when data is no longer required`
    },
    {
      id: "access-security",
      title: "Access Security",
      content: `We implement multiple layers of access controls:

• Zero Trust Architecture: Every access request is verified regardless of source
• Role-Based Access Control (RBAC): Permissions based on job functions
• Principle of Least Privilege: Minimal access rights for each role
• Session Management: Automatic timeout and secure session handling
• Audit Logging: Comprehensive logs of all access and actions`
    },
    {
      id: "infrastructure",
      title: "Infrastructure Security",
      content: `Our infrastructure is designed with security first:

• Cloud Provider: Enterprise-grade cloud with SOC 2 certification
• Network Segmentation: Isolated networks with strict firewall rules
• DDoS Protection: Advanced mitigation against distributed attacks
• Vulnerability Scanning: Regular automated security scans
• Patch Management: Timely updates and security patches`
    },
    {
      id: "application-security",
      title: "Application Security",
      content: `Security is built into our development process:

• Secure Development Lifecycle (SDL): Security at every development stage
• Code Reviews: Mandatory security-focused code reviews
• Static Analysis: Automated code scanning for vulnerabilities
• Dependency Scanning: Monitoring for vulnerable third-party libraries
• Penetration Testing: Regular third-party security assessments`
    },
    {
      id: "incident-response",
      title: "Incident Response",
      content: `We have robust incident response procedures:

• 24/7 Security Team: Around-the-clock monitoring and response
• Incident Response Plan: Documented procedures for security events
• Communication Protocol: Timely notification to affected users
• Post-Incident Review: Analysis and improvements after each incident
• Regular Drills: Simulated incidents to test our response capabilities`
    },
    {
      id: "employee-security",
      title: "Employee Security",
      content: `Our team follows strict security practices:

• Background Checks: Verification for all employees with data access
• Security Training: Regular security awareness training
• Access Reviews: Periodic reviews of employee access rights
• Confidentiality Agreements: NDAs for all staff members
• Secure Workstations: Encrypted devices with security software`
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      
      {/* Hero Section - Dark Theme */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700">
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
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-gray-300">Enterprise-Grade Protection</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Security at Diligince.ai
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Your data security is our top priority. We employ industry-leading practices 
              to protect your business information.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Security Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive security measures to protect your business data at every layer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-white border border-gray-200/50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-corporate-navy-100 to-corporate-navy-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-corporate-navy-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Compliance */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Certifications & Compliance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We adhere to international security standards and regulations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="p-6 bg-white border border-gray-200 rounded-2xl text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{cert.description}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  cert.status === 'Compliant' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {cert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices Accordion */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Security Practices
            </h2>
            <p className="text-gray-600">
              Learn more about our comprehensive security approach
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {securityPractices.map((practice, index) => (
              <AccordionItem 
                key={practice.id} 
                value={practice.id}
                className="bg-white border border-gray-200/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-corporate-navy-100 rounded-lg flex items-center justify-center text-sm font-semibold text-corporate-navy-600">
                      {index + 1}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">{practice.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-12 prose prose-gray max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm leading-relaxed bg-transparent p-0 m-0">
                      {practice.content}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Report Vulnerability CTA */}
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
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <span className="text-amber-400 font-semibold">Security Researchers</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Report a Vulnerability
              </h2>
              <p className="text-gray-300 mb-6">
                We value the security community's efforts in helping us maintain a secure platform. 
                If you discover a vulnerability, please report it responsibly.
              </p>
              <a 
                href="mailto:security@Diligince.ai"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                security@Diligince.ai
              </a>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Responsible Disclosure</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Report vulnerabilities to our security team first</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Allow reasonable time for us to address issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Don't exploit vulnerabilities beyond proof of concept</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>We recognize and thank all valid reporters</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Security;
