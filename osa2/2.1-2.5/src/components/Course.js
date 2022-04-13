const Header = (props) => {
    return (
      <div>
        <h1>{props.course}</h1>
      </div> 
    )
  }
  
  const Part = ({name, exercises}) => {
    return (
        <p>{name} {exercises}</p>
    )
  }
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map((parts, i) =>
          <Part key = {i} name = {parts.name} exercises = {parts.exercises}/>
          )}
      </div>
    )
  }
  
  const Total = ({parts}) => {
    const initial = 0
    const total = parts.reduce((s,p) => 
      s + p.exercises, initial)
    return (
      <div>
        <b>Number of exercises {total}</b>
      </div>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header  course = {course.name}/>
        <Content parts = {course.parts}/>
        <Total parts = {course.parts}/>
      </div> 
    )
  }

  export default Course