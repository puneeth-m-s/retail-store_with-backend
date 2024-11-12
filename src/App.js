import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductManagement from './components/ProductManagement';
import SalesAndBilling from './components/SalesAndBilling';
import InventoryManagement from './components/InventoryManagement';
import OrderList from './components/OrderList';
import CustomerForm from './components/CustomerForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Retail Store Management System</h1>

        {/* Navigation Links to switch between different views */}
        <nav>
          <ul>
            <li>
              <Link to="/">Product Management</Link>
            </li>
            <li>
              <Link to="/sales">Sales and Billing</Link>
            </li>
            <li>
              <Link to="/CustomerForm">Customer Details</Link>
            </li>
            <li>
              <Link to="/OrderList">Order List</Link>
            </li>
          </ul>
        </nav>

        {/* Define the routes for different pages */}
        <Routes>
          {/* Route for the Product Management page */}
          <Route path="/" element={<ProductManagement />} />

          {/* Route for the Sales and Billing page */}
          <Route path="/sales" element={<SalesAndBilling />} />

          {/* Route for the Inventory Management page */}
          <Route path="/inventory" element={<InventoryManagement />} />

          {/* Route for the Order List page */}
          <Route path="/OrderList" element={<OrderList />} />

          {/* Route for the Customer Details page */}
          <Route path="/CustomerForm" element={<CustomerForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
