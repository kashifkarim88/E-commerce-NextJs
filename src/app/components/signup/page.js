'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useRouter();
    const [addressToggle, setAddressToggle] = useState(false)
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async () => {

        if (!name || !email || !phone || !password || !confirmPassword || !address || !city || !country) {
            return toast.error(`Please, fill the form first ${address}`, {
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

        if (password !== confirmPassword) {
            return toast.error("Password and Confirm Password didn't match", {
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

        const userInfo = {
            name,
            email,
            phone,
            address,
            password,
            street,
            city,
            country
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            const response = await axios.post('/api/signup', userInfo, config);

            if (!response.data.success) {
                return toast.error(`${response.data.message}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                setName("")
                setEmail("")
                setPhone("")
                setPassword("")
                setConfirmPassword("")
                navigate.replace('/components/signin')
            }


        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    const router = useRouter();
    return (
        <main className='flex flex-col items-center h-[90dvh] box-border'>
            <div className='w-[45%] border flex flex-col gap-4 p-3 rounded shadow-lg bg-white border-gray-100 mt-[3dvh]'>
                <h1 className='font-bold text-xl'>Register</h1>
                <div className='grid grid-cols-2 gap-2'>
                    <TextField label="Name" variant="outlined" color="success" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Email" type='email' variant="outlined" color="success" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Phone" variant="outlined" color="success" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <FormControl variant="outlined" color='success'>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff className='text-green-700' /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <FormControl variant="outlined" color='success'>
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff className='text-green-700' /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm Password"
                        />
                    </FormControl>
                </div>
                <button className='text-left border-green-800 border-none outline-none w-[130px] text-green-800 rounded-full' onClick={() => setAddressToggle(!addressToggle)}><AddIcon className='bg-green-800 rounded-full text-white' /> Add address</button>
                {
                    addressToggle ?
                        (
                            <div className='flex flex-col gap-1'>
                                <input type="text" placeholder='Street #' className='w-[50%] border p-2 rounded' value={street} onChange={(e) => setStreet(e.target.value)} />
                                <input type="text" placeholder='City' className='w-[50%] border p-2 rounded' value={city} onChange={(e) => setCity(e.target.value)} />
                                <input type="text" placeholder='country' className='w-[50%] border p-2 rounded' value={country} onChange={(e) => setCountry(e.target.value)} />
                                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder='address' className='w-[50%] h-[150px] p-2 rounded focus:outline-green-700 resize-none bg-gray-50' />
                            </div>
                        )
                        : ""
                }

                <button
                    className='bg-green-600 text-white font-semibold p-2 rounded outline-none border-none cursor-pointer'
                    onClick={handleSubmit}
                >Register</button>
                <hr />
                <p className='text-center font-semibold cursor-pointer' onClick={() => router.replace('/components/signin')}>already have account? <span className='text-green-600 cursor-pointer'>Login</span></p>
            </div>
            <ToastContainer pauseOnFocusLoss={false} />
        </main>
    );
}
