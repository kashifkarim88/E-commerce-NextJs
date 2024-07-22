import { Product } from '@/Server/models/products';
import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';


export async function GET(req, { params }) {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }
    try {
        const productId = params.id
        const results = await Product.findOne({ _id: productId })
        return NextResponse.json({ results, success: true })
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false });
    }

}