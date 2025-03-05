import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      toast.error('Error fetching products');
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        imageUrl: newProduct.imageUrl
      });
      toast.success('Product added successfully');
      setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
      fetchProducts();
    } catch (error) {
      toast.error('Error adding product');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'delivered',
        confirmedDelivery: true
      });
      toast.success('Delivery confirmed');
      fetchOrders();
    } catch (error) {
      toast.error('Error confirming delivery');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin panel</h1>
      
      <div className="mb-8">
        <div className="border-b">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`py-4 px-1 border-b-2 ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'products' ? (
       <div className="max-w-7xl mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-8">Add products</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-bold mb-4">Add New Product</h2>
           <form onSubmit={handleSubmit}>
             <div className="mb-4">
               <label className="block text-gray-700 text-sm font-bold mb-2">
                 Product Name
               </label>
               <input
                 type="text"
                 value={newProduct.name}
                 onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                 className="w-full p-2 border rounded-md"
                 required
               />
             </div>
             <div className="mb-4">
               <label className="block text-gray-700 text-sm font-bold mb-2">
                 Price
               </label>
               <input
                 type="number"
                 value={newProduct.price}
                 onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                 className="w-full p-2 border rounded-md"
                 required
               />
             </div>
             <div className="mb-4">
               <label className="block text-gray-700 text-sm font-bold mb-2">
                 Description
               </label>
               <textarea
                 value={newProduct.description}
                 onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                 className="w-full p-2 border rounded-md"
                 required
               />
             </div>
             <div className="mb-4">
               <label className="block text-gray-700 text-sm font-bold mb-2">
                 Image URL
               </label>
               <input
                 type="url"
                 value={newProduct.imageUrl}
                 onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                 className="w-full p-2 border rounded-md"
                 required
               />
             </div>
             <button
               type="submit"
               className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
             >
               Add Product
             </button>
           </form>
         </div>
 
         <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-bold mb-4">Product List</h2>
           <div className="space-y-4">
             {products.map((product) => (
               <div key={product.id} className="border p-4 rounded-md">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-bold">{product.name}</h3>
                     <p className="text-gray-600">Taka {product.price}</p>
                     <p className="text-sm text-gray-500">{product.description}</p>
                   </div>
                   <button
                     onClick={() => handleDelete(product.id)}
                     className="text-red-500 hover:text-red-600"
                   >
                     Delete
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Info
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.map((item) => (
                          <div key={item.id}>
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                        <div className="font-bold mt-2">
                          Total: ৳{order.total.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>{order.userName}</div>
                        <div>{order.userEmail}</div>
                        <div>{order.deliveryInfo.phone}</div>
                        <div>{order.deliveryInfo.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Mark Processing
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {order.status === 'delivered' && !order.confirmedDelivery && (
                      <button
                        onClick={() => confirmDelivery(order.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Confirm Delivery
                      </button>
                    )}
                    {order.confirmedDelivery && (
                      <span className="text-green-600">
                        Delivery Confirmed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);
};

export default AdminPanel;