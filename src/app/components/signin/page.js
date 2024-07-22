'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import CartContext from '../context/CartContext';
import Image from 'next/image';
import FusionImg from '../../../images/fusionbazar.png'

export default function SignIn() {
    const { userStatus, setUserStatus } = useContext(CartContext)
    const navigate = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [isLogedIn, setIsLogedIn] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user-data')
        if (userData) {
            try {
                const parsedData = JSON.parse(userData)
                setIsLogedIn(parsedData)
            } catch (error) {
                console.error("Error parsing user data:", error)
            }
        }
    }, [])

    useEffect(() => {
        if (isLogedIn) {
            navigate.replace('/components/showAllProducts')
        }
    }, [isLogedIn, navigate])

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleLogin = async () => {
        setEmailError("") // Reset email error
        if (!email || !password) {
            return toast.error('Please, fill the form first', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address")
            return
        }
        try {
            const results = await axios.get(`/api/signup?email=${email}&password=${password}`)
            if (results?.data?.success) {
                console.log(results?.data)
                localStorage.setItem("auth-token", JSON.stringify(results?.data?.data?.auth))
                localStorage.setItem("user-data", JSON.stringify(results?.data?.data?.userdata))
                navigate.replace("/components/showAllProducts")
                setIsLogedIn(results?.data?.data?.userdata)
                setUserStatus(!userStatus)
            } else {
                return toast.error('Something went wrong, Please check the credentials', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <main className='flex flex-col items-center h-[80dvh] box-border relative'>
                <Image src={FusionImg} alt="Fusion Bazar" className='w-[400px] h-[400px] opacity-5 absolute top-10 left-[11%]' />
                <div className='w-[30%] border flex flex-col gap-4 p-3 rounded shadow-lg border-gray-100 mt-[10dvh]'>
                    <div className='flex justify-between'>
                        <h1 className='font-bold text-xl'>Login</h1>
                        <h1 className='font-bold text-[30px] font-sans opacity-25'>Fusion Bazar</h1>
                    </div>
                    <label htmlFor="email" className='text-xs font-semibold'>Email</label>
                    <input
                        id='email'
                        type="email"
                        placeholder='email'
                        className={`bg-gray-100 p-2 rounded outline-none ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {emailError && <p className='text-red-500 text-xs mt-1'>{emailError}</p>}

                    <label htmlFor="password" className='text-xs font-semibold'>Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder='password'
                        className='bg-gray-100 p-2 rounded outline-none'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button
                        className='bg-green-600 text-white font-semibold p-2 rounded outline-none border-none cursor-pointer'
                        onClick={handleLogin}
                    >Login</button>
                    <hr />
                    <p className='text-center font-semibold cursor-pointer' onClick={() => navigate.push('/components/signup')}>Don&apos;t have an account? <span className='text-green-600 cursor-pointer'>Register</span></p>
                </div>
                <ToastContainer pauseOnFocusLoss={false} />
            </main>
        </>
    )
}
