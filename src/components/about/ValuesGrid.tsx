import { Sparkles, Award, Handshake, TrendingUp, Leaf, Users } from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useScrollAnimation";

const values = [
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Pushing boundaries with AI",
    extended: "We continuously explore cutting-edge technologies to solve complex industrial challenges.",
    color: "from-purple-500 to-purple-700"
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Uncompromising quality",
    extended: "Every line of code, every interaction, every solution—built to the highest standards.",
    color: "from-primary-500 to-primary-700"
  },
  {
    icon: Handshake,
    title: "Trust",
    description: "Building lasting relationships",
    extended: "Transparency, integrity, and reliability are the foundation of everything we do.",
    color: "from-green-500 to-green-700"
  },
  {
    icon: TrendingUp,
    title: "Impact",
    description: "Driving real transformation",
    extended: "We measure success by the tangible difference we make in industrial operations.",
    color: "from-orange-500 to-orange-700"
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Future-focused solutions",
    extended: "Building technology that supports long-term environmental and economic sustainability.",
    color: "from-teal-500 to-teal-700"
  },
  {
    icon: Users,
    title: "Customer-First",
    description: "Your success is our mission",
    extended: "Every feature, every decision is guided by what creates the most value for our users.",
    color: "from-blue-500 to-blue-700"
  }
];

const ValuesGrid = () => {
  const { elementRef, visibleItems } = useStaggeredAnimation(values.length, 100);

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What We Stand For
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our values guide every decision we make and every solution we build.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div ref={elementRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className={`group relative transition-all duration-700 ${
                  visibleItems[index] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } ${
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div className="relative h-full bg-white rounded-3xl border-2 border-gray-200 hover:border-transparent p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {/* Icon with Gradient */}
                  <div className="relative mb-6">
                    <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">
                    {value.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4 relative z-10">
                    {value.description}
                  </p>

                  {/* Extended Description - Appears on Hover */}
                  <div className="relative z-10 max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-gray-600 leading-relaxed pt-4 border-t border-gray-200">
                      {value.extended}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${value.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuesGrid;
