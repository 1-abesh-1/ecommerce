import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCart();
const navigate=useNavigate();
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              ShopName
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
              {user && (
          <button
            onClick={() => navigate('/orders')}
            className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200"
          >
            View My Orders
          </button>
        )}
                {isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                    Admin Panel
                  </Link>
                )}
                <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-900">
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;