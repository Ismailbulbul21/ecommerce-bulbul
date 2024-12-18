import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, updateProduct, deleteProduct } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to send notification to user
  const sendNotificationToUser = async (userId, message, productName) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        message,
        productName,
        createdAt: new Date().toISOString(),
        read: false
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleApprove = async (product) => {
    try {
      setLoading(true);
      await updateProduct(product.id, { 
        status: 'approved',
        approvedAt: new Date().toISOString() 
      });
      
      // Send notification to user
      await sendNotificationToUser(
        product.userId,
        `Your product "${product.name}" has been approved and is now live on the marketplace.`,
        product.name
      );
      
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id 
            ? { ...p, status: 'approved' } 
            : p
        )
      );
      
      alert('Product approved successfully');
      
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Failed to approve product. Please try again.');
    } finally {
      setLoading(false);
      await loadProducts();
    }
  };

  const handleReject = async (product) => {
    try {
      await updateProduct(product.id, { status: 'rejected' });
      
      // Send notification to user
      await sendNotificationToUser(
        product.userId,
        `Your product "${product.name}" has been rejected. Please review our guidelines and try again.`,
        product.name
      );

      loadProducts();
      setSelectedProduct(null);
      alert('Product rejected successfully');
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('Failed to reject product. Please try again.');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(product.id);
        
        // Send notification to user
        await sendNotificationToUser(
          product.userId,
          `Your product "${product.name}" has been deleted from the marketplace.`,
          product.name
        );

        loadProducts();
        setSelectedProduct(null);
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleViewDetails = (product) => {
    setViewProduct(product);
  };

  const ProductViewModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Product Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Updated Images Section */}
            <div>
              <h3 className="font-semibold mb-2">Product Images</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Basic Information</h3>
                <p><span className="font-medium">Name:</span> {product.name}</p>
                <p><span className="font-medium">Price:</span> ${product.price}</p>
                <p><span className="font-medium">Category:</span> {product.category}</p>
                <p><span className="font-medium">Status:</span> {product.status}</p>
              </div>

              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div>
                <h3 className="font-semibold">Seller Information</h3>
                <p><span className="font-medium">Name:</span> {product.sellerInfo?.name}</p>
                <p><span className="font-medium">Email:</span> {product.sellerInfo?.email}</p>
                <p><span className="font-medium">Submitted:</span> {new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {product.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    handleApprove(product);
                    onClose();
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(product);
                    onClose();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.status === filter);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        
        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'approved' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'rejected' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={product.imageUrl} 
                          alt="" 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.sellerInfo.name}</div>
                    <div className="text-sm text-gray-500">{product.sellerInfo.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'approved' ? 'bg-green-100 text-green-800' :
                      product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {product.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(product)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewProduct && (
        <ProductViewModal 
          product={viewProduct} 
          onClose={() => setViewProduct(null)} 
        />
      )}
    </div>
  );
}

export default AdminPanel;