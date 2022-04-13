const Filter = ({filter, handler}) => {
    return(
      <div>
        <form>
          filter shown with <input value = {filter} onChange = {handler} />
        </form>
      </div>
    )
  }

export default Filter