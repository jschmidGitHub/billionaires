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

// ---------------------------------------------------------------------
// POST /api/customer-dropdown
// Body: {}
// ---------------------------------------------------------------------
app.get('/api/customer-dropdown', async (req, res) => {
    
    //console.log("Got a GET: /api/customer-dropdown");

    try {
      const customers = db.prepare('SELECT ID, Name FROM Customers').all();
      
      //console.log("Customers: ", customers);

      res.json(customers);  // Forward query results to the front-end
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// ---------------------------------------------------------------------
// POST /api/product-detail
// Body: {}
// ---------------------------------------------------------------------
app.get('/api/product-detail', async (req, res) => {
    
    //console.log("Got a GET: /api/product-detail");
    const customerId = req.query.customerId;

    if (!customerId) {
        console.error("customerId missing in query params.");
        return res.status(400).json({ error: 'customerId is required' });
    }

    try {
      const productDetail = db.prepare(`SELECT ID, CustomerID, Name, Description, Price FROM Products WHERE CustomerID = ${customerId}`).all();
      
      //console.log("Product Detail: ", productDetail);

      res.json(productDetail);  // Forward query results to the front-end
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.post('/api/new-customer/', async (req, res) => {

  //console.log("Got a POST: /api/new-customer");
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

    console.log("Db object: ", db);

  try {
    // Step 1: Get max ID — correct better-sqlite3 syntax
    const row = db.prepare('SELECT MAX(ID) AS maxId FROM Customers').get();
    const maxId = row?.maxId ?? 0;
    const newId = maxId + 1;

    // Step 2: Insert new customer — correct syntax
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

app.delete('/api/delete-customer/', async (req, res) => {
  
  console.log("Got a DELETE: /api/delete-customer");
  const customerId = req.query.customerId;   // e.g., /api/delete-customer/?customerId=5

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

    // If foreign key constraint fails (e.g., customer has products)
    if (err.message.includes('FOREIGN KEY constraint failed')) {
      return res.status(409).json({
        error: 'Cannot delete customer: they have associated products. Delete products first.'
      });
    }

    res.status(500).json({ error: 'Failed to delete customer' });
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