import { Calendar, Target, Lightbulb, Rocket } from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useScrollAnimation";

const timeline = [
  {
    icon: Calendar,
    year: "2024",
    title: "Foundation",
    description: "Thinkvate Solutions was born from a vision to transform industrial operations through technology."
  },
  {
    icon: Target,
    year: "2024",
    title: "Vision",
    description: "Identified the gap in industrial procurement and committed to building an AI-native solution."
  },
  {
    icon: Lightbulb,
    year: "2024-2025",
    title: "Innovation",
    description: "Developed Diligince.ai platform with cutting-edge AI algorithms for intelligent vendor matching."
  },
  {
    icon: Rocket,
    year: "2025",
    title: "Launch",
    description: "Preparing to revolutionize how industrial plants connect with service providers across India."
  }
];

const stats = [
  { label: "Founded", value: "2024" },
  { label: "Focus Areas", value: "3+" },
  { label: "Innovation First", value: "100%" }
];

const CompanyStory = () => {
  const { elementRef, visibleItems } = useStaggeredAnimation(timeline.length, 200);

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Who We Are
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Thinkvate Solutions is a technology company dedicated to transforming industrial operations through intelligent solutions. Founded in 2024, we recognized the inefficiencies in traditional industrial service marketplaces and set out to create a technology-driven platform that leverages artificial intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Timeline */}
          <div ref={elementRef} className="space-y-8">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex gap-6 transition-all duration-700 ${
                    visibleItems[index] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-corporate-navy-500 to-corporate-navy-700 flex items-center justify-center shadow-lg">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-sm font-semibold text-corporate-navy-600 mb-1">{item.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mission & Stats */}
          <div className="space-y-8">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-corporate-navy-50 to-corporate-navy-100 rounded-3xl p-8 md:p-10 border border-corporate-navy-200 hover:shadow-xl transition-all duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To create seamless connections between industrial plants and service providers, driving efficiency and growth across the industrial ecosystem through innovative AI-powered solutions.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 md:p-10 border border-primary-200 hover:shadow-xl transition-all duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become the most intelligent and trusted industrial services marketplace in India, making it effortless for plant owners to find exactly the services they need.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-corporate-navy-400 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="text-3xl font-bold text-corporate-navy-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStory;
