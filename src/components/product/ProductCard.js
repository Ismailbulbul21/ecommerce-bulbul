import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../contexts/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleProductClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/product/${product.id}`);
  };

  return (
    <div onClick={handleProductClick} className="cursor-pointer">
      <div className="card-gradient rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div className="relative">
          <img 
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-primary-600">
              {product.category}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard; 