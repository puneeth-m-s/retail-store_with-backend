import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './SalesAndBilling.css';

function SalesAndBilling() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [lowStockWarning, setLowStockWarning] = useState('');
  const [editProduct, setEditProduct] = useState(null);
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

  const addToCart = async (product) => {
    // Check if the product has stock available
    if (product.stock > 0) {
      setCart([...cart, product]);
      setTotal(total + product.price);

      // Update the stock in the database
      const updatedStock = product.stock - 1;
      const { error } = await supabase
        .from('products')
        .update({ stock: updatedStock })
        .eq('id', product.id);

      if (error) {
        console.error('Error updating stock:', error);
      } else {
        fetchProducts(); // Refresh the product list to reflect stock changes
      }
    } else {
      alert('Product is out of stock!');
    }
  };

  const removeFromCart = async (index, product) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    setTotal(total - product.price);

    // Restore the stock in the database after removing from cart
    const restoredStock = product.stock + 1;
    const { error } = await supabase
      .from('products')
      .update({ stock: restoredStock })
      .eq('id', product.id);

    if (error) {
      console.error('Error restoring stock:', error);
    } else {
      fetchProducts(); // Refresh product list to reflect stock changes
    }
  };

  const handleCheckout = async () => {
    for (const item of cart) {
      const { error } = await supabase
        .from('sales')
        .insert([{ product_id: item.id, quantity: 1, total_price: item.price }]);

      if (error) {
        console.error(error);
      }
    }

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
      fetchProducts();
      setEditProduct(null);
    }
  };

  const handleRemoveProductFromDB = async (productId) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      console.error('Error removing product from database:', error);
    } else {
      fetchProducts();
      setEditProduct(null);
    }
  };

  return (
    <div className="sales-container">
      <h2>Sales and Billing</h2>

      {lowStockWarning && <div className="low-stock-warning">{lowStockWarning}</div>}

      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className={`product ${product.stock < 10 ? 'low-stock' : ''}`}>
            <h4>{product.name}</h4>
            <p>Price: ₹{product.price}</p>
            <p>Category: {product.category}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => addToCart(product)} disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button onClick={() => handleEditClick(product)}>Edit</button>
            <button onClick={() => handleRemoveProductFromDB(product.id)}>Delete</button>
          </div>
        ))}
      </div>

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
          <button onClick={() => handleUpdateProduct(editProduct.id)}>Update Product</button>
          <button onClick={() => setEditProduct(null)}>Cancel</button>
        </div>
      )}

      <div className="cart">
        <h3>Shopping Cart</h3>
        <ul>
          {cart.map((product, index) => (
            <li key={index}>
              {product.name} - ₹{product.price}
              <button className="remove-btn" onClick={() => removeFromCart(index, product)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <h4>Total: ₹{total}</h4>
        <button onClick={handleCheckout} disabled={cart.length === 0}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default SalesAndBilling;
