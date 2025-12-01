import { Brain, Network, Shield } from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useScrollAnimation";

const pillars = [
  {
    icon: Brain,
    title: "AI Intelligence",
    description: "Advanced machine learning algorithms for smart vendor matching, predictive analytics, and intelligent recommendations.",
    color: "from-purple-500 to-purple-700"
  },
  {
    icon: Network,
    title: "Ecosystem Connection",
    description: "Seamlessly connecting industrial plants with vendors, professionals, and logistics partners across India.",
    color: "from-primary-500 to-primary-700"
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Enterprise-grade security, verified vendors, transparent processes, and reliable service delivery guarantees.",
    color: "from-green-500 to-green-700"
  }
];

const ProductVision = () => {
  const { elementRef, visibleItems } = useStaggeredAnimation(pillars.length, 150);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-corporate-navy-300/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
            <span className="text-sm font-semibold text-primary-700">Product Innovation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What We Built
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Diligince.ai is the only AI-native platform built specifically for industrial procurement. We're revolutionizing how plants connect with service providers through intelligent automation and seamless integration.
          </p>
        </div>

        {/* Large Product Showcase */}
        <div className="mb-20">
          <div className="relative max-w-5xl mx-auto">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-purple-400/20 to-primary-400/20 blur-3xl rounded-3xl" />
            
            <div className="relative bg-white/90 backdrop-blur-sm border-2 border-primary-200/50 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Diligince.ai Platform
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  AI-Powered Procurement, Simplified
                </p>
                
                {/* Mock Platform Preview */}
                <div className="bg-gradient-to-br from-corporate-navy-900 to-corporate-navy-700 rounded-2xl p-8 text-white shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="text-sm opacity-80">Diligince.ai Dashboard</div>
                    </div>
                    <div className="h-48 flex items-center justify-center text-6xl font-bold opacity-20">
                      AI
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="h-2 bg-white/20 rounded" />
                      <div className="h-2 bg-white/40 rounded" />
                      <div className="h-2 bg-white/20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Pillars */}
        <div ref={elementRef} className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  visibleItems[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="group relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Gradient Border on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} style={{ padding: '2px' }}>
                    <div className="w-full h-full bg-white rounded-3xl" />
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Diligince.ai */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Diligince.ai?</h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Traditional industrial procurement is fragmented, time-consuming, and unreliable. Diligince.ai brings intelligence, speed, and trust to every transaction. Our platform doesn't just connect—it understands, predicts, and optimizes your procurement needs.
          </p>
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-lg">
            <span>Launching 2025</span>
            <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductVision;
