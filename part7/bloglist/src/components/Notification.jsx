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

const Notification = ({ notificationMessage }) => {
  const errorStyle = { ...notificationStyles, color: 'red' }
  const successStyle = { ...notificationStyles, color: 'green' }

  const { errorMessage, successMessage } = notificationMessage

  if (errorMessage) {
    return <p style={errorStyle}>{errorMessage}</p>
  }

  if (successMessage) {
    return <p style={successStyle}>{successMessage}</p>
  }
}

Notification.propTypes = {
  notificationMessage: PropTypes.shape({
    errorMessage: PropTypes.string,
    successMessage: PropTypes.string,
  }),
}

export default Notification
