import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'

const App = () => (
  <>
    <h1>Anecdotes</h1>
    <Filter />
    <AnecdoteList />
    <AnecdoteForm />
  </>
)

export default App
