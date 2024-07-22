'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Image from 'next/image'; // Import the Image component

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function UserAllOrders() {
    const [allOrders, setAllOrders] = useState([]);
    const [userid, setUserId] = useState([]);

    const getOrders = async (userId) => {
        try {
            const response = await axios.get(`/api/getUserOrders?user=${userId}`);
            if (response?.data?.success) {
                setAllOrders(response?.data?.Orders);
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
    };

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('user-data'));
        if (!userDetails) {
            return toast.warning("Please, Login first", {
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
        const userId = userDetails._id;
        getOrders(userId);
        setUserId(userId)
    }, []);

    const cancelOrderHandler = async (id) => {
        if (!id) {
            return toast.warning(`No Order ID`, {
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

            const response = await axios.put('/api/cancelproduct', { order: id }, config)
            if (!response) {
                return toast.warning('Something, went wrong please try again.', {
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
            else {
                toast.success(`Order # ${id} canceled successfully`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                getOrders(userid);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(',', '');
    };

    return (
        <>
            <main>
                <div className='cursor-default'>
                    <h2 className='mb-3 font-semibold text-xl'>Order List</h2>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Product</StyledTableCell>
                                    <StyledTableCell align="center">Name</StyledTableCell>
                                    <StyledTableCell align="center">Quantity</StyledTableCell>
                                    <StyledTableCell align="center">Price</StyledTableCell>
                                    <StyledTableCell align="center">Amount Paid</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                    <StyledTableCell align="center">Ordered at</StyledTableCell>
                                    <StyledTableCell align="center">Order Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allOrders.length > 0 ? allOrders.map((order) => (
                                    order.orderItems.length > 0 ?
                                        order.orderItems.map((item) => (
                                            <StyledTableRow key={item._id}>
                                                <StyledTableCell component="th" scope="row">
                                                    <Image src={item.image} alt={item.name} width={50} height={50} className='bg-cover bg-no-repeat bg-center' />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{item.name}</StyledTableCell>
                                                <StyledTableCell align="center">{item.quantity}</StyledTableCell>
                                                <StyledTableCell align="center">{item.price}</StyledTableCell>
                                                <StyledTableCell align="center">{order.amountPaid}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {
                                                        order.orderStatus === 'Shipping' ? (
                                                            <span className='bg-blue-400 text-white py-1 px-3 rounded-full '>{order.orderStatus}</span>
                                                        ) : order.orderStatus === 'Completed' ? (
                                                            <span className='bg-green-400 text-white py-1 px-3 rounded-full '>{order.orderStatus}</span>
                                                        ) : order.orderStatus === 'Processing' ? (
                                                            <span className='bg-orange-400 text-white py-1 px-3 rounded-full'>{order.orderStatus}</span>
                                                        ) : order.orderStatus === 'Canceled' ? (
                                                            <span className='bg-red-500 text-white py-1 px-3 rounded-full'>{order.orderStatus}</span>
                                                        ) : null
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{formatDate(order.createdAt)}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {
                                                        order.orderStatus === 'Shipping' ? (
                                                            <span className='text-blue-400 '>Order Shipping</span>
                                                        ) : order.orderStatus === 'Completed' ? (
                                                            <span className='text-green-400'>Order Completed</span>
                                                        ) : order.orderStatus === 'Processing' ? (
                                                            <span className='p-3 bg-orange-400 rounded text-white cursor-pointer hover:bg-orange-500 duration-100' onClick={() => cancelOrderHandler(order._id)}>Cancel</span>
                                                        ) : order.orderStatus === 'Canceled' ? (
                                                            <span className='p-3 text-red-500' onClick={() => cancelOrderHandler(order._id)}>Canceled Order</span>
                                                        ) : null
                                                    }
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                        :
                                        <StyledTableRow key="no-orders">
                                            <StyledTableCell colSpan={8} align="center">No Orders found.</StyledTableCell>
                                        </StyledTableRow>
                                )) : (
                                    <StyledTableRow key="no-orders">
                                        <StyledTableCell colSpan={8} align="center">No Orders found.</StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <ToastContainer pauseOnFocusLoss={false} />
            </main>
        </>
    );
}
