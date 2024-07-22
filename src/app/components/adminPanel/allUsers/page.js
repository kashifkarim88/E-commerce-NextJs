'use client'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';

const fetchPaginatedColors = (pageNumber) => {
    return axios.get(`/api/getAllUsers?page=${pageNumber}&limit=10`)
}

export default function AllUsers() {
    const [pageNumber, setPageNumber] = useState(1)
    const navigate = useRouter()

    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-data'))
        if (!isLoggedIn) {
            return navigate.replace('/components/signin')
        }
        if (isLoggedIn && !isLoggedIn.isAdmin) {
            return navigate.replace('/components/showAllProducts')
        }
    }, [navigate])

    const { isLoading, isError, error, data, isFetching, refetch: refetchPaginated } = useQuery(['all-users', pageNumber],
        () => fetchPaginatedColors(pageNumber),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            //refetchInterval: 1000
        })

    if (isLoading) {
        return (
            <div className='w-[50dvw] h-[50dvh] flex flex-col justify-center items-center'>
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }

    if (!data.data) {
        return <h2>No data found</h2>
    }

    const handleChange = (event, value) => {
        setPageNumber(value);
        refetchPaginated();
    };

    return (
        <div>
            <p className='bg-green-600 text-white text-bold p-3 mb-5'>Total Users-{data?.data?.totalUsers}</p>
            <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-6 cursor-default'>
                {
                    data?.data?.allUsers.map((user) => (
                        <div
                            key={user._id} // Add a unique key here
                            className='border border-gray-100 p-2 w-[400px] rounded shadow-lg relative hover:bg-gray-50'
                        >
                            <p className='font-semibold'>{user.name}</p>
                            <p className='text-gray-500'>{user.email}</p>
                            <p className='text-gray-500'>{user.phone}</p>
                            <div className=' flex justify-end absolute top-1 right-1'>
                                <Tooltip title="Delete User" placement="left-start">
                                    <IconButton>
                                        <FolderDeleteIcon className='text-gray-500 hover:text-red-700 duration-100 ' />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='flex justify-center items-center mt-2 p-3'>
                {
                    data?.data?.totalPages > 1 ? (
                        <Stack spacing={2}>
                            <Pagination count={data?.data?.totalPages} color="primary" page={pageNumber} onChange={handleChange} />
                        </Stack>
                    ) : ""
                }
            </div>
        </div>
    )
}
