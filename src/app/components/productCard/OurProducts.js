"use client"
import React from 'react'
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import CartContext from "../context/CartContext"

export default function OurProductCard({ product }) {
    const navigate = useRouter();
    const { addItemsToCart } = useContext(CartContext)

    const addToCartHandler = (event) => {
        event.stopPropagation();
        addItemsToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0].url,
            stock: product.stock,
            seller: product.seller,
        })
    };

    return (
        <div
            key={product.id}
            className='bg-white border-none mt-[30px] flex flex-col lg:w-[250px] justify-center box-border border-gray-200 shadow-md py-3 rounded hover:bg-gray-100 duration-300'
            onClick={() => navigate.push(`/components/allProductsList/${product._id}`)}
        >
            <div className='flex justify-center box-border'>
                <Image
                    className='lg:w-[95%] lg:h-[200px] bg-cover bg-no-repeat bg-center'
                    src={product?.images[0] ? product.images[0].url : prodImage}
                    alt={product.name}
                    width={100}
                    height={220}
                />
            </div>
            <div className='px-[4px]'>
                <h1 className='font-bold text-green-800'>{product.name.substring(0, 20)}...</h1>
                <div className='flex'>
                    <Box className='mt-1'>
                        <Rating name="read-only" value={product.ratings} readOnly size="small" />
                    </Box>
                    {product.ratings !== 0 && (
                        <p className='text-white bg-orange-400 text-sm p-0 flex items-center px-2 rounded text-[10px] ml-1'>{product.ratings}</p>
                    )}
                </div>
                {product.stock > 0 ? (
                    <p>In stock : {product.stock}</p>
                ) : (
                    <p>Out of stock</p>
                )}
            </div>
            <div className='w-[100%] px-1 relative z-10'>
                <p className='font-bold'>{product.price} /-</p>
                <button
                    className='absolute right-3 bottom-0 text-green-600 p-1 border-none rounded-full'
                    onClick={addToCartHandler}
                    disabled={product.stock <= 0}
                >
                    <AddShoppingCartIcon />
                </button>
            </div>
        </div>
    );
}
