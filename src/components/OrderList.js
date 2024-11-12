// OrderList.js
//import './OrderList.css';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('Orders')
      .select('*, Customers(first_name, last_name), Order_Details(*, Products(product_name))');
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order List</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id}>
            {order.customer_id} ({order.Customers.first_name} {order.Customers.last_name}) - 
            ${order.total_amount} - {new Date(order.order_date).toLocaleDateString()}
            <ul>
              {order.Order_Details.map((detail) => (
                <li key={detail.order_detail_id}>
                  {detail.Products.product_name} - Quantity: {detail.quantity} - Price: ${detail.price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;