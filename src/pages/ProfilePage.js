import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchProducts } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductGrid from '../components/product/ProductGrid';

function ProfilePage() {
  const { user } = useAuth();
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        const filteredProducts = allProducts.filter(
          product => product.userId === user.uid
        );
        setUserProducts(filteredProducts);
      } catch (error) {
        console.error('Error loading user products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProducts();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-primary-600">
              {user.email[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Your Products</h2>
        {userProducts.length > 0 ? (
          <ProductGrid products={userProducts} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't uploaded any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage; 