import axios from "axios";

const BASE_URL = "http://localhost:3000/persons";

const createNewPerson = async (person) => {
  const { data } = await axios.post(BASE_URL, person);
  return data;
};

const getAllPersons = async () => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

const deletePerson = async (personId) => {
  const { data } = await axios.delete(`${BASE_URL}/${personId}`);
  return data;
};

const updatePerson = async (person) => {
  const { data } = await axios.put(`${BASE_URL}/${person.id}`, person);
  return data;
};

export default {
  getAllPersons,
  createNewPerson,
  deletePerson,
  updatePerson,
};
