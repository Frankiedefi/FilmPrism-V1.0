import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Cloud, Zap, Users, Check, DollarSign, Calendar } from 'lucide-react';

const Feature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
    <div className="text-indigo-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const PricingTier = ({ title, price, features }: { title: string, price: string, features: string[] }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-4xl font-bold mb-6">{price}</p>
    <ul className="flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center mb-2">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
      Get Started
    </button>
  </div>
);

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white">
      {/* Banner */}
      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Film className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">FilmPro AI</span>
          </div>
          <div>
            <Link to="/login" className="text-white hover:text-indigo-200 mr-4">Log In</Link>
            <Link to="/signup" className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition duration-300">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Revolutionize Your Film Production</h1>
          <p className="text-xl mb-12">Harness the power of AI to streamline your film production process from script to screen.</p>
          <Link to="/signup" className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition duration-300">Get Started</Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={<Zap className="h-10 w-10" />}
              title="AI-Powered Script Analysis"
              description="Automatically tag and analyze your scripts for better insights and planning."
            />
            <Feature
              icon={<DollarSign className="h-10 w-10" />}
              title="Smart Budgeting"
              description="Generate and manage budgets with AI assistance for optimal resource allocation."
            />
            <Feature
              icon={<Calendar className="h-10 w-10" />}
              title="Intelligent Scheduling"
              description="Create efficient shooting schedules that maximize productivity and minimize costs."
            />
            <Feature
              icon={<Users className="h-10 w-10" />}
              title="Team Collaboration"
              description="Seamlessly work together with your production team in real-time."
            />
            <Feature
              icon={<Cloud className="h-10 w-10" />}
              title="Cloud-Based Platform"
              description="Access your projects anytime, anywhere, from any device."
            />
            <Feature
              icon={<Film className="h-10 w-10" />}
              title="End-to-End Production Management"
              description="Manage your entire film production process in one integrated platform."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingTier
              title="Indie"
              price="$49/mo"
              features={[
                "1 Active Project",
                "Basic Script Analysis",
                "Simple Budgeting Tools",
                "Basic Scheduling",
                "3 Team Members"
              ]}
            />
            <PricingTier
              title="Studio"
              price="$99/mo"
              features={[
                "3 Active Projects",
                "Advanced Script Analysis",
                "Comprehensive Budgeting",
                "AI-Powered Scheduling",
                "10 Team Members",
                "Priority Support"
              ]}
            />
            <PricingTier
              title="Enterprise"
              price="Custom"
              features={[
                "Unlimited Projects",
                "Full AI Capabilities",
                "Custom Integrations",
                "Dedicated Account Manager",
                "Unlimited Team Members",
                "24/7 Premium Support"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h3 className="text-lg font-semibold">FilmPro AI</h3>
              <p className="mt-2">Empowering filmmakers with AI</p>
            </div>
            <div className="w-full md:w-1/3 mt-4 md:mt-0">
              <ul className="flex justify-center md:justify-end">
                <li><a href="#" className="hover:text-indigo-200 mr-4">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-200 mr-4">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-200">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 FilmPro AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;