import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 2,
    marginBottom: 15,
  }

  if (notification) {
    return <div style={style}>{notification}</div>
  }
}

export default Notification
