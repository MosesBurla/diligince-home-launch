
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow pt-24 pb-16">
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Diligince.ai</h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We are building the leading AI powered platform connecting industrial ecosystems in India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2024, Diligince.ai was born from a vision to revolutionize how industrial plants connect with vendors, professionals and logistics partners across India.
                </p>
                <p className="text-gray-600 mb-4">
                  We recognized the inefficiencies in the traditional industrial service marketplace and set out to create a technology driven solution that leverages artificial intelligence to make connections faster, smarter and more reliable.
                </p>
                <p className="text-gray-600">
                  Our platform is scheduled to launch in 2025, bringing an innovative approach to industrial partnerships throughout India.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
                <p className="text-gray-600 mb-4">
                  <strong>Mission:</strong> To create seamless connections between industrial plants and service providers, driving efficiency and growth across the industrial ecosystem.
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Vision:</strong> To become the most intelligent and trusted industrial services marketplace in India, making it effortless for plant owners to find exactly the services they need.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Innovation</h3>
                    <p className="text-gray-600">
                      We continuously explore new technologies and approaches to solve complex industrial challenges.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Reliability</h3>
                    <p className="text-gray-600">
                      We build trustworthy systems and forge dependable relationships with all stakeholders.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Excellence</h3>
                    <p className="text-gray-600">
                      We strive for excellence in every aspect of our platform and service delivery.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
