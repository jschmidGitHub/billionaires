import { useState } from 'react'

const AddCustomerModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ marginTop: 0 }}>Add New Customer</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '15px'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ccc' }}>
              Cancel
            </button>
            <button type="submit"
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#28a745', color: 'white' }}>
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal