
import { BrainCircuit, Workflow, ShieldCheck, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: "AI Matching",
      description: "Our intelligent system analyzes requirements and capabilities to connect industries with the perfect service providers, considering expertise, location, availability and past performance.",
    },
    {
      icon: <Workflow className="h-8 w-8 text-primary" />,
      title: "Project Management",
      description: "Track requirements, schedules and payments seamlessly with our comprehensive industrial project management tools, customized dashboards, and automated milestone tracking.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Quality Control",
      description: "Verify services with real feedback and ratings from other industries, ensuring reliability through our transparent verification system and performance history tracking.",
    },
    {
      icon: <LineChart className="h-8 w-8 text-primary" />,
      title: "Real-Time Tools",
      description: "Make data-driven decisions with live analytics on service performance, costs and timelines, giving you actionable insights into your industrial operations and vendor relationships.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Choose Diligince.ai?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our platform offers cutting-edge solutions for the industrial sector</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <CardTitle className="text-lg font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
