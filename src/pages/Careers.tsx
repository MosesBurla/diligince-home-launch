import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, MapPin, Clock, Trophy, Users, Rocket, Heart, 
  Sparkles, ArrowRight, Mail, Globe, Building, ChevronRight
} from "lucide-react";

const Careers = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const departments = ["All", "Engineering", "Product", "Sales", "AI & Data Science"];

  const stats = [
    { value: "50+", label: "Team Members" },
    { value: "5", label: "Countries" },
    { value: "8", label: "Open Roles" }
  ];

  const cultureCards = [
    {
      icon: Rocket,
      title: "Innovation First",
      description: "Work on cutting-edge AI solutions transforming industrial operations across India and beyond."
    },
    {
      icon: Trophy,
      title: "Rapid Growth",
      description: "Fast-track your career in a dynamic startup environment with mentorship from industry leaders."
    },
    {
      icon: Heart,
      title: "Inclusive Culture",
      description: "Collaborative environment where every voice matters and diversity is celebrated."
    },
    {
      icon: Sparkles,
      title: "Great Benefits",
      description: "Competitive compensation, health coverage, flexible work, and learning opportunities."
    }
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "Visakhapatnam, AP",
      type: "Full-time",
      remote: true,
      department: "Engineering",
      description: "Build beautiful, performant UIs with React, TypeScript, and modern web technologies."
    },
    {
      id: 2,
      title: "Machine Learning Engineer",
      location: "Visakhapatnam, AP",
      type: "Full-time",
      remote: false,
      department: "AI & Data Science",
      description: "Develop ML models powering our intelligent matching and recommendation systems."
    },
    {
      id: 3,
      title: "Product Manager",
      location: "Visakhapatnam, AP",
      type: "Full-time",
      remote: true,
      department: "Product",
      description: "Shape product strategy and drive features that solve real problems for industrial users."
    },
    {
      id: 4,
      title: "Sales Executive",
      location: "Mumbai, MH",
      type: "Full-time",
      remote: false,
      department: "Sales",
      description: "Build relationships with industrial clients and demonstrate our platform's value."
    },
    {
      id: 5,
      title: "Backend Developer",
      location: "Visakhapatnam, AP",
      type: "Full-time",
      remote: true,
      department: "Engineering",
      description: "Design and build scalable APIs and services powering our platform."
    },
    {
      id: 6,
      title: "Data Scientist",
      location: "Remote",
      type: "Full-time",
      remote: true,
      department: "AI & Data Science",
      description: "Analyze industrial data and build predictive models for procurement optimization."
    },
    {
      id: 7,
      title: "UI/UX Designer",
      location: "Visakhapatnam, AP",
      type: "Full-time",
      remote: true,
      department: "Product",
      description: "Create intuitive, beautiful experiences for our diverse user base."
    },
    {
      id: 8,
      title: "Customer Success Manager",
      location: "Bangalore, KA",
      type: "Full-time",
      remote: false,
      department: "Sales",
      description: "Ensure our customers achieve their goals and maximize platform value."
    }
  ];

  const filteredJobs = activeFilter === "All" 
    ? jobs 
    : jobs.filter(job => job.department === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700">
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
              <Rocket className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-gray-300">We're Hiring!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Join the AI Revolution<br />in Industrial Procurement
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Help us transform how industries connect with vendors and professionals. 
              Build something meaningful with a passionate team.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Work With Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're building the future of industrial procurement in India. Here's what makes Diligince.ai special.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultureCards.map((card, index) => (
              <div 
                key={index}
                className="group p-6 bg-white border border-gray-200/50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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

      {/* Open Positions */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Find your perfect role and help us shape the future of industrial technology.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveFilter(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilter === dept
                      ? 'bg-corporate-navy-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <div 
                key={job.id}
                className="group p-6 bg-white border border-gray-200/50 rounded-xl hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        {job.department}
                      </span>
                      {job.remote && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Remote OK
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <Button className="bg-corporate-navy-600 hover:bg-corporate-navy-700 text-white group-hover:shadow-lg transition-all">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No open positions in this department right now.</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon or send us your resume anyway!</p>
            </div>
          )}
        </div>
      </section>

      {/* Life at Diligince - Dark Section */}
      <section className="py-20 bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700 relative overflow-hidden">
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
              Life at Diligince.ai
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We believe great work comes from happy, empowered teams. Here's what you can expect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Flexible Work",
                description: "Work from anywhere with flexible hours. We trust you to deliver results."
              },
              {
                title: "Learning Budget",
                description: "Annual learning stipend for courses, conferences, and books."
              },
              {
                title: "Health & Wellness",
                description: "Comprehensive health insurance and wellness programs for you and family."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <Mail className="w-12 h-12 text-primary-600 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Don't See a Perfect Fit?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            We're always looking for talented individuals. Send us your resume and tell us how you can contribute.
          </p>
          <a 
            href="mailto:careers@Diligince.ai"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-corporate-navy-600 to-corporate-navy-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            careers@Diligince.ai
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
