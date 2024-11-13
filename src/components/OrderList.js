import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure you have initialized Supabase client
import './OrderForm.css'; // Add appropriate styles if needed

const OrderForm = () => {
  const [supplier, setSupplier] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  // Fetch orders from the database
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('order_id, order_date, supplier, product, quantity');
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle the form submission to place an order
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          supplier,
          product,
          quantity,
        }
      ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Order placed successfully!');
      setQuantity(1); // Reset form values after submission
      setSupplier('');
      setProduct('');
      fetchOrders();  // Refresh the order list after placing an order
    }
  };

  return (
    <div className="order-container" style={{ display: 'flex' }}>
      {/* Order Form Section */}
      <div className="order-form-container" style={{ width: '50%', padding: '20px' }}>
        <h1>Place an Order to Supplier</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          {/* Supplier Name Input */}
          <div className="form-group">
            <label>Supplier</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
            />
          </div>

          {/* Product Name Input */}
          <div className="form-group">
            <label>Product</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
            />
          </div>

          {/* Quantity Input */}
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit">Place Order</button>
        </form>
      </div>

      {/* Order History Section */}
      <div className="order-history-container" style={{ width: '50%', padding: '20px' }}>
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Supplier</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((Orders) => (
                <tr key={orders.order_id}>
                  <td>{orders.order_id}</td>
                  <td>{orders.supplier}</td>
                  <td>{orders.product}</td>
                  <td>{orders.quantity}</td>
                  <td>{new Date(orders.order_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderForm;