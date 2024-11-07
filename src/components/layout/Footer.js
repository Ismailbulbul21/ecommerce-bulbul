import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Nagu Saabsan</h3>
            <p className="text-gray-400 text-sm">Suuqa ugu weyn ee online-ka ah ee Soomaaliya.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Xiriirka Degdega</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Alaabada</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Nala Soo Xiriir</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Noocyada</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/products?category=Elektaroonig" className="text-gray-400 hover:text-white transition-colors">Elektaroonig</Link></li>
              <li><Link to="/products?category=Dharka" className="text-gray-400 hover:text-white transition-colors">Dharka</Link></li>
              <li><Link to="/products?category=Guriga" className="text-gray-400 hover:text-white transition-colors">Guriga</Link></li>
              <li><Link to="/products?category=Cunto" className="text-gray-400 hover:text-white transition-colors">Cunto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Xiriirka</h3>
            <div className="space-y-1.5 text-sm text-gray-400">
              <p>Email: ismailbulbul381@gmail.com</p>
              <p>Telefoon: +252 617211084</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} BulbulShop. Dhammaan Xuquuqda Way Dhowran Tahay.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 