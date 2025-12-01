import { Target, Building2, Users, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

const metrics = [
  {
    icon: Target,
    value: 2025,
    label: "Launch Year",
    suffix: "",
    color: "from-primary-500 to-primary-700"
  },
  {
    icon: Building2,
    value: 50,
    label: "Target Industries",
    suffix: "+",
    color: "from-corporate-500 to-corporate-700"
  },
  {
    icon: Users,
    value: 1000,
    label: "Expected Vendors",
    suffix: "+",
    color: "from-purple-500 to-purple-700"
  },
  {
    icon: TrendingUp,
    value: 100,
    label: "Growth Focus",
    suffix: "%",
    color: "from-green-500 to-green-700"
  }
];

const ImpactMetrics = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const [counters, setCounters] = useState(metrics.map(() => 0));

  useEffect(() => {
    if (!isVisible) return;

    metrics.forEach((metric, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = metric.value / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCounters(prev => {
            const newCounters = [...prev];
            newCounters[index] = Math.min(Math.round(increment * currentStep), metric.value);
            return newCounters;
          });
        } else {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    });
  }, [isVisible]);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-white via-primary-50/30 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-corporate-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Impact Vision
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Transforming industrial procurement across India with intelligent technology solutions.
          </p>
        </div>

        {/* Metrics Grid */}
        <div ref={elementRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-700 delay-${index * 100} ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
              >
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                  <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 text-center">
                    {/* Icon */}
                    <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.color} items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Animated Counter */}
                    <div className="mb-3">
                      <span className={`text-5xl font-bold bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}>
                        {counters[index]}
                      </span>
                      <span className={`text-3xl font-bold bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}>
                        {metric.suffix}
                      </span>
                    </div>

                    {/* Label */}
                    <div className="text-gray-600 font-medium">{metric.label}</div>

                    {/* Pulsing Indicator */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${metric.color} animate-pulse`} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vision Statement */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-corporate-900 to-corporate-700 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Transforming Industrial Procurement
              </h3>
              <p className="text-xl text-gray-200 leading-relaxed">
                Our vision is to create the most intelligent, efficient, and trusted industrial services marketplace in India. By 2025, we'll be connecting thousands of plants with the perfect service providers through AI-powered matching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
