const notificationStyles = {
  background: 'lightgrey',
  fontSize: 22,
  borderStyle: 'solid',
  borderWidth: 3,
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
}

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return <div style={style}>{message}</div>
}

const SuccessNotification = ({ message }) => {
  const successStyles = {
    ...notificationStyles,
    color: 'green',
  }

  return <Notification message={message} style={successStyles} />
}

const ErrorNotification = ({ message }) => {
  const errorStyles = {
    ...notificationStyles,
    color: 'red',
  }

  return <Notification message={message} style={errorStyles} />
}

export { SuccessNotification, ErrorNotification }
