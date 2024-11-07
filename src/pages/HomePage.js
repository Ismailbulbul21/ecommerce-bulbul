import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchProducts } from '../services/api';

function HomePage() {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        const approvedProducts = products.filter(product => product.status === 'approved');
        setFeaturedProducts(approvedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Modern Design */}
      <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 to-indigo-600/90" />
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-grid" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Find unique items from trusted sellers in our marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105"
              >
                Browse Products
              </Link>
              {!user && (
                <Link 
                  to="/signup" 
                  className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Electronics', 'Fashion', 'Home', 'Sports'].map((category) => (
              <Link 
                key={category}
                to={`/products?category=${category}`}
                className="group relative overflow-hidden rounded-2xl aspect-square hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link 
            to="/products"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <ProductGrid products={featuredProducts.slice(0, 8)} />
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Trusted Sellers',
                description: 'All our sellers are verified and trusted',
                icon: '🛡️'
              },
              {
                title: 'Quality Products',
                description: 'Curated selection of premium items',
                icon: '⭐'
              },
              {
                title: 'Secure Payments',
                description: 'Safe and encrypted payment methods',
                icon: '🔒'
              }
            ].map((feature) => (
              <div 
                key={feature.title}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Selling Today
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join our marketplace and reach thousands of potential buyers
          </p>
          <Link 
            to={user ? "/upload-product" : "/signup"}
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105"
          >
            {user ? "Start Selling" : "Create Account"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 