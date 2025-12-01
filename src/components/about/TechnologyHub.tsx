import { Code2, Cloud, Lock, Zap } from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useScrollAnimation";

const technologies = [
  {
    icon: Code2,
    title: "Modern Stack",
    description: "Built with React, TypeScript, and cutting-edge web technologies for optimal performance."
  },
  {
    icon: Cloud,
    title: "Cloud-Native",
    description: "Scalable cloud infrastructure ensuring 99.9% uptime and global accessibility."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade encryption, secure data handling, and compliance with industry standards."
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Advanced machine learning models for intelligent matching and predictive analytics."
  }
];

const TechnologyHub = () => {
  const { elementRef, visibleItems } = useStaggeredAnimation(technologies.length, 150);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, currentColor 1px, transparent 1px),
            linear-gradient(currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Code2 className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-semibold text-white">Technology & Innovation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for Scale, Security & Speed
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Our platform leverages cutting-edge technology to deliver a seamless, secure, and intelligent experience.
          </p>
        </div>

        {/* Technology Grid */}
        <div ref={elementRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  visibleItems[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="group relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-primary-500/50 transition-all duration-500">
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-purple-500/0 group-hover:from-primary-500/20 group-hover:to-purple-500/20 rounded-3xl transition-all duration-500" />

                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-primary-500/50 group-hover:scale-110 transition-all duration-500">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{tech.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-400 mb-2">99.9%</div>
            <div className="text-gray-400">Platform Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-400 mb-2">&lt;100ms</div>
            <div className="text-gray-400">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-400 mb-2">256-bit</div>
            <div className="text-gray-400">Encryption</div>
          </div>
        </div>

        {/* API-First Badge */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6">
            <p className="text-white font-semibold mb-2">API-First Architecture</p>
            <p className="text-gray-400 text-sm">
              Built for seamless integration with your existing systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyHub;
