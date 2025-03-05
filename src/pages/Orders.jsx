import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      toast.error('Error fetching orders');
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        confirmedDelivery: true,
        status: 'delivered',
        deliveryConfirmedAt: new Date()
      });
      toast.success('You have confirmed the delivery');
      fetchUserOrders();
    } catch (error) {
      toast.error('Error confirming delivery');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {order.confirmedDelivery && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Delivery Confirmed by You
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Ordered on: {order.createdAt.toDate().toLocaleDateString()}
                </p>
                {order.deliveryConfirmedAt && (
                  <p className="text-sm text-gray-500">
                    Confirmed on: {order.deliveryConfirmedAt.toDate().toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {!order.confirmedDelivery && (
                <button
                  onClick={() => confirmDelivery(order.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  I Got The Product
                </button>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Order Items:</h3>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Delivery Information:</h3>
                <p className="text-sm">{order.deliveryInfo.address}</p>
                <p className="text-sm">{order.deliveryInfo.city}, {order.deliveryInfo.postcode}</p>
                <p className="text-sm">Phone: {order.deliveryInfo.phone}</p>
              </div>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;