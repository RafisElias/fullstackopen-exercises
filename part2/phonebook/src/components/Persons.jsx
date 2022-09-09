const Persons = ({ persons, filter, deletePerson }) => {
  const handleDelete = (person) => () => deletePerson(person);
  return persons
    .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
    .map((person) => (
      <div key={person.id}>
        <span>
          {person.name} - {person.number}
        </span>
        <button onClick={handleDelete(person)}>delete</button>
      </div>
    ));
};
export default Persons;
