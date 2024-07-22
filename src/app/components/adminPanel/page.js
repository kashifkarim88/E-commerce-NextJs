'use client'
import React, { useState, useEffect } from 'react'
import AllUsers from '@/app/components/adminPanel/allUsers/page'
import AllOrders from '@/app/components/adminPanel/allOrders/pages'
import AdminShowAllProducts from '@/app/components/adminPanel/adminShowAllProducts/page'
import AddNewProduct from '@/app/components/adminPanel/addNewProduct/page'
import AdminProfile from '@/app/components/adminPanel/adminProfile/page'
import { useRouter } from 'next/navigation'


export default function AdminPanel() {
    const [currentState, setCurrentState] = useState("")
    const navigate = useRouter('')
    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-data'))
        if (!isLoggedIn) {
            return navigate.replace('/components/signin')
        }
        if (isLoggedIn && !isLoggedIn.isAdmin) {
            return navigate.replace('/components/showAllProducts')
        }
    }, [navigate])

    const handleCurrentState = (state) => {
        setCurrentState(state)
    }

    const renderContent = (state) => {
        switch (state) {
            case 'new-product':
                return <AddNewProduct />
            case 'all-products':
                return <AdminShowAllProducts />
            case 'all-orders':
                return <AllOrders />
            case 'all-users':
                return <AllUsers />
            case 'your-profile':
                return <AdminProfile />
            default:
                return <div>Welcome to Admin Dashboard</div>
        }
    }
    return <>
        <main>
            <div className='bg-blue-100 py-4 px-[5dvw]'>
                <h1 className='font-bold text-xl'>Admin DashBoard</h1>
            </div>
            <div className='flex px-[5dvw] py-3'>
                <div className=' w-[15dvw] box-border h-[70dvh] p-2 gap-2 flex flex-col'>
                    <button className='cursor-pointer text-left hover:bg-blue-100 p-1 rounded' onClick={() => handleCurrentState("new-product")}>New Product <span className='text-red-500 font-semibold'>(Admin)</span></button>
                    <button className='cursor-pointer text-left hover:bg-blue-100 p-1 rounded' onClick={() => handleCurrentState("all-products")}>All Products <span className='text-red-500 font-semibold'>(Admin)</span></button>
                    <button className='cursor-pointer text-left hover:bg-blue-100 p-1 rounded' onClick={() => handleCurrentState("all-orders")}>All Orders <span className='text-red-500 font-semibold'>(Admin)</span></button>
                    <button className='cursor-pointer text-left hover:bg-blue-100 p-1 rounded' onClick={() => handleCurrentState("all-users")}>All Users <span className='text-red-500 font-semibold'>(Admin)</span></button>
                    <button className='border bg-green-800 rounded-full p-1 hover:bg-green-900 duration-200 text-white w-[100px]' onClick={() => handleCurrentState("your-profile")}>Your Profile</button>
                    <hr className='h-[3px]' />
                    <button className='border-none text-red-700 font-bold text-left'>Logout</button>
                </div>
                <div className='p-2'>
                    {renderContent(currentState)}
                </div>
            </div>
        </main>
    </>
}
