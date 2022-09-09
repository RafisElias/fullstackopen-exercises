const Filter = ({ filter, handleChange }) => {
  return (
    <div>
      <label htmlFor="name">filter shown with:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={filter}
        onChange={handleChange}
      />
    </div>
  );
};
export default Filter;
