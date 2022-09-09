import { useEffect, useState } from "react";
import axios from "axios";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

import personsApi from "./apis/personsApi";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [filter, setFilter] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChangeName = (event) => setNewName(event.target.value);
  const handleChangeNumber = (event) => setNewNumber(event.target.value);
  const handleChangeFilterName = (event) => setFilter(event.target.value);

  const clearFields = () => {
    setNewName("");
    setNewNumber("");
    setError(false);
  };

  const updatePerson = async (person) => {
    try {
      const data = await personsApi.updatePerson(person);
      setMessage(`${data.name} has been updated`);
      setPersons((prev) =>
        prev.map((item) => {
          if (item.id !== data.id) return item;
          return data;
        })
      );
      clearFields();
    } catch (error) {
      setMessage("");
    }
  };

  const handleAddNewPerson = async (event) => {
    event.preventDefault();
    const isPersonDuplicate = persons.find(
      (s) => s.name.toLowerCase() === newName.toLowerCase()
    );
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    if (!isPersonDuplicate) {
      try {
        const data = await personsApi.createNewPerson(newPerson);
        clearFields();
        setMessage(`Added ${data.name}`);
        setPersons((prev) => prev.concat(data));
      } catch (error) {
        setMessage("");
      }
    } else if (
      window.confirm(
        `${newName} is already add to phonebook, replace the old number with a new one?`
      )
    ) {
      updatePerson({ ...isPersonDuplicate, number: newNumber });
    }
  };

  const fetchPersons = async () => {
    try {
      const data = await personsApi.getAllPersons();
      setPersons(data);
    } catch (error) {}
  };

  const handleDeletePerson = async (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      try {
        await personsApi.deletePerson(person.id);
        setMessage(`${person.name} has been deleted`);
        setError(false);
        setPersons((prev) => prev.filter((item) => item.id !== person.id));
      } catch (error) {
        setMessage(
          `Information of ${person.name} has already been removed from server`
        );
        setError(true);
      }
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>

      {message && (
        <p className="msg" style={{ color: error ? "red" : "green" }}>
          {message}
        </p>
      )}

      <Filter filter={filter} handleChange={handleChangeFilterName} />

      <h3>Add a new</h3>
      <PersonForm
        handleChangeName={handleChangeName}
        handleChangeNumber={handleChangeNumber}
        nameValue={newName}
        numberValue={newNumber}
        handleSubmit={handleAddNewPerson}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filter={filter}
        deletePerson={handleDeletePerson}
      />
    </div>
  );
}

export default App;
