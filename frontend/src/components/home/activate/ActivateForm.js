import React from 'react'
import './style.css'
const ActivateForm = ({header,message, type}) => {
  return (
    <div className="blur">
      <div className="pop_up">
          <div className={`header ${type ==='success'? 'success_text':'error_text'}`}>
              {header}
          </div>
          <div className="content">
              {message}
          </div>
      </div>
    </div>
  )
}

export default ActivateForm
