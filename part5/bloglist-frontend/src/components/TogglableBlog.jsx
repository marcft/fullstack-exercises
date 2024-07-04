import { useState } from 'react'
import PropTypes from 'prop-types'

const TogglableBlog = (props) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <div style={{ display: 'inline-block', marginRight: 5 }}>
        {props.title}
      </div>
      <button className="toggle-button" onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      <div
        className="togglable-content"
        style={{ display: visible ? '' : 'none' }}>
        {props.children}
      </div>
    </>
  )
}

TogglableBlog.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default TogglableBlog
