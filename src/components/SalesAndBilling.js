import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './SalesAndBilling.css';

function SalesAndBilling() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [editProduct, setEditProduct] = useState(null); // State to store the product being edited
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error(error);
    } else {
      setProducts(data);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  const removeFromCart = (index, product) => {
    const newCart = [...cart];
    newCart.splice(index, 1); // Remove the item from the cart
    setCart(newCart);
    setTotal(total - product.price); // Subtract the product price from the total
  };

  const handleCheckout = async () => {
    cart.forEach(async (item) => {
      const { error } = await supabase.from('sales').insert([
        { product_id: item.id, quantity: 1, total_price: item.price },
      ]);

      if (error) {
        console.error(error);
      }
    });

    alert(`Total Amount: ₹${total}`);
    setCart([]);
    setTotal(0);
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setNewName(product.name);
    setNewPrice(product.price);
  };

  const handleUpdateProduct = async (productId) => {
    const { error } = await supabase
      .from('products')
      .update({ name: newName, price: newPrice })
      .eq('id', productId);

    if (error) {
      console.error(error);
    } else {
      fetchProducts(); // Refresh the product list after updating
      setEditProduct(null); // Close the edit form after updating
    }
  };

  // Function to remove product from Supabase database
  const handleRemoveProductFromDB = async (productId) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    
    if (error) {
      console.error('Error removing product from database:', error);
    } else {
      fetchProducts(); // Refresh the product list after deletion
      setEditProduct(null); // Close the edit form if the product was being edited
    }
  };

  return (
    <div className="sales-container">
      <h2>Sales and Billing</h2>

      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product">
            <h4>{product.name}</h4>
            <p>Price: ₹{product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
            <button onClick={() => handleEditClick(product)}>Edit</button>
            <button onClick={() => handleRemoveProductFromDB(product.id)}>Delete</button> {/* Button to remove product from DB */}
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editProduct && (
        <div className="edit-form">
          <h3>Edit Product</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Product Name"
          />
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Product Price"
          />
          <button onClick={() => handleUpdateProduct(editProduct.id)}>
            Update Product
          </button>
          <button onClick={() => setEditProduct(null)}>Cancel</button>
        </div>
      )}

      <div className="cart">
        <h3>Shopping Cart</h3>
        <ul>
          {cart.map((product, index) => (
            <li key={index}>
              {product.name} - ₹{product.price}
              <button className="remove-btn" onClick={() => removeFromCart(index, product)}>Remove</button>
            </li>
          ))}
        </ul>
        <h4>Total: ₹{total}</h4>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
}

export default SalesAndBilling;
