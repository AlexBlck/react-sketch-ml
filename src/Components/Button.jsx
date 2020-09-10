import React from 'react'
import PropTypes from 'prop-types'

function Button(props) {
  const { onClick, name } = props
  return (
    <button type="button" onClick={onClick}>
      {name}
    </button>
  )
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
}

export default Button
