import React from 'react';

const PersonForm = ({addPerson, nameState, numberState}) => {
    return (
      <form onSubmit = {addPerson}>
          <div>
            name: <input value = {nameState[0]} onChange = {nameState[1]}/>
          </div>
          <div>
            number: <input value = {numberState[0]} onChange = {numberState[1]}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
    )
  }

export default PersonForm