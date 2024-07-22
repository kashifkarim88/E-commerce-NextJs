'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import '@/app/css/styles.css';
import productImages from '@/images/imageIcon.jpg';
import { Navigation } from 'swiper/modules';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { storage } from '@/app/firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useProductDetails } from '@/hooks/reactProductsKook/useAllProducts'
import axios from 'axios';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useRouter } from 'next/navigation';

export default function UpdateProduct({ params }) {
    const [selectedImages, setSelectedImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [images, setImages] = useState([]); // New state for storing image URLs
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [seller, setSeller] = useState('');
    const [stock, setStock] = useState(0);
    const [progressBarToggle, setProgressBarToggle] = useState(false);
    const prodId = params.id

    const navigate = useRouter('')
    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-data'))
        if (!isLoggedIn) {
            return navigate.replace('/components/signin')
        }
        if (isLoggedIn && !isLoggedIn.isAdmin) {
            return navigate.replace('/components/showAllProducts')
        }
    }, [navigate])

    const onSuccess = (data) => {
        console.log("Perform Side effects after fetching the data", data)
    }
    const onError = (error) => {
        console.log("Perform Side effects after encountring an error", error)
    }
    const { isLoading, data, isError, isFetching, error } = useProductDetails(prodId, onSuccess, onError)


    useEffect(() => {
        if (data?.results) {
            const prodData = data.results;
            setName(prodData.name);
            setDescription(prodData.description);
            setPrice(prodData.price);
            setSeller(prodData.seller);
            setStock(prodData.stock);
            setCategory(prodData.category);
            setOldImages(prodData?.images?.map((image) => ({ url: image.url, public_id: image.public_id })) || []); // Set the image URLs as objects
        }
    }, [data]);

    console.log("old Images", oldImages)

    if (isLoading || isFetching) {
        return <h2>Loading...</h2>
    }

    if (isError) {
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

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    const handleImageChange = (event) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files).map((file) => ({
                url: URL.createObjectURL(file),
                file: file,
            }));
            setSelectedImages((prevImages) => prevImages.concat(filesArray));
        }
    };

    const handleRemoveImage = (index) => {
        setSelectedImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            URL.revokeObjectURL(prevImages[index].url);
            return updatedImages;
        });
    };

    const handleProductUpload = async () => {
        if (!name || !description || !category || !seller) {
            return toast.warning('Please, fill the form first', {
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
        if (price === 0) {
            return toast.warning('Product price cannot be 0. Please, provide a valid product price.', {
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
        if (stock === 0) {
            return toast.warning('Stock cannot be 0. Please, provide a valid Stock count that is available.', {
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
        if (selectedImages.length > 0 || oldImages.length > 0) {
            setProgressBarToggle(true);
            try {
                const uploadPromises = selectedImages.map(async (image) => {
                    const imageRef = ref(storage, `productimages/${image.file.name}`);
                    await uploadBytes(imageRef, image.file);
                    const url = await getDownloadURL(imageRef);
                    return url;
                });

                const imageUrls = await Promise.all(uploadPromises);
                if (imageUrls) {
                    setImages(imageUrls); // Store image URLs in state
                    const uploadedData = await addNewProductDB(imageUrls); // Pass image URLs to the function and await its completion
                    if (uploadedData?.data?.success) {
                        setProgressBarToggle(false);
                        setName("");
                        setPrice("");
                        setCategory("");
                        setDescription("");
                        setImages([]);
                        setSelectedImages([]);
                        setSeller("");
                        setStock("");
                        setOldImages([])
                        toast.success(`Product ${name} added successfully`, {
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
                        setProgressBarToggle(false);
                        toast.error(`Failed to add product: ${uploadedData?.data?.error}`, {
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
            } catch (error) {
                toast.error("Error uploading images. Please try again.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setProgressBarToggle(false);
            }
        } else {
            return toast.warning(`Please, provide the images for the product ${name}`, {
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


    const addNewProductDB = async (imageUrls) => {
        try {
            // Map imageUrls to match updated Mongoose schema format
            const formattedImages = imageUrls.map(url => {
                // Extract the token from the URL
                const token = url.split('token=')[1];
                return {
                    url,
                    public_id: token // Store token as public_id
                };
            });

            const productInfo = {
                _id: prodId,
                name,
                price: price,
                description,
                category,
                seller,
                stock: parseInt(stock),
                images: [...oldImages, ...formattedImages], // Use formattedImages array
            };


            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            const response = await axios.put('/api/products', productInfo, config);

            if (!response?.data.success) {
                return toast.error(`${response.data.error}`, {
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

            return response
        } catch (error) {

            return toast.warning(`${error.message}`, {
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

    const removeOldImage = (index) => {
        setOldImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            URL.revokeObjectURL(prevImages[index].url);
            return updatedImages;
        });
    }

    return (
        <>
            <main className='flex justify-center pt-8'>
                <div className='bg-white w-[40%] border-r-gray-200 border-r-4 flex justify-center'>
                    <div className=' w-[500px] flex items-center flex-col h-[550px] rounded p-1'>
                        {
                            oldImages.length > 0 ?
                                <div className='p-2'>
                                    <p className='font-semibold p-4'>Old Images</p>
                                    <div className='flex gap-3 justify-center items-center'>

                                        {
                                            oldImages?.map((img, index) => (
                                                <div key={img.public_id} className='relative'>
                                                    <CloseRounded className='bg-red-600 text-white rounded-full absolute top-1 right-1' onClick={() => removeOldImage(index)} />
                                                    <Image
                                                        src={img.url}
                                                        alt={`slide-${index}`}
                                                        width={100}
                                                        height={100}
                                                        objectFit="contain"
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                : ""
                        }

                        <p className='mt-[50px] font-semibold'>Select New Images</p>

                        <Swiper navigation={true} modules={[Navigation]} className="mySwiper rounded">
                            {selectedImages.length > 0 ? (
                                selectedImages.map((image, index) => (
                                    <SwiperSlide key={index} className="relative">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={image.url}
                                                alt={`slide-${index}`}
                                                layout="fill"
                                                objectFit="contain"
                                            />
                                            <button
                                                className="absolute w-10 h-10 top-2 right-2 bg-gray-200 text-black hover:bg-gray-400 duration-100 rounded-full p-1"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={productImages}
                                            alt="default slide"
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>
                        <div>
                            <input type="file" id="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                            <label htmlFor="file" className="cursor-pointer mt-9 inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                                Choose Images
                            </label>
                        </div>
                    </div>
                </div>
                <div className='bg-white py-8 w-[50%] pl-[100px] flex justify-center'>
                    <div className='flex flex-col relative'>
                        <h1 className='font-bold bg-gray-600 text-center text-white py-4 rounded mt-1'>Update Product # {prodId}</h1>
                        <div className='flex flex-col w-[40dvw] gap-3 bg-white py-4 rounded mt-1 px-[100px]'>
                            <TextField label="Product Name" variant="outlined" color="success" value={name} onChange={e => setName(e.target.value)} />
                            <TextField label="Description" variant="outlined" color="success" value={description} onChange={e => setDescription(e.target.value)} />
                            <TextField label="Price" variant="outlined" color="success" value={price} onChange={e => setPrice(e.target.value)} />
                            <TextField label="Seller" variant="outlined" color="success" value={seller} onChange={e => setSeller(e.target.value)} />
                            <TextField type='number' label="Stock" variant="outlined" color="success" value={stock} onChange={e => setStock(e.target.value)} />
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel color="success" className='bg-white'>Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={category}
                                        label="Age"
                                        onChange={handleChange}
                                        color="success"
                                    >
                                        <MenuItem value={'Electronics'}>Electronics</MenuItem>
                                        <MenuItem value={'Cameras'}>Cameras</MenuItem>
                                        <MenuItem value={'Accessories'}>Accessories</MenuItem>
                                        <MenuItem value={'Headphones'}>Headphones</MenuItem>
                                        <MenuItem value={'Sports'}>Sports</MenuItem>
                                        <MenuItem value={'Laptop'}>Laptop</MenuItem>
                                        <MenuItem value={'Mobile'}>Mobile</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <button className='mt-3 border border-gray-700 rounded text-gray-700 font-semibold hover:bg-gray-700 hover:text-white duration-300 p-2' onClick={handleProductUpload}>Update Product</button>
                            {
                                progressBarToggle ?
                                    <div className='flex gap-2 border absolute top-0 right-0 w-[100%] h-[100%] justify-center items-center bg-slate-200 z-10 opacity-40'>
                                        <Box sx={{ display: 'flex' }}>
                                            <CircularProgress color="success" />
                                        </Box>
                                        <p className='font-semibold text-green-600'>Please, wait Uploading...</p>
                                    </div> : ""
                            }
                        </div>
                    </div>
                </div>
                <ToastContainer pauseOnFocusLoss={false} />
            </main>
        </>
    );
}
