"use client"
import { Radio } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import altImage from '@/images/imageIcon.jpg'
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

export default function Page() {
    const [addArea, setAddressArea] = useState(false);
    const [address, setAddress] = useState({});
    const [userDetails, setUserDetails] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useRouter();
    const [street, setStreet] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [newAddress, setNewAddress] = useState('')
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

    const [progress, setProgress] = useState(0);
    const [progressToggle, setProgressToggle] = useState(false);

    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-data'))
        if (!isLoggedIn) {
            return navigate.replace('/components/signin')
        }
    }, [navigate])

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        let cartData = localStorage.getItem('cart');
        if (cartData) {
            try {
                cartData = JSON.parse(cartData);
                console.log("Parsed cart data:", cartData.cartItems); // Logging cart data
                setCartItems(cartData.cartItems);
            } catch (error) {
                console.error("Error parsing cart data:", error.message);
            }
        }
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem('user-data');
        if (userData) {
            try {
                const parsedUserData = JSON.parse(userData);
                setUserDetails([parsedUserData]);
            } catch (error) {
                console.error("Error parsing user data:", error.message);
            }
        }
    }, []);

    const amountWithoutTax = cartItems?.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    useEffect(() => {
        if (selectedAddressIndex !== null) {
            setAddress(userDetails[selectedAddressIndex])
            console.log("selected address", userDetails[selectedAddressIndex])
        }
        else {
            console.log("No address selected")
        }
    }, [selectedAddressIndex, userDetails])

    const taxAmount = (amountWithoutTax * 0.15).toFixed(2);

    const totalAmount = (Number(amountWithoutTax) + Number(taxAmount)).toFixed(2);

    const addNewAddress = () => {
        if (!street || !phone || !city || !country || !newAddress) {
            return toast.warning(`Please fill the form`, {
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

        const newAddressDetails = {
            street,
            phone,
            city,
            country,
            address: newAddress,
            _id: userDetails[0]._id,
            email: userDetails[0].email
        }

        setUserDetails([...userDetails, newAddressDetails])
        setStreet('')
        setPhone('')
        setCity('')
        setCountry('')
        setNewAddress('')
        setAddressArea(false)
    }

    const handleCheckout = async () => {
        setProgressToggle(true)
        console.log("Address", address)
        console.log("cart-items", cartItems)
        if (!address || Object.keys(address).length === 0) {
            setProgressToggle(false)
            return toast.warning(`Please select the existing address or add new`, {
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
        if (!userDetails.length || !userDetails[0]._id) {
            setProgressToggle(false)
            return navigate.push('/components/signin')
        }
        if (cartItems.length === 0) {
            setProgressToggle(false)
            return toast.warning(`No cart items found, Please add items to cart.`, {
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
            const { data } = await axios.post('/api/orders', {
                items: cartItems,
                shippingInfo: address?.address,
                email: address?.email,
                cardHolderId: address?._id,
            });

            if (data?.success) {
                setProgressToggle(false)
                console.log("data =>", data)
                window.location.href = data.url;
            } else {
                setProgressToggle(false)
                console.log("Something Went Wrong: ", data.error || "Unknown error");
            }

        } catch (error) {
            setProgressToggle(false)
            console.error("Checkout Error: ", error);
            toast.error(error.message, {
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
    };

    return (
        <>
            <main className='flex justify-center gap-2 pt-[5dvh]'>
                <div className='w-[40%] box-border'>
                    <div className='border p-2 flex flex-col gap-3 px-4 cursor-default rounded-lg bg-gray-50 mb-4'>
                        <h2 className='font-bold'>Shipping Information</h2>
                        <div className='flex gap-2'>
                            {
                                userDetails.length > 0 ?
                                    userDetails?.map((details, index) => (
                                        <div className='rounded border-none w-[50%] bg-white border py-3' key={index}>
                                            <div className='flex gap-1 items-center'>
                                                <Radio color='success'
                                                    checked={selectedAddressIndex === index}
                                                    onChange={() => setSelectedAddressIndex(index)}
                                                />
                                                <p className='font-semibold text-sm'>Street - {details.street}</p>
                                            </div>
                                            <p className='text-xs mx-12 font-semibold'>{details.address}</p>
                                            <p className='text-xs mx-12 font-semibold'>{details.city}</p>
                                            <p className='text-xs mx-12'>{details.country}</p>
                                            <p className='text-xs mx-12'>{details.phone}</p>
                                        </div>
                                    ))
                                    : ""
                            }
                        </div>
                        <div className='flex items-center cursor-pointer justify-center gap-1 border border-green-600 rounded-lg w-[25%] p-1 hover:bg-green-50 duration-200'
                            onClick={() => setAddressArea(!addArea)}
                        >
                            <AddIcon className='text-green-700 w-5 h-5' />
                            <p className='text-xs text-green-700 font-bold'>Add new address</p>
                        </div>
                        {addArea && (
                            <div className='flex flex-col gap-2'>
                                <div className='flex gap-2'>
                                    <input type="text" placeholder='Street/House #' className='w-[50%] border p-2 rounded' value={street} onChange={(e) => setStreet(e.target.value)} />
                                    <input type="text" placeholder='Phone' className='w-[50%] border p-2 rounded' value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className='flex gap-2'>
                                    <input type="text" placeholder='City' className='w-[50%] border p-2 rounded' value={city} onChange={(e) => setCity(e.target.value)} />
                                    <input type="text" placeholder='country' className='w-[50%] border p-2 rounded' value={country} onChange={(e) => setCountry(e.target.value)} />
                                </div>
                                <textarea placeholder='address' className='h-[100px] p-2 rounded focus:outline-green-700 resize-none' value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                                <div className='flex justify-center mt-3'>
                                    <button
                                        className='bg-gray-200 py-2 rounded-lg hover:bg-green-500 duration-1000 hover:text-white w-[300px]'
                                        onClick={addNewAddress}
                                    ><AddIcon className='bg-green-500 text-white rounded-full' /> add address</button>
                                </div>
                            </div>
                        )}
                        <div className='flex gap-1 mt-5 justify-end p-2'>
                            {
                                progressToggle ?
                                    <CircularProgress variant="determinate" value={progress} color='success' />
                                    : ""
                            }
                            <button className='border px-3 py-1 text-sm rounded bg-white' onClick={() => navigate.push('/components/cartList')}>Back</button>
                            <button className='bg-green-600 border px-3 text-white py-1 rounded text-sm' onClick={handleCheckout}>Checkout</button>
                        </div>
                    </div>
                </div>

                {/* ----------------------- Right Div ------------------------------------ */}
                <div className='w-[30%] p-2'>
                    <h2 className='font-bold'>Summary</h2>
                    <div className='flex justify-between'>
                        <p>Amount:</p>
                        <p>$ {amountWithoutTax}/-</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Est TAX:</p>
                        <p>$ {taxAmount}</p>
                    </div>
                    <hr className='my-2' />
                    <div className='flex justify-between'>
                        <p>Total:</p>
                        <p className='font-bold'>${totalAmount}/-</p>
                    </div>
                    <hr className='my-2' />

                    <h2 className='font-semibold mb-3 mt-4'>Items in cart <span className='px-2 py-1 bg-gray-200 border-none rounded'>{cartItems.length}</span></h2>
                    <div className='flex flex-col gap-2'>
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <div className='relative flex gap-2 py-1 border-b-2 mb-3 pb-2 cursor-default hover:bg-gray-100 duration-500 rounded' key={index}>
                                    <Image
                                        className={'w-[60px] h-[60px] border mt-1'}
                                        src={item ? item.image : altImage}
                                        alt='product.img'
                                        width={60}
                                        height={60}
                                    />
                                    <p className='text-xs bg-orange-400 px-2 py-1 rounded-full text-white absolute top-0 left-12'>{item.quantity}</p>
                                    <div className='flex flex-col gap-1 justify-center'>
                                        <p className='text-sm'>{item.name}</p>
                                        <div className='flex gap-2 '>
                                            <p className='w-[100px] text-xs text-gray-400'>Price: {item.price}/-</p>
                                        </div>
                                        {
                                            item.quantity > 1 ?
                                                <p p className='w-[100px] text-xs text-gray-400'>Total: {item.price * item.quantity}/-</p>
                                                :
                                                ""
                                        }
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items in cart</p>
                        )}
                    </div>
                </div>
                <ToastContainer pauseOnFocusLoss={false} />
            </main >
        </>
    );
}
