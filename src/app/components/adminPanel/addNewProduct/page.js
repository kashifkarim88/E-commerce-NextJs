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
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AddNewProduct() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [images, setImages] = useState([]); // New state for storing image URLs
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [seller, setSeller] = useState('');
    const [stock, setStock] = useState(0);
    const [progressBarToggle, setProgressBarToggle] = useState(false);
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
        if (selectedImages.length > 0) {
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
                    console.log("Uploaded Image URLs: ", imageUrls);
                    const uploadedData = await addNewProductDB(imageUrls); // Pass image URLs to the function and await its completion
                    console.log("uploaded Data", uploadedData)
                    if (uploadedData?.data?.success) {
                        setProgressBarToggle(false);
                        console.log("uploaded Data->", uploadedData);
                        setName("");
                        setPrice("");
                        setCategory("");
                        setDescription("");
                        setImages([]);
                        setSelectedImages([]);
                        setSeller("");
                        setStock("");
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
                console.error("Error uploading images: ", error);
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
                name,
                price: parseFloat(price.replace(/,/g, '')),
                description,
                category,
                seller,
                stock: parseInt(stock),
                images: formattedImages, // Use formattedImages array
            };

            console.log("Product Info:", productInfo);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            const response = await axios.post('/api/products', productInfo, config);
            console.log("API Response:", response);

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






    return (
        <>
            <main className='flex gap-2'>
                <div className='border w-[300px] h-[400px] rounded p-1'>
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
                        <label htmlFor="file" className="cursor-pointer mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                            Choose Images
                        </label>
                    </div>
                </div>
                <div className='flex flex-col relative'>
                    <h1 className='font-bold bg-green-600 text-center text-white py-4 rounded mt-1'>Product Details</h1>
                    <div className='flex flex-col w-[40dvw] gap-3 bg-white py-4 rounded border shadow-lg mt-1 px-[100px]'>
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
                        <button className='mt-3 border border-green-700 rounded text-green-700 font-semibold hover:bg-green-700 hover:text-white duration-300 p-2' onClick={handleProductUpload}>Add Product</button>
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
                <ToastContainer pauseOnFocusLoss={false} />
            </main>
        </>
    );
}
