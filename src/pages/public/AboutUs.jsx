import React from 'react';
import { Leaf, Users, ShieldCheck, TrendingUp, Heart, Globe } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AboutUs() {
  usePageTitle('About Us');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Ecoleafo</h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Connecting plant lovers with trusted sellers to create a greener, more sustainable world
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Ecoleafo is Bangladesh's premier online marketplace dedicated to bringing nature closer to your home. 
              We believe that everyone deserves access to quality plants, gardening supplies, and expert knowledge 
              to create their own green sanctuary.
            </p>
            <p className="text-gray-600">
              Our platform connects passionate plant sellers with enthusiastic buyers, creating a thriving 
              community where nature lovers can discover, purchase, and learn about plants from trusted sources 
              across Bangladesh.
            </p>
          </div>
          <div className="bg-emerald-100 rounded-2xl p-8 flex items-center justify-center">
            <Leaf className="w-48 h-48 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Quality</h3>
              <p className="text-gray-600">
                Every seller is verified and every plant is quality-checked to ensure you receive 
                healthy, thriving plants every time.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We're building a community of plant enthusiasts, from beginners to experts, 
                where knowledge and passion for plants are shared freely.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We promote eco-friendly practices and sustainable gardening to help create 
                a greener Bangladesh for future generations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start">
              <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Wide Selection</h3>
                <p className="text-gray-600">
                  Browse thousands of plants from indoor houseplants to outdoor trees, 
                  gardening tools, pots, and accessories from verified sellers across Bangladesh.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start">
              <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Seller Support</h3>
                <p className="text-gray-600">
                  We empower local nurseries and plant sellers with tools to reach more customers, 
                  manage inventory, and grow their business online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-emerald-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-emerald-100">Plant Varieties</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-emerald-100">Verified Sellers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-emerald-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to buy your first plant or grow your nursery business, 
            TreeStore is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="buyer/login"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Start Shopping
            </a>
            <a
              href="/seller/register"
              className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
            >
              Become a Seller
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
