import React, { useState } from "react";
import axios from "axios";
import Title from "./Title";

const Create = () => {
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState([
    { name: "", type: "string" },
    { name: "", type: "string" },
    { name: "", type: "string" },
    { name: "", type: "string" },
    { name: "", type: "string" },
  ]);

  const handleFieldChange = (index, fieldProp, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldProp] = value;
    setFields(updatedFields);
  };

  const handleTypeChange = (index, value) => {
    handleFieldChange(index, "type", value);
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post("http://localhost:3000/create-entity", {
        entityName: tableName,
        attributes: fields,
      });
      console.log(response.data);
      // Handle success
    } catch (error) {
      console.error("Error creating entity:", error);
      // Handle error
    }
  };

  return (
    <div>
      <Title />
      <section className="p-6 dark:bg-gray-100 dark:text-gray-900">
        <form
          noValidate=""
          action=""
          className="container flex flex-col mx-auto space-y-12"
        >
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-50">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Create Entities</p>
              <p className="text-xs">
                Enter The Entity Details You Want To Create
              </p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full">
                <label htmlFor="tableName" className="text-sm">
                  Table Name
                </label>
                <input
                  id="tableName"
                  type="text"
                  placeholder="Table Name"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-900 focus:dark:ring-violet-600 dark:border-gray-300 border"
                />
              </div>
              {fields.map((field, index) => (
                <React.Fragment key={index}>
                  <div className="col-span-full sm:col-span-3">
                    <label htmlFor={`field${index + 1}`} className="text-sm">
                      Field {index + 1}
                    </label>
                    <input
                      id={`field${index + 1}`}
                      type="text"
                      placeholder={`Field ${index + 1}`}
                      value={field.name}
                      onChange={(e) =>
                        handleFieldChange(index, "name", e.target.value)
                      }
                      className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-900 focus:dark:ring-violet-600 dark:border-gray-300 border"
                    />
                  </div>
                  <div className="col-span-full sm:col-span-3">
                    <label
                      htmlFor={`field${index + 1}Type`}
                      className="text-sm"
                    >
                      Type
                    </label>
                    <select
                      id={`field${index + 1}Type`}
                      value={field.type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-900 focus:dark:ring-violet-600 dark:border-gray-300 border"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="Date">Date</option>
                    </select>
                  </div>
                </React.Fragment>
              ))}
              <div className="col-span-full">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default Create;
