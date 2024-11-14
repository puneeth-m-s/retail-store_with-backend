import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Customer.css';

const CustomerForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [customers, setCustomers] = useState([]); // To store customer list
  const [fetchError, setFetchError] = useState('');

  // Function to handle form submission for adding a new customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Insert customer details into the Customers table
    const { data, error } = await supabase
      .from('customers')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber
        }
      ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Customer added successfully!');
      // Clear form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
    }
  };

  // Function to fetch and display customer details
  const handleFetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*'); // Select all customers

    if (error) {
      setFetchError(`Error fetching customers: ${error.message}`);
    } else {
      setCustomers(data); // Store customer data
    }
  };

  return (
    <div className="customer-form-container">
      {/* Customer Form Section */}
      <div className="form-section">
        <h2>Add Customer</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td><label>First Name</label></td>
                <td>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label>Last Name</label></td>
                <td>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Email</label></td>
                <td>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label>Phone Number</label></td>
                <td>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>
                  <button type="submit">Add Customer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      {/* Customer List Section */}
      <div className="customer-list-section">
        <h2>Customer List</h2>
        <button onClick={handleFetchCustomers}>Fetch Customers</button>

        {fetchError && <p>{fetchError}</p>}

        {/* Display customer list in table */}
        {customers.length > 0 ? (
          <table>
            <thead>
              <tr>
                
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers to display</p>
        )}
      </div>
    </div>
  );
};

export default CustomerForm;
