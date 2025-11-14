
import { useState } from "react";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    toast({
      title: "Message sent!",
      description: "We will get back to you as soon as possible.",
    });
    
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      <main className="flex-grow pt-24 pb-16">
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Have questions about our services? Need support? We are here to help.
                Reach out to us using any of the methods below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Get in Touch</h2>
                <Card className="bg-white border border-gray-100 shadow-sm p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your inquiry..."
                        rows={6}
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-200"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                  </form>
                </Card>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
                <div className="grid gap-6">
                  <Card className="p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                        <p className="text-gray-600 mt-1">
                          Visakhapatnam, Andhra Pradesh, India
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                        <p className="text-gray-600 mt-1">
                          <a href="tel:+919848756956" className="hover:text-blue-600">
                            +91 9848756956
                          </a>
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                        <p className="text-gray-600 mt-1">
                          <a href="mailto:support@Diligince.ai" className="hover:text-blue-600">
                            support@Diligince.ai
                          </a>
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Business Hours</h3>
                  <div className="text-gray-600 bg-white p-4 rounded-lg border border-gray-100">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                    <p>Saturday: 10:00 AM - 2:00 PM IST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
