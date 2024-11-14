import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './ProductManagement.css';

function ProductManagement() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');
  const [salesData, setSalesData] = useState([]);  // To store sales data

  // Function to handle form submission
  const addProduct = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, category, price: parseFloat(price), stock: parseInt(stock) }]);

    if (error) {
      console.error('Error adding product:', error.message);
      setMessage(`Error: ${error.message}`);
    } else {
      console.log('Product added:', data);
      setMessage('Product added successfully!');
      resetForm();
    }
  };

  // Function to clear the form fields
  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
  };

  // Function to fetch total sales and stock for each product
  const fetchSalesData = async () => {
    const { data, error } = await supabase.rpc('fetch_sales_data');
    if (error) {
      console.error('Error fetching sales data:', error.message);
      setMessage(`Error: ${error.message}`);
    } else {
      console.log('Sales Data:', data);
      setSalesData(data);  // Store sales data
    }
  };

  return (
    <div className="product-management">
      <h2>Product Management</h2>

      {/* Form to submit product details */}
      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        {/* Add Product Button */}
        <button className="submit-btn" type="submit">Add Product</button>
      </form>

      {/* Button to fetch sales data */}
      <button className="fetch-sales-btn" onClick={fetchSalesData}>Display Sales and Stock</button>

      {/* Success/Error Message */}
      {message && <p>{message}</p>}

      {/* Display fetched sales and stock data */}
      <div className="sales-data">
        {salesData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stock</th>
                <th>Total Sales (₹)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>₹{item.total_sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;