'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function ChangePassword() {
    const [newPasswordToggle, setNewPassToggle] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [userData, setUserData] = useState('')

    const verifyPassword = async () => {
        try {
            const userDeatils = JSON.parse(localStorage.getItem('user-data'))
            setUserData(userDeatils)
            const email = userDeatils.email
            if (!oldPassword) {
                return toast.warning("Please, provide old password", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
            if (!email) {
                return toast.warning("Please, login first", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
            const responce = await axios.get(`/api/userchangepassword?email=${email}&password=${oldPassword}`)
            if (responce?.data?.success) {
                console.log(responce?.data)
                setNewPassToggle(!newPasswordToggle)
            } else {
                return toast.warning(`${responce?.data?.message}`, {
                    position: "top-center",
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
            return toast.error(`${error.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const updatePassword = async () => {
        if (!newPassword) {
            return toast.warning("Please, provide new password", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
        if (!oldPassword) {
            setNewPassToggle(!newPasswordToggle)
        }
        if (!userData._id) {
            return toast.warning("Please, login first", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
        try {
            const config = {
                headers: {
                    'content-type': 'application/json'
                }
            }

            const userInfo = {
                email: userData.email,
                id: userData._id,
                Password: newPassword
            }
            const response = await axios.put('/api/userchangepassword', { config, userInfo })
            console.log(response)

            if (response) {
                setOldPassword('')
                setNewPassword('')
                setNewPassToggle(!newPasswordToggle)
                return toast.success("Password updated successfully.", {
                    position: "top-center",
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
            return toast.error(error.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }

    }
    return <>
        <main>
            <h1 className='font-sans font-bold text-2xl mb-4' style={{ letterSpacing: '2px' }}>Change Password</h1>
            <div className='flex flex-col gap-4'>
                <div className='flex gap-2'>
                    <input type="password" placeholder='enter old password' className='focus:outline-none outline-none border border-green-500 p-2 rounded-sm w-[300px]' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    {
                        newPasswordToggle ?
                            <button className='bg-green-600 w-[150px] hover:bg-green-700 duration-200 text-white px-4 text-sm rounded' onClick={updatePassword}>Save Password</button>
                            :
                            <button className='bg-green-600 w-[150px] hover:bg-green-700 duration-200 text-white px-4 text-sm rounded' onClick={verifyPassword}>Verify Password</button>
                    }
                </div>
                {
                    newPasswordToggle ?
                        <input type="password" placeholder='enter new password' className='focus:outline-none outline-none border border-green-500 p-2 rounded-sm w-[300px]' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        : ""
                }
            </div>
            <ToastContainer pauseOnFocusLoss={false} />
        </main>
    </>
}
