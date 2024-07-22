import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { Product } from '@/Server/models/products';


export const DELETE = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            message: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }

    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        const isExists = await Product.findOne({ _id: productId })
        if (!isExists) {
            return NextResponse.json({
                message: `Product # ${productId} doesn't exists`,
                success: false,
            });
        }

        const response = await Product.deleteOne({ _id: productId })
        if (response) {
            return NextResponse.json({
                message: `Product # ${productId} deleted successfully`,
                data: response,
                success: true,
            });
        }
    } catch (error) {
        return NextResponse.json({
            message: error.message,
            success: false,
        });
    }
}