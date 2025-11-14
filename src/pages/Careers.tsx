
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, Trophy } from "lucide-react";

const Careers = () => {
  // Sample job openings
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "Visakhapatnam, AP (Remote Optional)",
      type: "Full-time",
      department: "Engineering",
      description: "We're looking for a Senior Frontend Developer with expertise in React, TypeScript and modern web technologies to help build our platform's user interface."
    },
    {
      id: 2,
      title: "Machine Learning Engineer",
      location: "Visakhapatnam, AP",
      type: "Full-time",
      department: "AI & Data Science",
      description: "Join our team to develop and implement machine learning models that power our industrial matching algorithms."
    },
    {
      id: 3,
      title: "Product Manager",
      location: "Visakhapatnam, AP",
      type: "Full-time",
      department: "Product",
      description: "Help shape our product roadmap and drive the development of features that solve real problems for our users in the industrial ecosystem."
    },
    {
      id: 4,
      title: "Sales Executive",
      location: "Mumbai, MH",
      type: "Full-time",
      department: "Sales",
      description: "Build relationships with industrial clients and help them understand the value of our platform for their operations."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Be part of our mission to revolutionize industrial ecosystems with AI. 
                We are looking for passionate individuals to help us build something amazing.
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl font-bold mb-6 text-center">Why Work With Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start mb-4">
                      <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <Trophy className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Innovation-Driven</h3>
                        <p className="text-gray-600">Work on cutting-edge AI solutions that are changing how industries operate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start mb-4">
                      <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <Trophy className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Growth Opportunities</h3>
                        <p className="text-gray-600">Rapid career advancement in a fast-growing startup environment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start mb-4">
                      <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <Trophy className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Inclusive Culture</h3>
                        <p className="text-gray-600">Collaborative environment where every voice matters and diversity is celebrated</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start mb-4">
                      <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <Trophy className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Competitive Benefits</h3>
                        <p className="text-gray-600">Attractive compensation, health benefits and flexible work arrangements</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Open Positions</h2>
              <div className="space-y-6">
                {jobs.map(job => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.department}
                            </div>
                          </div>
                        </div>
                        <Button>Apply Now</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{job.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">Don't see a position that fits?</h3>
              <p className="text-gray-600 mb-6">
                We are always looking for talented individuals. Send your resume to:
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:careers@Diligince.ai">careers@Diligince.ai</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
