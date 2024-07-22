'use client'
import React, { useEffect, useState } from 'react';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminProfile = () => {
    const [userInfo, setUserInfo] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

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

    useEffect(() => {
        const userData = localStorage.getItem('user-data');
        if (userData) {
            try {
                const parsedUserData = JSON.parse(userData);
                setUserInfo(parsedUserData);
                setName(parsedUserData.name);
                setEmail(parsedUserData.email);
                setPhone(parsedUserData.phone);
            } catch (error) {
                console.error('Error parsing user data:', error.message);
            }
        }
    }, []);

    const handleAdminUpdate = async () => {
        if (!name || !email || !phone || !password || !confirmPassword) {
            return toast.warning('Please, provide full credentials', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        }
        if (password !== confirmPassword) {
            return toast.warning("Password and Confirm Password don't match.", {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const updatedInfo = {
                name,
                email,
                phone,
                password,
            };
            const response = await axios.post(`/api/updateAdmin`, updatedInfo, config);
            if (response?.data?.state?.acknowledged) {
                toast.success(`${response?.data?.message}`, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                });
                setPassword('');
                setConfirmPassword('');
                setExpanded(false); // Close the accordion on successful update
            } else {
                toast.error(`${response?.data?.message}`, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                });
            }
        } catch (error) {
            toast.error(`${error.message}`, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        }
    };

    return (
        <main className="w-[60dvw]">
            <div className="bg-white w-[100%] p-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-1 mb-7">
                    <AdminPanelSettingsRoundedIcon style={{ width: '70px', height: '50px' }} />
                    <p className="text-green-700 font-semibold text-xl">Admin Card</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-5 px-[5dvw]">
                    <div className="flex flex-col gap-1">
                        <p className="text-green-800">Admin Name</p>
                        <p>{userInfo.name}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-green-800">Email</p>
                        <p>{userInfo.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-green-800">Phone number</p>
                        <p>{userInfo.phone}</p>
                    </div>
                </div>
                <div className="px-[4dvw] mt-4 mb-6">
                    <Accordion
                        expanded={expanded}
                        onChange={() => setExpanded(!expanded)}
                        sx={{
                            boxShadow: 'none',
                            '&:before': {
                                display: 'none',
                            },
                            '& .MuiAccordion-root': {
                                border: 'none',
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className="text-orange-400" />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <p className="bg-orange-300 px-4 py-1 text-white rounded-lg">Update Admin Info</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <TextField
                                    id="outlined-basic"
                                    label="Name"
                                    variant="outlined"
                                    color="success"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="Phone Number"
                                    variant="outlined"
                                    color="success"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <TextField
                                    disabled
                                    type="email"
                                    id="outlined-basic"
                                    label="Email"
                                    variant="outlined"
                                    color="success"
                                    value={email}
                                />
                                <FormControl variant="outlined" color="success">
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
                                                    {showPassword ? <VisibilityOff className="text-green-600" /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </div>
                            <FormControl className="w-[49.5%]" variant="outlined" color="success">
                                <InputLabel className="bg-white" htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
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
                                                {showPassword ? <VisibilityOff className="text-green-600" /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                            <button
                                className="w-[100%] mt-4 p-3 font-bold text-white rounded-lg bg-green-700 hover:bg-green-800 duration-200"
                                onClick={handleAdminUpdate}
                            >
                                Update Changes
                            </button>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
            <ToastContainer pauseOnFocusLoss={false} />
        </main>
    );
};

export default AdminProfile;
