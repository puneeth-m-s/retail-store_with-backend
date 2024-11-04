import React, { useState } from 'react';
import { supabase } from '../supabaseClient';  // Import the Supabase client
import './ProductManagement.css';  // For styling (optional)

function ProductManagement() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
  const addProduct = async (e) => {
    e.preventDefault();  // Prevents the page from refreshing

    // Insert the product into the Supabase 'products' table
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, category, price: parseFloat(price), stock: parseInt(stock) }]);

    if (error) {
      console.error('Error adding product:', error.message);
      setMessage(`Error: ${error.message}`);
    } else {
      console.log('Product added:', data);
      setMessage('Product added successfully!');
      resetForm();  // Clear form fields
    }
  };

  // Function to clear the form fields
  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
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

      {/* Success/Error Message */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProductManagement;
