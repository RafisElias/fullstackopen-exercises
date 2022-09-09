const Part = ({ name, exercises }) => (
  <p>
    {name}: {exercises}
  </p>
);

const Content = ({ parts }) =>
  parts.map((part) => (
    <Part
      key={`${part.id} ${part.name}`}
      name={part.name}
      exercises={part.exercises}
    />
  ));

export default Content;
