const Header = (props) => <h2>{props.course}</h2>

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
)

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((acc, cur) => acc + cur.exercises, 0)

  return (
    <p>
      <strong>Total of {totalExercises} exercises</strong>
    </p>
  )
}

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
