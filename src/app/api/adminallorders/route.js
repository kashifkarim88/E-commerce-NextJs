import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { Order } from '@/Server/models/order'

export async function GET() {
    const isConnected = await dbConnect();

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
            status: 500
        });
    }

    try {
        const response = await Order.find();
        if (response) {
            return NextResponse.json(
                {
                    message: "all orders",
                    data: response,
                    success: true
                }
            )
        }

        return NextResponse.json(
            {
                message: "no orders",
                success: false
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
                success: false
            }
        )
    }
}