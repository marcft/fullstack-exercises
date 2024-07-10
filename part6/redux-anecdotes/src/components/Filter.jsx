import { useDispatch } from 'react-redux'
import { filterAnecdotesBy } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    event.preventDefault()
    const filter = event.target.value
    dispatch(filterAnecdotesBy(filter))
  }

  const style = {
    marginBottom: 15,
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
