import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { Order } from '../../../Server/models/order'

export const GET = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            message: 'Server is not connected yet, please wait or retry.',
            success: false,
            status: 500
        });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user');
        if (!userId) {
            return NextResponse.json({
                message: 'User not loged in',
                success: false,
                status: 401
            });
        }

        const ordersData = await Order.find({ userid: userId })

        if (ordersData.length > 0) {
            return NextResponse.json({
                message: 'orders found',
                Orders: ordersData,
                success: true,
                status: 200
            });
        }
        else {
            return NextResponse.json({
                message: 'no orders found',
                Orders: ordersData,
                success: true,
                status: 200
            });
        }



    } catch (error) {
        return NextResponse.json({
            message: error.message,
            success: false,
            status: 500
        });
    }
}