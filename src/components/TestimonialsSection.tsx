
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // This is a placeholder for where you would fetch actual testimonials
  // For now, we'll show a message that testimonials will be populated from user data
  useEffect(() => {
    // In a real application, you would fetch testimonials from your API here
    // setTestimonials(fetchedTestimonials);
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-600">See what our users are saying about Diligince.ai</p>
        </div>

        {testimonials.length > 0 ? (
          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-white shadow-sm border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center p-4">
                  <p className="text-lg text-gray-800 italic mb-4">{testimonials[currentIndex].quote}</p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonials[currentIndex].name}</p>
                    <p className="text-sm text-gray-600">{testimonials[currentIndex].company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6 space-x-2">
              <Button variant="outline" size="icon" onClick={prevTestimonial}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextTestimonial}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-primary/5 p-8 rounded-lg max-w-2xl mx-auto">
            <p className="text-center text-primary">
              Testimonials will be populated with organic user data. Once users start providing feedback, their testimonials will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
