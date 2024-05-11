const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 5173;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "1234",
  port: 5432,
});

app.use(bodyParser.json());

// Create Entity Endpoint
app.post("/create-entity", async (req, res) => {
  const { entityName, attributes } = req.body;

  // Create table query
  let createTableQuery = `CREATE TABLE ${entityName} (id SERIAL PRIMARY KEY`;

  // Add attributes to the table definition
  attributes.forEach((attribute) => {
    createTableQuery += `, ${attribute.name} ${attribute.type}`;
  });

  createTableQuery += ");";

  try {
    await pool.query(createTableQuery);
    res.status(200).send("Entity created successfully");
  } catch (error) {
    console.error("Error creating entity:", error);
    res.status(500).send("Error creating entity");
  }
});

// Read Entity Endpoint
app.get("/get-entity/:entityName", async (req, res) => {
  const { entityName } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM ${entityName}`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving entity:", error);
    res.status(500).send("Error retrieving entity");
  }
});

// Update Entity Endpoint
app.put("/update-entity/:entityName/:id", async (req, res) => {
  const { entityName, id } = req.params;
  const newData = req.body;

  let updateQuery = `UPDATE ${entityName} SET`;

  Object.entries(newData).forEach(([key, value], index) => {
    if (index !== 0) {
      updateQuery += ",";
    }
    updateQuery += ` ${key}='${value}'`;
  });

  updateQuery += ` WHERE id=${id}`;

  try {
    await pool.query(updateQuery);
    res.status(200).send("Entity updated successfully");
  } catch (error) {
    console.error("Error updating entity:", error);
    res.status(500).send("Error updating entity");
  }
});

// Delete Entity Endpoint
app.delete("/delete-entity/:entityName/:id", async (req, res) => {
  const { entityName, id } = req.params;

  try {
    await pool.query(`DELETE FROM ${entityName} WHERE id=${id}`);
    res.status(200).send("Entity deleted successfully");
  } catch (error) {
    console.error("Error deleting entity:", error);
    res.status(500).send("Error deleting entity");
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
