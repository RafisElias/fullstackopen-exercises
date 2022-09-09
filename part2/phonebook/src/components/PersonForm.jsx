const PersonForm = ({
  handleSubmit,
  nameValue,
  numberValue,
  handleChangeName,
  handleChangeNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={nameValue}
          onChange={handleChangeName}
        />
      </div>
      <div>
        <label htmlFor="number">number:</label>
        <input
          type="tel"
          id="number"
          name="number"
          value={numberValue}
          onChange={handleChangeNumber}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
export default PersonForm;
