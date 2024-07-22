import Image from 'next/image'
import React from 'react'
import GirlImg from '../../../images/Girl.webp'
import Accessories from '../../../images/accessories.jpg'
import Iphone from '../../../images/Iphone.jpeg'
import Electronics from '../../../images/electronic-gadgets.jpeg'


export default function Hero() {
    return (
        <>
            <main className='flex h-[80dvh] relative cursor-default'>
                <div className='absolute top-0 left-10 opacity-25 '>
                    <h1 className='font-bold font-serif text-[150px]'>FUSION BAZAR</h1>
                </div>
                <div className='flex flex-col justify-center px-[5dvw] w-[55%]'>
                    <h1 className='font-bold font-sans text-3xl w-[500px] text-left' style={{ letterSpacing: '1px' }}>Unleash Your Inner Shopaholic at <span className='bg-green-400 text-white px-3 py-1 font-serif'>[Fusion Bazar]</span></h1>
                    <p className='mt-1'>Dive into a world of unbeatable deals and exceptional finds.</p>
                    <p className='text-gray-400 font-sans mt-11 w-[450px] text-left'>Discover top-quality products at prices you’ll love. From the latest fashion and cutting-edge electronics to home essentials and unique gifts, we’ve got it all. Enjoy fast shipping, secure payments, and stellar customer service.</p>
                    <button className='w-[100px] mt-4 py-3 px-6 rounded-full bg-gray-800 font-sans text-white text-sm '>Explore</button>
                </div>
                <div className='flex flex-col gap-5 justify-center p-3'>
                    <div className='relative ml-5'>
                        <Image className='w-[100px] h-[100px] rounded-2xl' width={100} height={100} src={Accessories} alt='image.jpg' />
                        <p className='font-semibold text-xs absolute bottom-4 left-4 text-white bg-black px-1 rounded'>Accessories</p>
                    </div>
                    <div className='relative'>
                        <Image className='w-[100px] h-[100px] rounded-2xl' width={100} height={100} src={Iphone} alt='image.jpg' />
                        <p className='font-semibold text-xs absolute bottom-4 left-4 text-white bg-black px-1 rounded'>Mobiles</p>
                    </div>
                    <div className='relative ml-5'>
                        <Image className='w-[100px] h-[100px] rounded-2xl border border-gray-100' width={100} height={100} src={Electronics} alt='image.jpg' />
                        <p className='font-semibold text-xs absolute bottom-4 left-4 text-white bg-black px-1 rounded'>Accessories</p>
                    </div>
                </div>
                <div className='p-3 flex box-border gap-2'>
                    <Image src={GirlImg} alt={'image.jpg'} width={500} height={900} className='rounded-full' />
                </div>
            </main >
        </>
    )
}
