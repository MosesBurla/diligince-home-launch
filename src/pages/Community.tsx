import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { 
  Users, MessageCircle, Calendar, Mail, 
  Globe, ArrowRight, ExternalLink, Sparkles
} from "lucide-react";

const Community = () => {
  const channels = [
    {
      icon: MessageCircle,
      title: "Discussion Forum",
      description: "Connect with peers, ask questions, and share experiences with other users.",
      action: "Join Discussions",
      link: "#",
      color: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600"
    },
    {
      icon: Globe,
      title: "LinkedIn Community",
      description: "Follow us for industry insights, updates, and professional networking.",
      action: "Follow Us",
      link: "#",
      color: "from-sky-100 to-sky-200",
      iconColor: "text-sky-600"
    },
    {
      icon: Calendar,
      title: "Events & Webinars",
      description: "Join live sessions, workshops, and industry events hosted by our team.",
      action: "View Calendar",
      link: "#",
      color: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600"
    },
    {
      icon: Mail,
      title: "Newsletter",
      description: "Weekly insights on AI in procurement, industry trends, and platform updates.",
      action: "Subscribe",
      link: "#",
      color: "from-amber-100 to-amber-200",
      iconColor: "text-amber-600"
    }
  ];

  const upcomingEvents = [
    {
      title: "AI in Procurement: 2026 Trends",
      date: "February 15, 2026",
      time: "3:00 PM IST",
      type: "Webinar",
      speakers: ["Dr. Ananya Sharma", "Rajesh Kumar"]
    },
    {
      title: "Platform Workshop: Advanced Features",
      date: "February 22, 2026",
      time: "11:00 AM IST",
      type: "Workshop",
      speakers: ["Diligince Team"]
    },
    {
      title: "Industry Connect: Manufacturing Summit",
      date: "March 5, 2026",
      time: "10:00 AM IST",
      type: "Conference",
      speakers: ["Multiple Industry Leaders"]
    }
  ];

  const stats = [
    { value: "5,000+", label: "Community Members" },
    { value: "15", label: "Countries" },
    { value: "10,000+", label: "Discussions" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700">
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
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Users className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-gray-300">Connect & Grow</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Join Our Community
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Connect with industry professionals, share knowledge, and stay updated 
              on the latest in AI-powered procurement.
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

      {/* Community Channels */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ways to Connect
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join conversations across multiple channels and platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {channels.map((channel, index) => (
              <a 
                key={index}
                href={channel.link}
                className="group p-6 bg-white border border-gray-200/50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${channel.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <channel.icon className={`w-7 h-7 ${channel.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                <span className="inline-flex items-center text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                  {channel.action}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600">
              Join our webinars, workshops, and industry events
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index}
                className="group p-6 bg-white border border-gray-200/50 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </span>
                      <span>{event.time}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.speakers.join(", ")}
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-corporate-navy-600 hover:bg-corporate-navy-700 text-white rounded-lg font-medium transition-colors">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="#"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View all events
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
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
          <Sparkles className="w-12 h-12 text-primary-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Join?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Start connecting with industry professionals today and unlock the power of community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;
