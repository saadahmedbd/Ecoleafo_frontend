import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './MyAddresses.css';
import { BuyerSidebar } from '../Component/BuyerSidebar';


/* ============================================
   MY ADDRESSES COMPONENT
   Manage multiple shipping addresses
   ============================================ */
export function MyAddresses () {
  // State for addresses - easily replaceable with API data
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Liam Carter',
      phone: '+1-555-123-4567',
      street: '123 Maple Street, Apt 4B',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'United States',
      isDefault: true,
      type: 'Home'
    },
    {
      id: 2,
      name: 'Liam Carter',
      phone: '+1-555-987-6543',
      street: '456 Oak Avenue, Suite 200',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'United States',
      isDefault: false,
      type: 'Office'
    },
    {
      id: 3,
      name: 'Liam Carter',
      phone: '+1-555-111-2222',
      street: '789 Pine Lane',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      country: 'United States',
      isDefault: false,
      type: null
    }
  ]);

  // Handle set as default
  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    console.log('Set address as default:', id);
    // Add API call here
  };

  // Handle edit address
  const handleEdit = (id) => {
    console.log('Edit address:', id);
    // Navigate to edit form or open modal
    alert(`Edit address ${id}`);
  };

  // Handle delete address
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      console.log('Deleted address:', id);
      // Add API call here
    }
  };

  // Handle add new address
  const handleAddNew = () => {
    console.log('Add new address');
    // Navigate to add form or open modal
    alert('Open add new address form');
  };

  return (
    <div className="addresses-page">
        <BuyerSidebar/>
      <div className="addresses-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">My Addresses</h1>
          <button className="btn-add-new" onClick={handleAddNew}>
            <Plus size={20} />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Addresses List */}
        <div className="addresses-list">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`address-card ${address.isDefault ? 'default' : ''}`}
            >
              {/* Address Header */}
              <div className="address-header">
                <div className="address-name-section">
                  <h3 className="address-name">{address.name}</h3>
                  <div className="address-badges">
                    {address.isDefault && (
                      <span className="badge badge-default">Default</span>
                    )}
                    {address.type && (
                      <span className="badge badge-type">{address.type}</span>
                    )}
                  </div>
                </div>
                <div className="address-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(address.id)}
                    aria-label="Edit address"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(address.id)}
                    aria-label="Delete address"
                    disabled={address.isDefault}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Address Details */}
              <div className="address-details">
                <p className="address-phone">{address.phone}</p>
                <p className="address-street">{address.street}</p>
                <p className="address-location">
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="address-country">{address.country}</p>
              </div>

              {/* Set as Default Link */}
              {!address.isDefault && (
                <button 
                  className="set-default-btn"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <h3 className="empty-title">No addresses yet</h3>
            <p className="empty-text">Add your first address to get started</p>
            <button className="btn-add-first" onClick={handleAddNew}>
              <Plus size={20} />
              <span>Add Address</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAddresses;