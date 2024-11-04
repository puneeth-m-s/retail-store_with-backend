import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './InventoryManagement.css';

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();  // Fetch the inventory data on component mount
  }, []);

  // Fetches data from the Supabase 'inventory' table
  const fetchInventory = async () => {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) {
      console.error('Error fetching inventory data:', error);
    } else {
      setInventory(data);  // Sets the fetched data to the state
    }
  };

  return (
    <div className="inventory-management">
      <h2>Inventory Management</h2>

      {inventory.length > 0 ? (
        <ul>
          {inventory.map((item) => (
            <li key={item.inventory_id}>
              <strong>Product ID:</strong> {item.product_id}, 
              <strong> Change Type:</strong> {item.change_type}, 
              <strong> Quantity Change:</strong> {item.quantity_change}, 
              <strong> Updated Stock:</strong> {item.updated_stock}
            </li>
          ))}
        </ul>
      ) : (
        <p>No inventory data available.</p>
      )}
    </div>
  );
}

export default InventoryManagement;
