'use client'
import { usePaginatedProduct } from '@/hooks/reactProductsKook/useAllProducts'
import React, { useState, useEffect } from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Tooltip from '@mui/material/Tooltip'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ShowAllProducts() {
    const [page, setPageNumber] = useState(1)
    const [searchQuery, setSearchQuery] = useState('');
    const category = 'all'
    const limit = 5;
    const navigate = useRouter('');
    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-data'))
        if (!isLoggedIn) {
            return navigate.replace('/components/signin')
        }
        if (isLoggedIn && !isLoggedIn.isAdmin) {
            return navigate.replace('/components/showAllProducts')
        }
    }, [navigate])

    const { data, isLoading, isError, error, refetch: refetchPaginated } = usePaginatedProduct(page, limit, category)

    const handleChange = (event, value) => {
        setPageNumber(value);
        refetchPaginated();
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredProducts = data?.data?.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }

    const deleteProductHandler = async (id) => {
        if (!id) {
            return toast.warning("No product id", {
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
            const response = await axios.delete(`/api/deleteproduct?productId=${id}`)
            console.log("product-deleted", response)
            const success = response?.data?.success
            if (!success) {
                return toast.warning(response?.data?.message, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                // Refetch products after successful deletion
                refetchPaginated();
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

    return (
        <>
            <main className='flex flex-col gap-5 cursor-default'>
                <div className='flex justify-between gap-2'>
                    <h1 className='font-semibold px-3 rounded py-1 font-sans text-xl' style={{ letterSpacing: '3px' }}>{category === "" || category === "select category" || category === "all" ? 'All Products' : category}</h1>
                    <input
                        type="text"
                        placeholder='Search Product'
                        className='p-2 border border-none outline-orange-600 rounded w-[400px]'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div>
                    <TableContainer component={Paper} className='cursor-pointer'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead >
                                <TableRow className='bg-green-200'>
                                    <TableCell align='center'><p className='font-bold'>Product</p></TableCell>
                                    <TableCell align="center"><p className='font-bold'>Name</p></TableCell>
                                    <TableCell align="center"><p className='font-bold'>Description</p></TableCell>
                                    <TableCell align="center"><p className='font-bold'>Seller</p></TableCell>
                                    <TableCell align="center"><p className='font-bold'>Stock</p></TableCell>
                                    <TableCell align="center"><p className='font-bold'>Ratings</p></TableCell>
                                    <TableCell align="center"><p className='font-bold'>Price</p></TableCell>
                                    <TableCell align="center"><p className='font-bold'>Update</p></TableCell>
                                    <TableCell align="center"><p className='font-bold'>Delete</p></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts && filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <TableRow
                                            key={product._id} // Added key prop here
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Image
                                                    className='bg-cover bg-no-repeat bg-center'
                                                    src={product?.images[0] ? product.images[0].url : '/path/to/default/image.jpg'}
                                                    alt={product.name}
                                                    width={50}
                                                    height={50}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip
                                                    title={product.name}
                                                    followCursor
                                                >
                                                    <span>{product.name.substring(0, 30)}...</span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center">{product.description.substring(0, 50)}...</TableCell>
                                            <TableCell align="center">{product.seller}</TableCell>
                                            <TableCell align="center">{product.stock}</TableCell>
                                            <TableCell align="center">{product.ratings}</TableCell>
                                            <TableCell align="center">{product.price}</TableCell>
                                            <TableCell align="center">
                                                <button className='flex justify-center items-center gap-1 bg-green-600 hover:bg-green-700 duration-100 text-white rounded py-1 pr-3 pl-1'
                                                    onClick={() => navigate.push(`/components/adminPanel/adminShowAllProducts/${product._id}`)}
                                                >
                                                    <ModeEditOutlineOutlinedIcon />Update
                                                </button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <button
                                                    className='flex justify-center items-center gap-1 bg-red-600 hover:bg-red-700 duration-100 text-white rounded py-1 pr-3 pl-1'
                                                    onClick={() => deleteProductHandler(product._id)}
                                                >
                                                    <DeleteForeverRoundedIcon />Delete
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">No items found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='flex justify-center py-6 gap-2'>
                    {data?.totalPages > 0 && (
                        <Stack spacing={2}>
                            <Pagination count={data.totalPages} color="primary" page={page} onChange={handleChange} />
                        </Stack>
                    )}
                </div>
                <ToastContainer pauseOnFocusLoss={false} />
            </main >
        </>
    )
}
