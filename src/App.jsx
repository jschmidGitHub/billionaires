import { useState, useEffect } from 'react';
import CustomerModal from './CustomerModal.jsx';
import ProductModal from './ProductModal.jsx';
import getCustomerList from './getCustomerList.js';
import getProductDetail from './getProductDetail.js';
import postNewCustomer from './postNewCustomer.js';
import deleteCustomer from './deleteCustomer.js';
import putCustomer from './putCustomer.js';
import postNewProduct from './postNewProduct.js';
import deleteProduct from './deleteProduct.jsx';
import noPic from './assets/noPic.png';
import './App.css';

function App() {
  const [customerId, setCustomerId] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRenameCustomerOpen, setIsRenameCustomerOpen] = useState(false);
  const [isModifyProductOpen, setIsModifyProductOpen] = useState(false);

  function handleAddCustomer() {
    setIsAddCustomerOpen(true);
  }

  function handleRenameCustomer() {
    if (!customerId) {
      alert("You must select a customer from the drop-down before using the Rename Customer button.");
    } else {
      setIsRenameCustomerOpen(true);
    }
  }

  function handleAddProduct() {

    if (!customerId) {
      alert("You must select a customer from the drop-down before adding a new Product.");
    } else {
      setIsAddProductOpen(true);
    }
  }

  async function handleDeleteProduct() {

    if (!customerId) {
      alert("You must select a customer from the drop-down before deleting a product.");
    } else if (!selectedProduct) {
      alert("You must click on a product from the product-buttons before deleting a product.");
    }
    else {
      await deleteProduct(selectedProduct.ID);
      setSelectedProduct(null);
      await fetchProductDetail();
    }
  }

  function handleModifyProduct() {
    console.log("Modify Product");
  }

  async function refreshCustomerList() {
    const updatedList = await getCustomerList();
    setOptionList(updatedList.map(customer => (
      <option key={customer.ID} value={customer.ID}>{customer.Name}</option>
    )));
  }

  async function fetchProductDetail() {
    try {
      const productDetail = await getProductDetail(customerId);

      if (productDetail?.length > 0) {
        setProductList(productDetail.map(product => (
          <tr key={product.ID} onClick={() => setSelectedProduct(product)}>
            <td>{product.Name}</td>
          </tr>
        )));
      } else {
        setProductList(null);
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error("could not get product list", err);
    }
  }

  async function handleDeleteCustomer() {
    await deleteCustomer(customerId);
    await refreshCustomerList();
    setCustomerId("");
  }

  async function handleSubmitNewCustomer(name) {
    try {

      await postNewCustomer(name);
      await refreshCustomerList();

    } catch (err) {
      alert("Failed to add customer");
      console.error(err);
    }
  };

  async function handleSubmitRenamedCustomer(newName) {
    try {
      if (customerId) {

        await putCustomer(newName, customerId);
        await refreshCustomerList();
      }

    } catch (err) {
      alert("Failed to rename customer");
      console.error(err);
    }
  }

  async function handleSubmitNewProduct(newProduct) {
    postNewProduct(newProduct);
  }

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
    fetchProductDetail();
  }, [customerId]);

  return (
    <div id="app-container">
      <div id="app-header">
        <h1>Billionaires and their Products</h1>

        <form id="customers-form">Billionaire:
          <select id="customers-drop"
            name="customers-drop"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="" disabled hidden>
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

          {selectedProduct && (
            <h2>Product Detail:</h2>
          )}
          <p>{selectedProduct ? `${selectedProduct.Name}:` : ""}</p>

          {selectedProduct && (
            <img id="product-image"
              src={selectedProduct.ImageLink}
              onError={(e) => {
                e.target.src = noPic; // fallback image
                e.target.onerror = null; // prevent infinite loop if noPic.png is also missing
              }} />
          )}
          <p>{selectedProduct ? selectedProduct.Description : ""}</p>
          <p>{selectedProduct ? `$${selectedProduct.Price}` : ""}</p>

        </div>

        <div id="button-panel">
          <button id="add-customer" onClick={handleAddCustomer}>Add Customer</button>
          <button id="rename-customer" onClick={handleRenameCustomer}>Rename Customer</button>
          <button id="delete-customer" onClick={handleDeleteCustomer}>Delete Customer</button>
          <button id="add-product" onClick={handleAddProduct}>Add Product</button>
          <button id="modify-product" onClick={handleModifyProduct}>Modify Product</button>
          <button id="delete-product" onClick={handleDeleteProduct}>Delete Product</button>
        </div>

        <CustomerModal
          isOpen={isAddCustomerOpen}
          onClose={() => setIsAddCustomerOpen(false)}
          customerPrefix="Add New"
          onSubmit={handleSubmitNewCustomer}
        />

        <CustomerModal
          isOpen={isRenameCustomerOpen}
          onClose={() => setIsRenameCustomerOpen(false)}
          customerPrefix="Rename"
          onSubmit={handleSubmitRenamedCustomer}
        />

        <ProductModal
          isOpen={isAddProductOpen}
          onClose={() => {
            setIsAddProductOpen(false)
            fetchProductDetail();
          }}
          customerId={customerId}
          onSubmit={handleSubmitNewProduct}
        />

      </div>
    </div>
  )
}

export default App
