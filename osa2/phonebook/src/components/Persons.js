const Persons = ({ filter, deletePerson }) => {
  return (
    filter.map(person =>
      <Person key={person.name} person={person} deletePerson={deletePerson}
      />
    )
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <div>
      {person.name} {person.number}  <button type="button" onClick={deletePerson} value={person.id}>delete</button>
    </div>
  )
}

export default Persons