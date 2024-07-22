'use client'
import React, { useState, useContext } from 'react'
import UserInfoCard from '@/app/components/userProfile/userInfocard/page'
import ChangePassword from '@/app/components/userProfile/changepassword/page'
import UserAllOrders from '@/app/components/userProfile/userallorders/page'
import { useRouter } from 'next/navigation'
import CartContext from "../context/CartContext";

export default function UserProfile() {
    const { userStatus, setUserStatus } = useContext(CartContext)
    const navigation = useRouter()

    const handleLogout = () => {
        alert('logout');
        try {
            localStorage.removeItem('user-data');
            localStorage.removeItem('auth-token');
            setUserStatus(!userStatus);
            navigation.replace('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const [switchState, setSwitchState] = useState('userInfo')
    const renderContent = (state) => {
        switch (state) {
            case 'userInfo':
                return <UserInfoCard />
            case 'changepassword':
                return <ChangePassword />
            case 'placedorders':
                return <UserAllOrders />
            default:
                return <div>
                    <p className='font-bold'>Something went wrong, please try again.</p>
                </div>
        }
    }

    return (
        <main className='px-[5dvw] py-3'>
            <h2 className=' font-bold text-lg cursor-default' style={{ letterSpacing: '0.1em' }}>User Profile</h2>
            <div className='flex mt-3'>
                <div className='w-[15dvw] h-[75dvh] flex flex-col gap-2 p-1 rounded shadow-sm bg-green-50 '>
                    <span className='font-semibold hover:bg-green-200 duration-200 rounded py-1 hover:px-3 cursor-pointer' onClick={() => setSwitchState('userInfo')}>User Info</span>
                    <span className='font-semibold hover:bg-green-200 duration-200 rounded py-1 hover:px-3 cursor-pointer' onClick={() => setSwitchState('changepassword')}>Change Password</span>
                    <span className='font-semibold hover:bg-green-200 duration-200 rounded py-1 hover:px-3 cursor-pointer' onClick={() => setSwitchState('placedorders')}>Placed Orders</span>
                    <span className='font-semibold text-red-600 hover:bg-red-100 duration-200 rounded py-1 hover:px-3 cursor-pointer' onClick={handleLogout}>Logout</span>
                </div>
                <div className='w-[70dvw] pl-3'>{renderContent(switchState)}</div>
            </div>
        </main>
    )
}
