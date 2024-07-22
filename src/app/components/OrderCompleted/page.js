'use client'
import React, { Suspense, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Circles } from 'react-loader-spinner';
import { TypeAnimation } from 'react-type-animation';
import CartContext from '../context/CartContext';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Image from 'next/image';

function OrderCompletedContent() {
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const [stripeSessionData, setStripeSessionData] = useState({});
    const { userStatus, setUserStatus } = useContext(CartContext);
    const navigate = useRouter();
    const hasFetched = useRef(false); // Ref to track if data has been fetched

    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-data'));
        if (!isLoggedIn) {
            navigate.replace('/components/signin');
        }
    }, [navigate]);

    useEffect(() => {
        if (hasFetched.current) return; // Prevent fetching if already done

        const fetchSessionDetails = async () => {
            const userDetails = JSON.parse(localStorage.getItem('user-data'));
            const userId = userDetails?._id;

            if (session_id && userId) {
                try {
                    const response = await axios.get(`/api/checkout?session_id=${session_id}&userId=${userId}`);
                    if (response.data) {
                        setStripeSessionData(response.data);
                        localStorage.removeItem('cart');
                        setUserStatus(!userStatus);
                    }
                } catch (error) {
                    console.error("Error fetching session details:", error);
                }
            }
        };

        fetchSessionDetails();
        hasFetched.current = true; // Set the ref to true after fetching
    }, [session_id, userStatus, setUserStatus]);

    if (!stripeSessionData.success) {
        return (
            <div className='w-[100%] h-[70dvh] flex gap-2 flex-col justify-center items-center'>
                <Circles height="80" width="80" color="green" />
                <TypeAnimation
                    sequence={['Please Wait', 500, 'Loading...', 500]}
                    style={{ fontSize: '15px', color: "green" }}
                    repeat={Infinity}
                />
            </div>
        );
    }

    return (
        <main className='flex flex-col items-center justify-center'>
            <div className='pt-[100px]'>
                <p className='text-2xl font-bold text-green-600'>Order Placed</p>
                <p className='text-sm'>Thank you for shopping with us.</p>
                <p className='py-2 flex gap-2 items-center my-3 font-semibold'>
                    You Ordered
                    <span className='bg-green-600 text-white px-2 py-1 text-xs rounded-full'>
                        {stripeSessionData.orderedItems?.orderItems.length}
                    </span>
                    {stripeSessionData.items?.length === 1 ? "Item" : 'Items'}
                </p>
                <p className='text-sm mb-2'> Amount Paid: {stripeSessionData?.orderedItems?.amountPaid}</p>
                {
                    stripeSessionData?.orderedItems?.orderItems.map((item) => (
                        <div key={item.product} className='w-[400px] flex gap-3 items-center shadow-lg py-3 px-4 rounded-md bg-gray-50 mb-3'>
                            <Image className='w-[50px] h-[50px]' src={item.image} alt={item.name} width={50} height={50} />
                            <div className='w-[80%] flex flex-col gap-1'>
                                <p className='font-semibold text-xs'>{item.name.substring(0, 30)}...</p>
                                <div className='flex justify-between'>
                                    <span className='text-xs'>Quantity : {item.quantity}</span>
                                    <p className='text-green-600 px-2 font-semibold text-sm rounded-full'>Processing</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderCompletedContent />
        </Suspense>
    );
}
