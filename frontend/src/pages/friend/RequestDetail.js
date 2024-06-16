import React from 'react'
import { Link } from 'react-router-dom'
import { acceptRequest, deleteRequest } from '../../function/user'

const RequestDetail = ({request ,user, setRefresh}) => {
  const conFirmRequestHandler = async ()=>{
    await acceptRequest(request._id,user.token)
    setRefresh(prev => !prev)
  }

  const deleteRequestHandler = async ()=>{
    await deleteRequest(request._id,user.token)
    setRefresh(prev => !prev)
  }

  return (
    <div className='container'>
      <div className='listRequest'>
          <div className="title">
              <Link to={`/profile/${request.username}`}>
                <img src={request.picture} className='avatar' />
              </Link>
              <div className='name'>{request.first_name + " " +request.last_name}</div>
          </div>
          <div>
              {request.first_name + " " +request.last_name} want to be your friend
          </div>
          <div className="request">
              <button className='btn_accept' onClick={conFirmRequestHandler}>Accept</button>
              <button className='btn_deny' onClick={deleteRequestHandler}>Deny</button>
          </div>
      </div>
    </div>
  )
}

export default RequestDetail
