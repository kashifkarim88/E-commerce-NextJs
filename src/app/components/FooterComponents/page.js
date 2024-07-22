'use client'
import React from 'react'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function FooterPage() {
    return (
        <main className='px-[5dvw] mb-0 py-6 bg-gray-200'>
            <div className='flex justify-between '>
                <div>
                    <h2 className='font-bold font-sans' style={{ letterSpacing: '2px' }}>Connect with us</h2>
                    <div className='flex gap-5 py-10'>
                        <FacebookRoundedIcon />
                        <InstagramIcon />
                        <XIcon />
                        <WhatsAppIcon />
                        <YouTubeIcon />
                    </div>
                </div>
                <div>
                    <h2 className='font-bold font-sans' style={{ letterSpacing: '2px' }}>Customer Service</h2>
                    <p className='w-[400px]'><span>Contact Us:</span> Have any questions? Reach out to our support team.</p>
                    <p className='w-[400px]'><span>FAQs:</span> Find answers to the most frequently asked questions.</p>
                    <p className='w-[400px]'><span>Shipping & Delivery:</span> Information on our shipping policies and delivery times.</p>
                    <p className='w-[400px]'><span>Returns & Exchanges:</span> Learn about our hassle-free return and exchange policies.</p>
                    <p className='w-[400px]'><span>Track Your Order:</span> Easily track the status of your order.</p>
                </div>
                <div>
                    <h2 className='font-bold font-sans' style={{ letterSpacing: '2px' }}>Information</h2>
                    <p className='w-[400px]'><span>Privacy Policy:</span> Your privacy is important to us. Read about how we protect your data.</p>
                    <p className='w-[400px]'><span>Terms & Conditions:</span> The rules and guidelines for using our website and services.</p>
                    <p className='w-[400px]'><span>Cookie Policy:</span> Understand how we use cookies to enhance your browsing experience.</p>
                </div>
            </div>
            <hr className='mt-5 border-black' />
            <div className='flex justify-center gap-[5dvw]'>
                <div className='py-4 pl-[12dvw]'>
                    <h2 className='font-bold font-sans' style={{ letterSpacing: '2px' }}>Explore</h2>
                    <p className='w-[400px]'><span>New Arrivals:</span> Check out the latest additions to our collection.</p>
                    <p className='w-[400px]'><span>Best Sellers:</span> Browse our most popular products.</p>
                    <p className='w-[400px]'><span>Special Offers:</span> Don&apos;t miss out on our exclusive deals and discounts.</p>
                    <p className='w-[400px]'><span>Gift Cards:</span> Give the perfect gift with our customizable gift cards.</p>
                </div>
                <div className='py-4'>
                    <h2 className='font-bold font-sans' style={{ letterSpacing: '2px' }}>About</h2>
                    <p>Our Mission</p>
                    <p>Press</p>
                    <p>Careers</p>
                    <p>Sitemap</p>
                </div>
                <div className='py-4'>
                    <h2 className='font-bold font-sans' style={{ letterSpacing: '2px' }}>Help</h2>
                    <p>Help Center</p>
                    <p>Community Guideline</p>
                </div>
            </div>
        </main>
    );
}

export default FooterPage;
