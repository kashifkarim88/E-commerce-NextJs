'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LatestProducts() {
    const [products, setProducts] = useState([])
    const [error, setError] = useState(null)
    const navigate = useRouter()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/latestproducts')
                setProducts(response.data)
            } catch (err) {
                setError(err)
                console.error('Error fetching the latest products:', err)
            }
        }

        fetchProducts()
    }, [])

    return (
        <main className='py-[6dvh] bg-gray-50 mb-0'>
            {products?.length > 0 ? (
                <div className='flex px-[5dvw] justify-center gap-[5dvw]'>
                    <div>
                        <h1 className='font-bold text-3xl'>Latest Products</h1>
                        <p className='w-[400px]'>Explore our latest arrivals in fashion, electronics, home essentials, and more. Stay ahead with trending products, innovative designs, and unbeatable prices. Shop now for the freshest finds.</p>
                        <p className='text-blue-400 mt-6 cursor-pointer' onClick={() => navigate.push(`/components/showAllProducts`)}>View All Products {'->'}</p>
                    </div>
                    <div className='flex gap-4'>
                        {products.map((product) => (
                            <div key={product._id} className={`grid ${product.length > 1 ? 'grid-cols-3' : 'grid-cols-1'} gap-`}>
                                <div className='border border-gray-100 bg-white rounded-lg p-2'
                                    onClick={() => navigate.push(`/components/allProductsList/${product._id}`)}
                                >
                                    <Image
                                        src={product.images[0].url}
                                        alt={product.name}
                                        width={200}
                                        height={250}
                                        className='w-[200px] h-[250px]'
                                    />
                                    <p className='font-semibold text-blue-950 border-b-2 border-b-blue-950'>{product.name.substring(0, 25)}..</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : ""}
        </main>
    )
}
