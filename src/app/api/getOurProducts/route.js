import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { Product } from '@/Server/models/products';

export const GET = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }

    try {
        const allProducts = await Product.find().limit(5);
        return NextResponse.json(allProducts);
    }
    catch (error) {
        // Handle errors
        console.error('Error in GET request:', error);
        return NextResponse.json({
            error: 'An error occurred while processing your request.',
            success: false,
        });
    }
};
