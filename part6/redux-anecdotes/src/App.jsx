import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => (
  <>
    <h1>Anecdotes</h1>
    <Notification />
    <Filter />
    <AnecdoteList />
    <AnecdoteForm />
  </>
)

export default App
