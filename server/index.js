const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors"); // Import CORS middleware

const app = express();
const port = 3000; // Change port to 3000

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "12345",
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware to enable CORS support

app.get("/", (req, res) => {
  res.send("Hello world");
  console.log("Server Is Working ");
});

// Create Entity Endpoint
app.post("/create-entity", async (req, res) => {
  const { entityName, attributes } = req.body;

  // Create table query
  let createTableQuery = `CREATE TABLE ${entityName} (id SERIAL PRIMARY KEY`;

  // Add attributes to the table definition
  attributes.forEach((attribute, index) => {
    createTableQuery += `, ${attribute.name} ${mapToPostgreSQLType(
      attribute.type
    )}`;
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

// Read Entity Endpoint
app.get("/get-entity/:entityName", async (req, res) => {
  const { entityName } = req.params;

  try {
    // Construct and execute the SQL query to fetch data from the specified table
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

// Add this route to your backend code
app.get("/get-tables", async (req, res) => {
  try {
    // Query to fetch table names from information schema
    const queryResult = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
    );

    // Extract table names from the query result
    const tables = queryResult.rows.map((row) => row.table_name);

    res.status(200).json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).send("Error fetching tables");
  }
});

// Add a new endpoint to fetch fields of a specific table
app.get("/get-fields/:tableName", async (req, res) => {
  const { tableName } = req.params;

  try {
    // Query to fetch column names and data types for the specified table
    const queryResult = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='${tableName}';`
    );

    // Extract column names and data types from the query result
    const fields = queryResult.rows.map((row) => ({
      name: row.column_name,
      type: row.data_type,
    }));

    res.status(200).json(fields);
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).send("Error fetching fields");
  }
});

// Add a new endpoint to insert data into a table
app.post("/insert-data/:tableName", async (req, res) => {
  const { tableName } = req.params;
  const newData = req.body;

  // Extract column names from the newData object
  const columns = Object.keys(newData).join(", ");
  // Extract values from the newData object
  const values = Object.values(newData)
    .map((value) => (typeof value === "string" ? `'${value}'` : value))
    .join(", ");

  try {
    // Query to insert data into the specified table
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
    await pool.query(query);
    res.status(200).send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data");
  }
});

function mapToPostgreSQLType(jsType) {
  // Map JavaScript types to PostgreSQL types
  switch (jsType) {
    case "string":
      return "TEXT";
    case "number":
      return "INTEGER";
    case "Date":
      return "TIMESTAMP";
    default:
      return "TEXT"; // Default to TEXT if type is not recognized
  }
}

app.listen(port, "localhost", () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
