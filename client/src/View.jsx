import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./style.css";
import Title from "./Title";
const View = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [fields, setFields] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://localhost:3000/get-tables");
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const fetchFields = async (tableName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-fields/${tableName}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fields:", error);
      return [];
    }
  };

  const fetchTableData = async (tableName, index) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-entity/${tableName}`
      );
      setTableData(response.data);
      setSelectedTable(tableName);
      setIsAdding(false);
      setExpandedCardIndex(index);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleDelete = async (tableName) => {
    try {
      await axios.delete(`http://localhost:3000/delete-entity/${tableName}`);
      setTables(tables.filter((table) => table !== tableName));
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  const handleUpdate = async (tableName, index) => {
    try {
      const fieldsData = await fetchFields(tableName);
      setFields(fieldsData);
      setSelectedTable(tableName);
      setIsAdding(false);
      setExpandedCardIndex(index);
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };

  const handleAdd = async (tableName, index) => {
    try {
      const fieldsData = await fetchFields(tableName);
      setFields(fieldsData);
      setSelectedTable(tableName);
      setIsAdding(true);
      setExpandedCardIndex(index);
    } catch (error) {
      console.error("Error preparing to add entity:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      if (isAdding) {
        await axios.post(
          `http://localhost:3000/insert-data/${selectedTable}`,
          data
        );
        alert("Data added successfully");
      } else {
        await axios.put(
          `http://localhost:3000/update-entity/${selectedTable}`,
          data
        );
        alert("Data updated successfully");
      }

      setFields([]);
      setSelectedTable(null);
      setIsAdding(false);
      setExpandedCardIndex(null);
      fetchTables();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  const renderFields = () => {
    if (!selectedTable || !fields.length) return null;

    return (
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <input
            key={field.name}
            type="text"
            name={field.name}
            placeholder={field.name}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    );
  };

  const renderTableData = () => {
    if (!tableData.length) return null;

    return (
      <div class="card-container">
        <h3>Data for {selectedTable}</h3>
        <table>
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Title />
      {tables.map((tableName, index) => (
        <Card
          key={index}
          style={{ width: "18rem", marginBottom: "1rem" }}
          class="card"
        >
          <Card.Body>
            <Card.Title>{tableName}</Card.Title>
            <Button variant="primary" onClick={() => handleDelete(tableName)}>
              Delete
            </Button>
            <Button
              variant="primary"
              onClick={() => handleUpdate(tableName, index)}
            >
              Update
            </Button>
            <Button
              variant="primary"
              onClick={() => handleAdd(tableName, index)}
            >
              Add
            </Button>
            <Button
              variant="primary"
              onClick={() => fetchTableData(tableName, index)}
            >
              View
            </Button>
            {expandedCardIndex === index && (
              <div style={{ marginTop: "1rem" }} class="table-container">
                {renderFields()}
                {renderTableData()}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default View;
