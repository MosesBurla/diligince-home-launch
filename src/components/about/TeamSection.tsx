import { MapPin, Users, Briefcase } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TeamSection = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div
            ref={elementRef}
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Team Behind Innovation
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              A passionate team of technologists, industry experts, and innovators working together to transform industrial procurement in India.
            </p>

            {/* Key Highlights */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-corporate-navy-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Expert Team</h3>
                  <p className="text-gray-600">
                    Combining deep industry knowledge with cutting-edge technology expertise.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Industry Experience</h3>
                  <p className="text-gray-600">
                    Years of combined experience in industrial operations and technology solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Located in Visakhapatnam</h3>
                  <p className="text-gray-600">
                    Based in the heart of India's industrial hub, Andhra Pradesh.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Element */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}>
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-200">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-corporate-navy-500 to-corporate-navy-700 mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Culture</h3>
                  <p className="text-gray-600">
                    Innovation, collaboration, and excellence
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-corporate-navy-50 to-corporate-navy-100 rounded-2xl">
                    <div className="text-3xl font-bold text-corporate-navy-700 mb-2">100%</div>
                    <div className="text-sm text-gray-600">Dedicated</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
                    <div className="text-3xl font-bold text-primary-700 mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Committed</div>
                  </div>
                </div>

                {/* Location Badge */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-corporate-navy-600" />
                    <span className="font-semibold text-gray-900">Headquarters</span>
                  </div>
                  <p className="text-gray-700">
                    Visakhapatnam, Andhra Pradesh, India
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-3xl opacity-20 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-corporate-navy-400 to-corporate-navy-600 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-white rounded-3xl px-8 py-6 shadow-xl border border-gray-200">
            <p className="text-lg text-gray-700 mb-4">
              Interested in joining our mission?
            </p>
            <p className="text-gray-600">
              We're building something special. Stay tuned for opportunities in 2025.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
