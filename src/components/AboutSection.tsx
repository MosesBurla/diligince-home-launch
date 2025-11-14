
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">About Diligince.ai</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We are an AI powered platform connecting industrial plants with Vendors, Professionals and Logistics. 
            Launching in 2025, our mission is to revolutionize how industries find and collaborate with service providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Our Vision</h3>
              <p className="text-gray-600">
                To create the most intelligent and efficient industrial services marketplace in India, 
                making it seamless to connect plant owners with the services they need.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Pricing</h3>
              <p className="text-gray-600">
                Freemium model: Free tier for basic matching. Pro tier: ₹500/month for unlimited matches, 
                analytics and priority support. 5% commission on transactions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Contact</h3>
              <p className="text-gray-600">
                Reach us at: Visakhapatnam, Andhra Pradesh, India. 
                Phone: +91 9848756956. Email: support@Diligince.ai.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
