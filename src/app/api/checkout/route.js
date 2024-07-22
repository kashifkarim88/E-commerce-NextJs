import Stripe from 'stripe';
import dbConnect from '@/Server/dbConnect';
import { NextResponse } from 'next/server';
import { Order } from '@/Server/models/order';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

export const GET = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }

    try {
        const { searchParams } = new URL(req.url);
        const session_id = searchParams.get('session_id');
        const userid = searchParams.get('userId');
        console.log(session_id);

        if (!session_id) {
            return NextResponse.json({
                error: 'Session ID is required',
                success: false,
            });
        }

        // Check if the session has already been processed
        const existingOrder = await Order.findOne({ clientRef: session_id });
        if (existingOrder) {
            return NextResponse.json({
                message: 'Order already processed',
                success: true,
                orderedItems: existingOrder,
            });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        const { metadata } = session;
        const items = JSON.parse(metadata.items);
        const amountPaid = session.amount_total / 100; // Convert amount to dollars

        const newOrder = new Order({
            shippingInfo: metadata.ShippingInfo,
            clientRef: session_id,
            userid,
            orderItems: items,
            amountPaid
        });

        const addNewProduct = await newOrder.save();
        if (addNewProduct) {
            return NextResponse.json({
                items: items,
                amountPaid: amountPaid,
                metaData: metadata,
                success: true,
                orderedItems: addNewProduct
            });
        } else {
            return NextResponse.json({
                message: 'Something went wrong',
                success: false,
            });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false });
    }
};
