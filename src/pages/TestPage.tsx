import React from "react";
import { TestComponent } from "@/components/shared/TestComponent";

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Application Test Page
        </h1>

        {/* Shared Component */}
        <TestComponent />

        {/* Routing Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 border border-blue-300 rounded">
            <h3 className="font-semibold text-blue-800">Routing Test</h3>
            <p className="text-blue-700">
              This page loaded successfully at <code>/test</code>
            </p>
          </div>

          <div className="p-4 bg-purple-100 border border-purple-300 rounded">
            <h3 className="font-semibold text-purple-800">Component Test</h3>
            <p className="text-purple-700">
              All UI components are rendering properly
            </p>
          </div>
        </div>

        {/* Navigation Test */}
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
          <h3 className="font-semibold text-yellow-800">Navigation Links</h3>
          <div className="space-x-4 mt-2">
            <a href="/" className="text-blue-600 hover:underline">
              Home
            </a>
            <a href="/about" className="text-blue-600 hover:underline">
              About
            </a>
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact
            </a>
            <a href="/login" className="text-blue-600 hover:underline">
              login
            </a>{' '}         </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
