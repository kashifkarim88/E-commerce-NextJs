"use client"
import Image from 'next/image'
import prodImage from '@/images/imageIcon.jpg'
import { useProductDetails } from '@/hooks/reactProductsKook/useAllProducts'
import StarRatings from 'react-star-ratings';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useContext } from 'react';
import CartContext from "../../context/CartContext"
import { useRouter } from 'next/navigation';

export default function ProductDetails({ params }) {
    const { addItemsToCart } = useContext(CartContext)
    const prodId = params.productId
    const navigate = useRouter();

    const onSuccess = (data) => {
        console.log("Perform Side effects after fetching the data", data)
    }
    const onError = (error) => {
        console.log("Perform Side effects after encountring an error", error)
    }

    const { isLoading, data, isError, isFetching, error } = useProductDetails(prodId, onSuccess, onError)

    const addToCartHandler = () => {
        addItemsToCart({
            product: data?.results._id,
            name: data?.results.name,
            price: data?.results.price,
            image: data?.results.images[0].url,
            stock: data?.results.stock,
            seller: data?.results.seller,
        })
    }

    if (isLoading || isFetching) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }
    return (
        <>
            <main >
                <div className='flex items-center bg-blue-100 p-3 px-[5dvw]'>
                    <p className='cursor-pointer' onClick={() => navigate.replace('/')}>Home</p>
                    <ArrowForwardIosIcon className='text-gray-500 h-4' />
                    <p className='text-gray-500'>{data?.results?.name.substring(0, 100)}...</p>
                </div>
                <div className='flex px-[2dvw] py-3 box-border'>
                    <div className='w-[40%] flex gap-3 flex-col items-center justify-center'>
                        <Image src={data?.results?.images[0].url ? data.results.images[0].url : prodImage} alt='productImage' className='border bg-cover content-center'
                            width={400}
                            height={400}
                        />
                        <div className='flex gap-3'>
                            {
                                data?.results?.images.length > 0 ? (data?.results.images?.map((image, index) => (
                                    <div key={index} className='border-none box-border rounded overflow-hidden'>
                                        <Image src={image.url} alt='productImage' className='bg-cover content-center hover:scale-110 duration-1000'
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                ))) : ""
                            }
                        </div>
                    </div>

                    <div className='w-[50%]'>
                        <h1 className='text-xl font-bold'>{data?.results.name}</h1>
                        <div className='flex items-center gap-2'>
                            <StarRatings
                                rating={data?.results.ratings}
                                starRatedColor="orange"
                                // changeRating={(newRating) => changeRating(setRating(newRating))}
                                numberOfStars={5}
                                name={data?.results.name}
                                starDimension="14px" // Reduce the size of the stars
                                starSpacing="2px"
                            />
                            <p className='text-orange-400'>{data?.results.ratings}</p>
                            <span className='border rounded-full w-1 h-1 bg-gray-400'></span>
                            <p className='text-green-400 font-semibold'>Verified</p>
                        </div>
                        <p className='font-bold'>Rs - {data?.results.price}</p>

                        <p className='w-[80%] mt-5'>{data?.results.description}</p>
                        <button
                            className='bg-blue-700 text-white hover:bg-blue-800 px-3 py-1 border-none rounded mt-4'
                            onClick={addToCartHandler}
                            disabled={data?.results.stock <= 0}
                        >Add to Cart</button>
                        <table className='mt-5'>
                            <tr>
                                <td className='w-[150px] font-bold'>Stock</td>
                                <td>{data?.results.stock >= 1 ? <span className='text-green-400 font-bold'>Available</span> : <span className='text-red-400 ml-3'>out of stock</span>}</td>
                            </tr>
                            <tr>
                                <td className='w-[150px] font-bold'>Category</td>
                                <td>{data?.results.category}</td>
                            </tr>
                            <tr>
                                <td className='w-[150px] font-bold'>Seller / Brand</td>
                                <td>{data?.results.seller}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div className='mx-5 border border-t-gray-400 border-l-white border-r-white border-b-white py-5 my-10 box-border'>
                    <h1 className='font-bold text-xl text-gray-500'>Other Customers Reviews</h1>
                </div>
            </main>
        </>
    )
}
