import React from 'react'
import { useSelector } from "react-redux";
import { Navigate, Outlet } from 'react-router-dom';

const LoggedInRoutes = () => {
    const { user } = useSelector(state => ({ ...state }))
    return user ? <Outlet /> : <Navigate to='/login' />
}

export default LoggedInRoutes
