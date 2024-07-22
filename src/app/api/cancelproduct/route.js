import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { Order } from '@/Server/models/order'

export const PUT = async (req) => {

    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }

    try {
        const { order } = await req.json();
        if (!order) {
            return NextResponse.json({
                message: 'Order ID missing',
                success: false,
            });
        }

        const isExists = await Order.find({ _id: order })

        if (!isExists) {
            return NextResponse.json({
                message: `Order #: ${order} doesn't exists`,
                success: false,
            });
        }

        const response = await Order.updateOne({ orderStatus: "Canceled" })

        if (response) {
            return NextResponse.json({
                message: 'Order Canceled',
                response: response,
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