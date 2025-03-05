import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Dhaka',
    postcode: '1200',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutInfo(prev => ({ ...prev, [name]: value }));
  };

  const submitOrder = async () => {
    if (!checkoutInfo.phone || !checkoutInfo.address) {
      toast.error('Please provide all required information');
      return;
    }

    try {
      // Create order in Firestore
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        items: items,
        total: total,
        status: 'pending',
        deliveryInfo: {
          phone: checkoutInfo.phone,
          address: checkoutInfo.address,
          city: checkoutInfo.city,
          postcode: checkoutInfo.postcode,
        },
        createdAt: new Date(),
        confirmedDelivery: false
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order. Please try again.');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    setShowAddressForm(true);
  };

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Address form view
  if (showAddressForm) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Delivery Information</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cash on Delivery</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-1">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={checkoutInfo.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., 01700000000"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Address *</label>
              <textarea
                name="address"
                value={checkoutInfo.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows="3"
                placeholder="Your delivery address"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={checkoutInfo.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="City"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postcode"
                  value={checkoutInfo.postcode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setShowAddressForm(false)}
              className="bg-gray-100 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-200"
            >
              Back to Cart
            </button>
            
            <button
              onClick={submitOrder}
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
            >
              Place Order
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div className="flex items-center">
                <span>{item.name} × {item.quantity}</span>
              </div>
              <span>৳{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-4">
            <span>Total</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Regular cart view
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {/* Rest of the cart view remains the same */}<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {items.map((item) => (
              <div key={item.id} className="p-6 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-2"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;