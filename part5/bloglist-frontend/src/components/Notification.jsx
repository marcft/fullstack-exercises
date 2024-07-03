import PropTypes from 'prop-types'

const notificationStyles = {
  background: 'lightgrey',
  fontSize: 22,
  borderStyle: 'solid',
  borderWidth: 3,
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
}

const Notification = ({ successMessage, errorMessage }) => {
  const errorStyle = { ...notificationStyles, color: 'red' }
  const successStyle = { ...notificationStyles, color: 'green' }

  if (errorMessage) {
    return <p style={errorStyle}>{errorMessage}</p>
  }

  if (successMessage) {
    return <p style={successStyle}>{successMessage}</p>
  }
}

Notification.propTypes = {
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
}

export default Notification
