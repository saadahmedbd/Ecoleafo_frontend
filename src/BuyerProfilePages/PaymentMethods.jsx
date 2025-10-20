import React, { useState } from 'react';
import { Plus, Trash2, Lock } from 'lucide-react';
import './PaymentMethods.css';
import { BuyerSidebar } from '../Component/BuyerSidebar';


/* ============================================
   PAYMENT METHODS COMPONENT
   Manage bank accounts and mobile banking
   ============================================ */
export function PaymentMethods  ()  {
  // State for bank accounts
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      type: 'bank',
      bankName: 'Dutch-Bangla Bank',
      accountNumber: '****7890',
      accountHolder: 'John Doe',
      isDefault: true
    },
    {
      id: 2,
      type: 'bank',
      bankName: 'Islami Bank Bangladesh',
      accountNumber: '****4567',
      accountHolder: 'John Doe',
      isDefault: false
    }
  ]);

  // State for mobile banking
  const [mobileBanking, setMobileBanking] = useState([
    {
      id: 3,
      type: 'nagad',
      name: 'Nagad',
      phoneNumber: '01712-345678',
      accountHolder: 'John Doe',
      logo: '🟠', // Orange circle emoji as placeholder
      isDefault: false
    },
    {
      id: 4,
      type: 'bkash',
      name: 'bKash',
      phoneNumber: '01812-345678',
      accountHolder: 'John Doe',
      logo: '🔴', // Red circle emoji as placeholder
      isDefault: false
    },
    {
      id: 5,
      type: 'rocket',
      name: 'Rocket',
      phoneNumber: '01912-345678',
      accountHolder: 'John Doe',
      logo: '🟣', // Purple circle emoji as placeholder
      isDefault: false
    }
  ]);

  // Handle delete bank account
  const handleDeleteBank = (id) => {
    if (window.confirm('Are you sure you want to remove this bank account?')) {
      setBankAccounts(bankAccounts.filter(account => account.id !== id));
      console.log('Deleted bank account:', id);
    }
  };

  // Handle delete mobile banking
  const handleDeleteMobile = (id) => {
    if (window.confirm('Are you sure you want to remove this mobile banking account?')) {
      setMobileBanking(mobileBanking.filter(account => account.id !== id));
      console.log('Deleted mobile banking:', id);
    }
  };

  // Handle add new method
  const handleAddNew = () => {
    console.log('Add new payment method');
    alert('Open add payment method form');
  };

  // Handle set default
  const handleSetDefault = (id, type) => {
    if (type === 'bank') {
      setBankAccounts(bankAccounts.map(acc => ({
        ...acc,
        isDefault: acc.id === id
      })));
    } else {
      setMobileBanking(mobileBanking.map(acc => ({
        ...acc,
        isDefault: acc.id === id
      })));
    }
    console.log('Set as default:', id, type);
  };

  return (
    <div className="payment-methods-page">
        <BuyerSidebar/>
      <div className="payment-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">My Payment Methods</h1>
          <button className="btn-add-method" onClick={handleAddNew}>
            <Plus size={20} />
            <span>Add New Method</span>
          </button>
        </div>

        {/* Bank Accounts Section */}
        <section className="payment-section">
          <h2 className="section-title">Bank Accounts</h2>
          <div className="payment-grid">
            {bankAccounts.map((account) => (
              <div key={account.id} className="payment-card">
                <div className="card-icon bank-icon">
                  🏦
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">{account.bankName}</h3>
                      <p className="card-subtitle">
                        Account: {account.accountNumber}
                      </p>
                      <p className="card-holder">{account.accountHolder}</p>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteBank(account.id)}
                      disabled={account.isDefault}
                      aria-label="Delete payment method"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {account.isDefault ? (
                    <span className="default-badge">Default</span>
                  ) : (
                    <button
                      className="set-default-btn"
                      onClick={() => handleSetDefault(account.id, 'bank')}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile Banking Section */}
        <section className="payment-section">
          <h2 className="section-title">Mobile Banking / Wallet</h2>
          <div className="payment-grid">
            {mobileBanking.map((account) => (
              <div key={account.id} className="payment-card">
                <div className={`card-icon mobile-icon ${account.type}`}>
                  {account.logo}
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">{account.name}</h3>
                      <p className="card-subtitle">{account.phoneNumber}</p>
                      <p className="card-holder">{account.accountHolder}</p>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMobile(account.id)}
                      disabled={account.isDefault}
                      aria-label="Delete payment method"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {account.isDefault ? (
                    <span className="default-badge">Default</span>
                  ) : (
                    <button
                      className="set-default-btn"
                      onClick={() => handleSetDefault(account.id, 'mobile')}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Notice */}
        <div className="security-notice">
          <Lock size={16} />
          <span>Your payment data is encrypted and secure.</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;