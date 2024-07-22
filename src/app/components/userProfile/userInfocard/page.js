'use client'
import React, { useEffect, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function UserInfoCard() {
    const [userInfo, setUserInfo] = useState("");
    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('user-data'))
        setUserInfo(userDetails)
    }, [userInfo])
    return (
        <div>
            <div className='shadow-lg px-2 py-3 rounded-lg bg-gray-50 pb-10'>
                <div className='flex items-center gap-2'>
                    <AccountCircleIcon />
                    <p className='font-bold font-serif'>User Info Card</p>
                </div>
                <div className='px-8'>
                    <p className='font-semibold text-xs mt-3 text-green-700'>Name *</p>
                    <p>{userInfo.name}</p>
                    <p className='font-semibold text-xs mt-3 text-green-700'>Phone *</p>
                    <p> {userInfo.phone}</p>
                    <p className='font-semibold text-xs mt-3 text-green-700'>Email *</p>
                    <p> {userInfo.email}</p>
                    <p className='font-semibold text-xs mt-3 text-green-700'>Address *</p>
                    <p> {userInfo.address}</p>
                </div>
            </div>

        </div>
    )
}
