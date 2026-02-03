import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Clock, User, ArrowRight, Search, 
  Sparkles, TrendingUp, Lightbulb, Mail
} from "lucide-react";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "AI & Technology", "Industry Insights", "Best Practices", "Company Updates"];

  const posts = [
    {
      id: 1,
      slug: "future-of-industrial-ai-india",
      title: "The Future of Industrial AI in India",
      excerpt: "Exploring how artificial intelligence is transforming industrial operations across India, from predictive maintenance to smart procurement.",
      date: "February 1, 2026",
      author: "Rahul Sharma",
      category: "AI & Technology",
      readTime: "8 min read",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070"
    },
    {
      id: 2,
      slug: "optimize-industrial-operations",
      title: "5 Ways to Optimize Your Industrial Plant Operations",
      excerpt: "Practical strategies for improving efficiency, reducing costs, and maximizing productivity in your industrial operations.",
      date: "January 28, 2026",
      author: "Priya Patel",
      category: "Best Practices",
      readTime: "6 min read",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1581091877150-ecdf3f168575?q=80&w=2070"
    },
    {
      id: 3,
      slug: "vendor-selection-manufacturing",
      title: "The Importance of Vendor Selection in Manufacturing",
      excerpt: "How choosing the right vendors can impact your manufacturing quality, timelines, and bottom line.",
      date: "January 15, 2026",
      author: "Vikram Singh",
      category: "Industry Insights",
      readTime: "5 min read",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065"
    },
    {
      id: 4,
      slug: "industry-4-0-indian-perspective",
      title: "Industry 4.0: The Indian Perspective",
      excerpt: "An in-depth analysis of how Industry 4.0 technologies are being implemented across various sectors in India.",
      date: "January 7, 2026",
      author: "Neha Gupta",
      category: "AI & Technology",
      readTime: "10 min read",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1581094358461-f4bb5e556130?q=80&w=2070"
    },
    {
      id: 5,
      slug: "sustainable-practices-heavy-industry",
      title: "Sustainable Practices in Heavy Industry",
      excerpt: "How Indian industrial companies are adopting green practices while maintaining productivity and profitability.",
      date: "December 22, 2025",
      author: "Arjun Reddy",
      category: "Industry Insights",
      readTime: "7 min read",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=2048"
    },
    {
      id: 6,
      slug: "technology-industrial-logistics",
      title: "Leveraging Technology for Industrial Logistics",
      excerpt: "New technological solutions revolutionizing logistics and supply chain management in the industrial sector.",
      date: "December 15, 2025",
      author: "Ananya Desai",
      category: "AI & Technology",
      readTime: "6 min read",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070"
    },
    {
      id: 7,
      slug: "diligince-ai-series-a-announcement",
      title: "Diligince.ai Announces Series A Funding",
      excerpt: "We're excited to announce our Series A funding round to accelerate our mission of transforming industrial procurement.",
      date: "December 1, 2025",
      author: "Diligince Team",
      category: "Company Updates",
      readTime: "3 min read",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070"
    },
    {
      id: 8,
      slug: "procurement-automation-guide",
      title: "The Complete Guide to Procurement Automation",
      excerpt: "Everything you need to know about automating your procurement processes for better efficiency and cost savings.",
      date: "November 20, 2025",
      author: "Rahul Sharma",
      category: "Best Practices",
      readTime: "12 min read",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured || activeCategory !== "All");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50">
          <div className="absolute inset-0 opacity-30">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-corporate-navy-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Insights & Innovation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry insights, AI innovations, and best practices for modern industrial operations.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-3xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-corporate-navy-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && activeCategory === "All" && !searchQuery && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <Link 
              to={`/blog/${featuredPost.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-corporate-navy-900 to-corporate-navy-700">
                <div className="absolute inset-0">
                  <img 
                    src={featuredPost.imageUrl} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <Link 
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <article className="bg-white rounded-2xl overflow-hidden border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                          {post.category}
                        </span>
                        <span className="text-gray-400 text-xs">{post.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No articles found matching your criteria.</p>
              <button 
                onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Load More */}
          {regularPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-gray-300 hover:border-primary-500">
                Load More Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-corporate-navy-900 via-corporate-navy-800 to-corporate-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, currentColor 1px, transparent 1px),
                linear-gradient(currentColor 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 text-center">
          <Mail className="w-12 h-12 text-primary-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get the latest insights on AI-powered procurement and industry trends delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all backdrop-blur-sm"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
