import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { checkAdminStatus } from '../../services/api';

function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-10 h-10 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-1.2 0-2.4.6-3 1.5C8.4 3.6 7.2 3 6 3 3.8 3 2 4.8 2 7c0 4.4 7.3 9.7 8.6 10.6.4.3.9.4 1.4.4s1-.1 1.4-.4C14.7 16.7 22 11.4 22 7c0-2.2-1.8-4-4-4-1.2 0-2.4.6-3 1.5C14.4 3.6 13.2 3 12 3zm0 15c-.3 0-.6-.1-.8-.2C9.9 16.9 4 12.3 4 7c0-1.1.9-2 2-2 1.2 0 2.4 1.1 2.8 2.1.2.5.7.9 1.2.9s1-.4 1.2-.9C11.6 6.1 12.8 5 14 5c1.1 0 2 .9 2 2 0 5.3-5.9 9.9-7.2 10.8-.2.1-.5.2-.8.2z"/>
              <path d="M12 8c-.8 0-1.5.3-2 .8-.5-.5-1.2-.8-2-.8-1.7 0-3 1.3-3 3 0 2.6 4.1 5.3 4.8 5.8.2.2.5.2.7.2s.5-.1.7-.2c.7-.5 4.8-3.2 4.8-5.8 0-1.7-1.3-3-3-3-.8 0-1.5.3-2 .8-.5-.5-1.2-.8-2-.8z"/>
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">BulbulShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors">
              Products
            </Link>
            {user && (
              <>
                <Link 
                  to="/upload-product" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Sell Product
                </Link>
                <Link to="/cart" className="relative group">
                  <span className="text-gray-600 hover:text-primary-600 transition-colors">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </>
            )}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 focus:outline-none">
                  <span>{user.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-md p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/products" 
                className="text-gray-600 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {user && (
                <>
                  <Link 
                    to="/upload-product" 
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sell Product
                  </Link>
                  <Link 
                    to="/cart" 
                    className="text-gray-600 hover:text-primary-600 relative"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
              {user ? (
                <>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-600 hover:text-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/login" 
                    className="block text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header; 