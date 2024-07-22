"use client"
import { usePaginatedProduct, usePriceProduct } from '@/hooks/reactProductsKook/useAllProducts'
import React, { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ProductCard from '@/app/components/productCard/OurProducts'

export default function ShowAllProducts() {
    const [page, setPageNumber] = useState(1)
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [category, setCategory] = useState("all")
    const [searchClicked, setSearchClicked] = useState(false)
    const limit = 5;

    const { data, isLoading, isError, error, refetch: refetchPaginated } = usePaginatedProduct(page, limit, category)
    const { data: productsPricedData, refetch: refetchPriced } = usePriceProduct(page, limit, category, minPrice, maxPrice)

    const handleChange = (event, value) => {
        setPageNumber(value);
        if (searchClicked) {
            refetchPriced();
        } else {
            refetchPaginated();
        }
    };

    const handleSearch = () => {
        setSearchClicked(true);
        setPageNumber(1); // reset to first page when search is clicked
        refetchPriced();
    };

    useEffect(() => {
        if (minPrice === '' && maxPrice === '') {
            setSearchClicked(false);
            setPageNumber(1); // reset to first page when prices are cleared
            refetchPaginated();
            setCategory("")
        }
    }, [minPrice, maxPrice, refetchPaginated]);

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }

    const productsToShow = searchClicked ? productsPricedData?.data : data?.data;

    return (
        <>
            <main className='flex flex-col gap-5 '>
                <div className='flex gap-2 justify-between items-center py-6 px-[5dvw]'>
                    <div className='flex gap-2 pb-2'>
                        <input type="number"
                            placeholder='min price'
                            className='w-[90px] px-2 py-1 border outline-none rounded focus:border-green-800 hide-number-arrows'
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)} />
                        <input
                            type="number"
                            placeholder='max price'
                            className='w-[90px] px-2 py-1 border outline-none rounded focus:border-green-800 hide-number-arrows'
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)} />
                        <button className='bg-green-800 text-white px-4 py-1 rounded' onClick={handleSearch}>search</button>

                        <select
                            name="category-select"
                            className='outline-none border border-green-800 text-green-700 py-1 rounded'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="select category">select category</option>
                            <option value="all">All</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Cameras">Cameras</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Headphones">Headphones</option>
                            <option value="Sports">Sports</option>
                            <option value="Mobile">Mobile</option>
                        </select>
                    </div>
                </div>
                <h1 className='font-bold text-xl text-green-800 w-[200px] ml-[5dvw] px-3 py-1 rounded mt-8' style={{ letterSpacing: '4px' }}>{category === "" || category === "select category" || category === "all" ? 'All Products' : category}</h1>
                <div className='grid grid-cols-5 gap-5 px-[5dvw]'>
                    {
                        productsToShow?.length > 0 ? productsToShow.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        )) : (
                            searchClicked && <h2>No data found.</h2>
                        )
                    }
                </div>
                <div className='flex justify-center py-6 gap-2'>
                    {
                        searchClicked ? (
                            productsPricedData?.totalPages > 0 ? (
                                <Stack spacing={2}>
                                    <Pagination count={productsPricedData?.totalPages} color="primary" page={page} onChange={handleChange} />
                                </Stack>
                            ) : (
                                <div>
                                    <h2>No items found.</h2>
                                </div>
                            )
                        ) : (
                            data?.totalPages > 0 ? (
                                <Stack spacing={2}>
                                    <Pagination count={data?.totalPages} color="primary" page={page} onChange={handleChange} />
                                </Stack>
                            ) : (
                                <div>
                                    <h2>No items found.</h2>
                                </div>
                            )
                        )
                    }
                </div>
            </main>
        </>
    )
}