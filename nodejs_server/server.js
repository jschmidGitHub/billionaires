// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';   // npm i node-fetch@2
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = 3001;

// ---------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------
app.use(cors());                                   // allow SPA
app.use(express.json());                           // parse JSON bodies

app.get('/api/customers', async (req, res) => {
    
    //console.log("Got a GET: /api/customers");

    try {
      const customers = db.prepare('SELECT ID, Name FROM Customers').all();

      res.json(customers);  // Forward query results to the front-end
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.get('/api/products', async (req, res) => {
    
    //console.log("Got a GET: /api/products");
    const customerId = req.query.customerId;

    if (!customerId) {
        console.error("customerId missing in query params.");
        return res.status(400).json({ error: 'customerId is required' });
    }

    try {
      const productDetail = db.prepare(`SELECT ID, CustomerID, Name, ImageLink, Description, Price FROM Products WHERE CustomerID = ${customerId}`).all();
      
      //console.log("Product Detail: ", productDetail);

      res.json(productDetail);  // Forward query results to the front-end
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.post('/api/customers', async (req, res) => {

  //console.log("Got a POST: /api/customers");
  const { customerName } = req.body;

    if (!customerName) {
        console.error("customerName missing in req body.");
    }

    // Basic validation
    if (!customerName) {
        return res
            .status(400)
            .json({ error: 'Missing required field: customerName' });
    }

    const name = customerName.trim();

  try {
    const row = db.prepare('SELECT MAX(ID) AS maxId FROM Customers').get();
    const maxId = row?.maxId ?? 0;
    const newId = maxId + 1;

    // Insert new customer
    db.prepare('INSERT INTO Customers (ID, Name) VALUES (?, ?)').run(newId, name);

    console.log(`Added customer: ID=${newId}, Name="${name}"`);

    res.status(201).json({
      success: true,
      customer: { ID: newId, Name: name }
    });

  } catch (err) {
    console.error('Database error while adding customer:', err);
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Customer name already exists' });
    }
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  
  //console.log("Got a DELETE: /api/customers/:id");

  const customerId = req.params.id;

  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ error: 'Valid customer ID is required' });
  }

  const id = parseInt(customerId, 10);

  try {
    // Check if customer exists first
    const customer = db.prepare('SELECT ID, Name FROM Customers WHERE ID = ?').get(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Delete the customer
    const result = db.prepare('DELETE FROM Customers WHERE ID = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    console.log(`Deleted customer: ID=${id}, Name="${customer.Name}"`);

    res.status(200).json({
      success: true,
      message: 'Customer deleted',
      deletedId: id
    });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

app.post('/api/products', async (req, res) => {

  //console.log("Got a POST: /api/products");

  const { customerId, productName, description, price, imageLink } = req.body;

    // Basic validation
    if (!customerId) {
        console.error('Missing required field: customerId');
        return res
            .status(400)
            .json({ error: 'Missing required field: customerId' });
    }
    if (!productName) {
        console.error('Missing required field: productName');
        return res
            .status(400)
            .json({ error: 'Missing required field: productName' });
    }
    if (!description) {
        console.error('Missing required field: description');
        return res
            .status(400)
            .json({ error: 'Missing required field: description' });
    }


  try {
    const row = db.prepare('SELECT MAX(ID) AS maxId FROM Products').get();
    const maxId = row?.maxId ?? 0;
    const newId = maxId + 1;

    console.log("newID:", newId);

    // Insert new product
    db.prepare('INSERT INTO Products (ID, CustomerID, Name, Description, Price, ImageLink) VALUES (?, ?, ?, ?, ?, ?)').run(newId, customerId, productName, description, price, imageLink);

    console.log(`Added product with ID=${newId}, Name="${productName}"`);

    res.status(201).json({
      success: true,
      customer: { ID: newId, Name: productName }
    });
  } catch (err) {
    console.error('Database error while adding product:', err);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  
  console.log("Got a DELETE: /api/products/:id");

  const productId = req.params.id;

  if (!productId || isNaN(productId)) {
    return res.status(400).json({ error: 'Valid product ID is required' });
  }

  const id = parseInt(productId, 10);

  try {
    // Check if customer exists first
    const customer = db.prepare('SELECT ID FROM Products WHERE ID = ?').get(id);
    if (!customer) {
      console.error('Product not found at id:', id);
      return res.status(404).json({ error: 'Product not found' });
    }
  
    // Delete the customer
    const result = db.prepare('DELETE FROM Products WHERE ID = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log(`Deleted customer: ID=${id}, Name="${customer.Name}"`);

    res.status(200).json({
      success: true,
      message: 'Product deleted',
      deletedId: id
    });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete Product' });
  }
});

// ---------------------------------------------------------------------
// 404 for everything else
// ---------------------------------------------------------------------
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// ---------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Backend listening at localhost:${PORT} for queries`);
});