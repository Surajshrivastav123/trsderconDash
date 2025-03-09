import React, { useEffect, useState } from 'react';

const EventRegistration = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    // Fetching the registered user data
    fetch('https://backend.gaganahuja.com/api/v1/register')
      .then((response) => response.json())
      .then((data) => {
        // Parsing the data field and storing the registrations
        const parsedRegistrations = data.data.map((item) => ({
          ...item,
          data: JSON.parse(item.data), // Parsing the `data` field
        }));
        setRegistrations(parsedRegistrations);
      })
      .catch((error) => console.error('Error fetching registrations:', error));
  }, []);

  return (
    <div>
      <h2>Event Registration</h2>
      <div style={{ overflowX: 'auto' }}>
        {registrations.length > 0 ? (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1500px' }}>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Twitter ID</th>
                <th>Phone Number</th>
                <th>Emergency Contact Number</th>
                <th>Trading Years</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Capital Allocation Trading</th>
                <th>Market Traded</th>
                <th>Profile</th>
                <th>How to Know</th>
                <th>Food Preferences</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration._id}>
                  <td>{registration.data.first_name}</td>
                  <td>{registration.data.last_name}</td>
                  <td>{registration.data.email}</td>
                  <td>{registration.data.twitter_id}</td>
                  <td>{registration.data.phone_number}</td>
                  <td>{registration.data.emergency_contact_number}</td>
                  <td>{registration.data.trading_years}</td>
                  <td>{registration.data.country}</td>
                  <td>{registration.data.state}</td>
                  <td>{registration.data.city}</td>
                  <td>{registration.data.capital_allocation_trading}</td>
                  <td>{registration.data.market_traded.join(', ')}</td>
                  <td>{registration.data.profile.join(', ')}</td>
                  <td>{registration.data.how_to_know.join(', ')}</td>
                  <td>{registration.data.food_preferences.join(', ')}</td>
                  <td>{new Date(registration.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No registrations found.</p>
        )}
      </div>
    </div>
  );
};

export default EventRegistration;
