'use client'
import React, { useEffect, useState, useContext, useRef } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CartContext from "../context/CartContext";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArrowDropUpSharpIcon from '@mui/icons-material/ArrowDropUpSharp';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from MUI12   
import Image from 'next/image'
import FusionBazar from '../../../images/fusionbazar.png'

export default function Navbar() {
    const { cart, userStatus, setUserStatus } = useContext(CartContext)
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [isDialog, setIsDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(true); // Initial loading state
    const [isNavigating, setIsNavigating] = useState(false); // Navigation loading state
    const dialogRef = useRef(null);

    useEffect(() => {
        const userData = localStorage.getItem('user-data')
        if (userData) {
            try {
                const parsedUserData = JSON.parse(userData)
                setIsLoggedIn(parsedUserData)
            } catch (error) {
                console.error("Error parsing user data:", error.message)
            }
        }
        setIsLoading(false);
    }, [userStatus])

    useEffect(() => {
        router.prefetch('/components/showAllProducts')
        router.prefetch('/components/adminPanel')
        router.prefetch('/components/userProfile')
    }, [router])

    const handleLogout = async () => {
        setIsNavigating(true);
        localStorage.removeItem('user-data')
        localStorage.removeItem('auth-token')
        setIsLoggedIn(null)
        setUserStatus(!userStatus)
        setIsNavigating(false);
        closeDialogWithDelay();
    }

    const handleNavigation = async (path) => {
        setIsNavigating(true);
        router.push(path);
        setIsNavigating(false);
        closeDialogWithDelay();
    }

    const closeDialogWithDelay = () => {
        setTimeout(() => {
            setIsDialog(false);
        }, 100);
    }

    if (isLoading) {
        return (
            <div className='w-full flex lg:px-[5dvw] py-4 items-center lg:flex-row sm:flex-col-reverse xs:flex-col-revers border border-b-4 border-b-gray-200'>
                <div className='flex gap-2 lg:flex-row sm:flex-col xs:flex-col'>
                    <Image src={FusionBazar} className='w-[50px] h-[50px]' alt='logo.img' />
                    <h1 className='font-bold text-black text-2xl'>Fusion Bazaar</h1>
                </div>
            </div>
        )
    }

    return (
        <>
            <main className={`w-full flex justify-between lg:px-[5dvw] py-4 items-center lg:flex-row sm:flex-col-reverse xs:flex-col-revers border border-b-4 border-b-gray-200 ${isNavigating ? 'cursor-wait' : 'cursor-default'}`}>
                <div className='flex gap-2 lg:flex-row sm:flex-col xs:flex-col'>
                    <Image src={FusionBazar} className='w-[50px] h-[50px]' alt='logo.img' />
                    <h1 className='font-bold text-black text-2xl'>Fusion Bazaar</h1>
                </div>
                <div>
                    <ul className='flex gap-5 cursor-pointer'>
                        <Link href={'/'} className='hover:text-green-600 font-[500] duration-100'>Home</Link>
                        <Link href={'/components/showAllProducts'} className='hover:text-green-600 font-[500] duration-100'>All Products</Link>
                        <Link href={'/'} className='hover:text-green-600 font-[500] duration-100'>Latest Products</Link>
                    </ul>
                </div>
                <div className='flex lg:flex-row sm:flex-col-reverse xs:flex-col-reverse gap-1 justify-center'>
                    <div className='flex'>
                        <p
                            className='flex px-2 py-0 items-center rounded cursor-pointer text-black'
                            onClick={() => handleNavigation("/components/cartList")}
                        >
                            <ShoppingCartIcon className='mr-2 text-green-600' /> cart
                            {cart?.cartItems?.length > 0 ?
                                <span className='bg-red-500 text-white rounded-full w-4 h-4 p-1 flex items-center justify-center text-[10px] ml-2'>
                                    {cart?.cartItems?.length}
                                </span>
                                : ""}</p>
                        {
                            isLoggedIn ?
                                <div>
                                    {
                                        isLoggedIn.isAdmin ?
                                            <div className='flex gap-1 items-center ml-3 relative rounded'>
                                                <AdminPanelSettingsIcon className='w-[40px] h-[40px]' />
                                                <div>
                                                    <h3 className='font-semibold text-sm pt-3 cursor-default'>{isLoggedIn.name}</h3>
                                                    <p className='text-sm text-gray-400 cursor-default'>{isLoggedIn.email}</p>
                                                </div>
                                                {
                                                    !isDialog ?
                                                        <ArrowDropDownIcon className='cursor-pointer' onClick={() => setIsDialog(!isDialog)} />
                                                        : <ArrowDropUpSharpIcon className='cursor-pointer' onClick={() => setIsDialog(!isDialog)} />
                                                }
                                                {
                                                    isDialog &&
                                                    <div className='border absolute bg-white p-3 top-11 right-0 rounded shadow-lg border-none'>
                                                        <div className='flex items-center gap-1 p-2 cursor-pointer' onClick={() => handleNavigation('/components/adminPanel')}>
                                                            <AdminPanelSettingsIcon className='z-10 ' />
                                                            <p className='z-10'> Profile</p>
                                                        </div>
                                                        <div className='flex items-center gap-1 p-2 cursor-pointer' onClick={handleLogout}>
                                                            <LockRoundedIcon className='z-10' />
                                                            <button className='px-2 p-1 w-full rounded mr-2 z-10'>Logout</button>
                                                        </div>
                                                    </div>
                                                }
                                            </div> : (
                                                <div className='flex gap-1 items-center ml-3 relative rounded'>
                                                    <AccountCircleIcon className='w-[40px] h-[40px]' />
                                                    <div>
                                                        <h3 className='font-semibold text-sm pt-3 cursor-default'>{isLoggedIn.name}</h3>
                                                        <p className='text-sm text-gray-400 cursor-default'>{isLoggedIn.email}</p>
                                                    </div>
                                                    {
                                                        !isDialog ?
                                                            <ArrowDropDownIcon className='cursor-pointer' onClick={() => setIsDialog(!isDialog)} />
                                                            : <ArrowDropUpSharpIcon className='cursor-pointer' onClick={() => setIsDialog(!isDialog)} />
                                                    }
                                                    {
                                                        isDialog &&
                                                        <div ref={dialogRef} className='border absolute bg-white p-3 top-11 right-0 rounded shadow-lg border-none'>
                                                            <div className='flex items-center gap-1 p-2 cursor-pointer' onClick={() => handleNavigation('/components/userProfile')}>
                                                                <AccountCircleIcon className='z-10' />
                                                                <p className='z-10'> Profile</p>
                                                            </div>
                                                            <div className='flex items-center gap-1 p-2 cursor-pointer' onClick={handleLogout}>
                                                                <LockRoundedIcon className='z-10' />
                                                                <button className='px-2 p-1 w-full rounded mr-2 z-10'>Logout</button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                    }
                                </div>
                                :
                                (<button className='px-2 p-1 rounded mr-2 text-black' onClick={() => handleNavigation('/components/signin')}>
                                    {isNavigating ? <CircularProgress size={24} /> : 'Sign in'}
                                </button>)
                        }
                    </div>
                </div>
            </main>
        </>
    )
}
