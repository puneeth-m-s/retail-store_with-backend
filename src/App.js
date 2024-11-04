import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductManagement from './components/ProductManagement';
import SalesAndBilling from './components/SalesAndBilling';
import InventoryManagement from './components/InventoryManagement';
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
              <Link to="/inventory">Inventory Management</Link>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
