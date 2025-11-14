
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Legal = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Legal Information</h1>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Read our terms and conditions for using Diligince.ai platform.
                  </p>
                  <Link 
                    to="/terms" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Terms of Service →
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn how we collect, use, and protect your personal information.
                  </p>
                  <Link 
                    to="/privacy" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Privacy Policy →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
