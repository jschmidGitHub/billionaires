import { useState, useEffect } from 'react'
import AddCustomerModal from './AddCustomerModal.jsx'
import getCustomerList from './getCustomerList.js';
import getProductDetail from './getProductDetail.js';
import postNewCustomer from './postNewCustomer.js';
import deleteCustomer from './deleteCustomer.js';
import noPic from './assets/noPic.png';
import './App.css'

function App() {
  const [customerId, setCustomerId] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  function handleProductClick(product) {
    setSelectedProduct(product);
  }

  function handleAddCustomer() {
    setIsAddCustomerOpen(true);
  }

  async function refreshCustomerList() {
      const updatedList = await getCustomerList();
      setOptionList(updatedList.map(customer => (
        <option key={customer.ID} value={customer.ID}>{customer.Name}</option>
      )));
  }

  async function handleDeleteCustomer() {
    await deleteCustomer(customerId);
    await refreshCustomerList();
  }

  const handleSubmitNewCustomer = async (name) => {
    try {

      await postNewCustomer(name);
      await refreshCustomerList();
      
    } catch (err) {
      alert("Failed to add customer");
      console.error(err);
    }
  };

  // Populate the customersDrop select element at startup
  useEffect(() => {

    async function fetchCustomers() {
      try {
        const customers = await getCustomerList();

        if (customers?.length > 0) {

          setOptionList(customers.map(customer => (
            <option key={customer.ID} value={customer.ID}>{customer.Name}</option>
          )));
        }
      } catch (err) {
        console.error("could not get customer list", err);
      }
    }

    fetchCustomers();

  }, []);

  // Fetch new Product Detail any time customerId selection changes
  useEffect(() => {

    async function fetchProductDetail() {
      try {
        const productDetail = await getProductDetail(customerId);

        if (productDetail?.length > 0) {
          setProductList(productDetail.map(product => (
            <tr key={product.ID} onClick={() => handleProductClick(product)}>
              <td>{product.Name}</td>
            </tr>
          )));
        } else {
          setProductList(null);
          setSelectedProduct(null);
        }
      } catch (err) {
        console.error("could not get customer list", err);
      }
    }

    fetchProductDetail();

  }, [customerId]);

  return (
    <div id="app-container">
      <div id="app-header">
        <h1>Billionaires and their Products</h1>

        <form id="customers-form">Billionaire:
          <select id="customers-drop"
            name="customers-drop"
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="" disabled selected hidden>
              Select a Billionaire...
            </option>
            {optionList}
          </select>
        </form>
      </div>

      <div id="app-content">
        <table id="product-table">
          <tbody>
            {productList && productList.length > 0 && (
              <tr>
                <th><h2>
                  Products:
                </h2></th>
              </tr>
            )}
            {productList}
          </tbody>
        </table>

        <div id="product-info">
          <h2>Product Detail:</h2>
          <p>{selectedProduct ? `${selectedProduct.Name}:` : ""}</p>
          
          {selectedProduct && (
          <img id="product-image"
          src={selectedProduct.ImageLink}
          onError={(e) => {
                e.target.src = noPic; // fallback image
                e.target.onerror = null; // prevent infinite loop if noPic.png is also missing
              }}/>
            )}
          <p>{selectedProduct ? selectedProduct.Description : ""}</p>
          <p>{selectedProduct ? `$${selectedProduct.Price}` : ""}</p>
            
        </div>

        <div id="button-panel">
          <button id="add-customer" onClick={handleAddCustomer}>Add Customer</button>
          <button id="delete-customer" onClick={handleDeleteCustomer}>Delete Customer</button>
          <button id="add-product">Add Product</button>
          <button id="delete-product">Delete Product</button>
        </div>

        <AddCustomerModal
          isOpen={isAddCustomerOpen}
          onClose={() => setIsAddCustomerOpen(false)}
          onSubmit={handleSubmitNewCustomer}
        />

      </div>
    </div>
  )
}

export default App
