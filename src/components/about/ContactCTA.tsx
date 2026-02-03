import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    value: "Visakhapatnam, Andhra Pradesh, India",
    color: "from-corporate-500 to-corporate-700"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 9848756956",
    link: "tel:+919848756956",
    color: "from-primary-500 to-primary-700"
  },
  {
    icon: Mail,
    title: "Email",
    value: "support@Diligince.ai",
    link: "mailto:support@Diligince.ai",
    color: "from-purple-500 to-purple-700"
  }
];

const ContactCTA = () => {
  const navigate = useNavigate();
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary-50 via-white to-corporate-navy-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-corporate-navy-300/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={elementRef}
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - CTA */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Let's Connect
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Ready to transform your industrial procurement? Join us on this journey to revolutionize how industries connect and collaborate.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => navigate('/pricing')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-corporate-navy-600 text-corporate-navy-700 hover:bg-corporate-navy-50"
                >
                  View Pricing
                </Button>
              </div>

              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-200 rounded-2xl">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-primary-600 animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary-400 animate-ping" />
                </div>
                <span className="font-semibold text-primary-700">Launching 2025 - Join the Waitlist!</span>
              </div>
            </div>

            {/* Right Side - Contact Info */}
            <div>
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h3>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-start gap-4 group">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="text-sm font-medium text-gray-600 mb-1">{item.title}</div>
                          <div className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    );

                    return item.link ? (
                      <a key={index} href={item.link} className="block hover:bg-gray-50 -mx-4 px-4 py-4 rounded-2xl transition-colors">
                        {content}
                      </a>
                    ) : (
                      <div key={index} className="py-4">
                        {content}
                      </div>
                    );
                  })}
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    We're always excited to hear from potential partners, customers, and innovators. Reach out to learn more about Diligince.ai and how we can work together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;

