const Total = ({ parts }) => {
  const total = parts.reduce((cur, acc) => (cur += acc.exercises), 0);
  return (
    <p>
      <b>Total of {total} exercises</b>
    </p>
  );
};

export default Total;
