import React, { useEffect, useState } from 'react'
import './style.css'
import { useSelector } from 'react-redux'
import { getFriendRequest } from '../../function/user'
import RequestDetail from './RequestDetail'
import Header from '../../components/header'

const FriendRequest = () => {
    const { user } = useSelector(state=> ({...state}))
    const [requestInfo, setRequestInfo] = useState([])
    const [refresh, setRefresh] = useState(false)
    const getRequest = async ()=>{
        const data = await getFriendRequest(user.id,user.token)
        setRequestInfo(data)
    }

    useEffect(()=>{
        getRequest()
    },[refresh])

    return (
        <>
            <Header page="friendRequest" />
            <div className='top'>
                Danh sách lời mời kết bạn
            </div>
            <div className='request_page'>
                {requestInfo.length > 0 ? (
                    requestInfo.map((request, index)=> <RequestDetail key={index} request={request} user={user} setRefresh={setRefresh} />)
                ):(
                    <div className='empty_request'>Bạn không có lời mời kết bạn nào</div>
                )}
            </div>
        </>
    )
}

export default FriendRequest
