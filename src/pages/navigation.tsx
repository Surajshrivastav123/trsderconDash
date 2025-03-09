import React, { useEffect, useState } from 'react';

const NavigationSettings = () => {
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    // Fetch navigation data from the API
    const fetchNavItems = async () => {
      try {
        const response = await fetch('https://backend.gaganahuja.com/api/v1/navigation');
        const data = await response.json();
        setNavItems(data);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchNavItems();
  }, []);

  const handleCheckboxChange = (id) => {
    setNavItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleUpdate = async () => {
    try {
      await Promise.all(
        navItems.map((item) =>
          fetch(`https://backend.gaganahuja.com/api/v1/navigation/${item._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isActive: item.isActive }),
          })
        )
      );
      alert('Navigation items updated successfully!');
    } catch (error) {
      console.error('Error updating navigation items:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Navigation Settings</h1>
      <ul style={styles.list}>
        {navItems.map((item) => (
          <li key={item._id} style={styles.listItem}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={item.isActive}
                onChange={() => handleCheckboxChange(item._id)}
                style={styles.checkbox}
              />
              <span style={styles.itemLabel}>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleUpdate} style={styles.button}>Update</button>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '10px',
  },
  itemLabel: {
    fontSize: '18px',
    color: '#555',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default NavigationSettings;
