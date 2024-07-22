"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductCard({ product }) {
    const navigate = useRouter();
    return <>
        <main className='flex justify-center gap-[5dvw] py-10'>
            <div className='flex flex-col'>
                <div
                    key={product[0].id}
                    className='flex flex-col items-center border border-gray-200 p-3 rounded-lg bg-white shadow-lg hover:shadow-xl duration-200 h-[370px]'
                    onClick={() => navigate.push(`/components/allProductsList/${product[0]._id}`)}
                >
                    <Image
                        src={product[0].images[1].url}
                        width={250}
                        height={300}
                        className={' w-[250px] h-[300px]'}
                        alt={`Image of ${product[0].name}`} // Added alt attribute
                    />
                    <p className='font-semibold text-blue-950 border-b-2 border-b-blue-950'>{product[0].name.substring(0, 25)}..</p>
                </div>

                <div
                    key={product[2].id}
                    className='flex flex-col items-center border mt-[25dvh] border-gray-200 p-3 rounded-lg bg-white shadow-lg hover:shadow-xl duration-200 w-[300px] h-[370px]'
                    onClick={() => navigate.push(`/components/allProductsList/${product[2]._id}`)}
                >
                    <Image
                        src={product[2].images[0].url}
                        width={250}
                        height={300}
                        className={' w-[250px] h-[300px]'}
                        alt={`Image of ${product[2].name}`} // Added alt attribute
                    />
                    <p className='font-semibold text-blue-950 border-b-2 border-b-blue-950'>{product[2].name.substring(0, 25)}..</p>
                </div>
            </div>
            <div>
                <h2 className='font-bold text-3xl'>Our Products</h2>
                <p className='w-[400px]'>Discover premium quality and unbeatable prices on fashion, electronics, home essentials, beauty, and more. Handpicked for you, our products blend style, functionality, and value</p>
                <p className='text-blue-400 mt-6 cursor-pointer' onClick={() => navigate.push(`/components/showAllProducts`)}>View All Products {'->'}</p>

                <div
                    key={product[1].id}
                    className='flex flex-col items-center border mt-10 border-gray-200 p-3 rounded-lg bg-white shadow-lg hover:shadow-xl duration-200 w-[300px] h-[370px]'
                    onClick={() => navigate.push(`/components/allProductsList/${product[1]._id}`)}
                >
                    <Image
                        src={product[1].images[0].url}
                        width={250}
                        height={300}
                        className={' w-[250px] h-[300px]'}
                        alt={`Image of ${product[1].name}`} // Added alt attribute
                    />
                    <p className='font-semibold text-blue-950 border-b-2 border-b-blue-950'>{product[1].name.substring(0, 25)}..</p>
                </div>
            </div>
        </main>
    </>
}
