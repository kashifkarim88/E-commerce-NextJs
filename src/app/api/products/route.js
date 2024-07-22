import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { Product } from '@/Server/models/products';

export const POST = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }

    try {
        const payload = await req.json();
        const product = new Product(payload);
        const results = await product.save();
        return NextResponse.json({ result: results, success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false });
    }
};

export const PUT = async (req) => {
    const isConnected = await dbConnect(); // connect to the database
    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }
    try {
        const payload = await req.json();
        const { _id, ...updateData } = payload;

        if (!payload) {
            return NextResponse.json({
                success: false,
                message: "Please, provide credentials"
            });
        }

        const response = await Product.updateOne({ _id }, updateData);

        if (!response) {
            return NextResponse.json({ error: "Something went wrong. Please try again.", success: false });
        }

        console.log('response update', response);
        return NextResponse.json({ success: true, message: `Product #${_id} updated successfully.` });
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false });
    }
};


export const GET = async (req) => {
    try {
        const isConnected = await dbConnect(); // Connect to the database

        if (!isConnected) {
            return NextResponse.json({
                error: 'Server is not connected yet, please wait or retry.',
                success: false,
            });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page'), 10) || 1; // Default to page 1 if not provided
        const limit = parseInt(searchParams.get('limit'), 10) || 5; // Default to limit 5 if not provided
        const category = searchParams.get('category');

        let query = {};
        if (category && category !== "" && category !== "select category" && category !== "all") {
            query.category = category;
        }

        const [allProducts, totalProducts] = await Promise.all([
            Product.find(query).skip((page - 1) * limit).limit(limit),
            Product.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        return NextResponse.json({
            data: allProducts,
            currentPage: page,
            totalPages: totalPages,
            totalProducts: totalProducts,
            success: true,
        });
    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json({
            error: 'An error occurred while processing your request.',
            success: false,
        });
    }
};