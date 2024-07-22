import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { Order } from '@/Server/models/order'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

export async function POST(req) {
    const isConnected = await dbConnect();

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
            status: 500
        });
    }

    try {
        const body = await req.json();
        const ShippingInfo = body?.shippingInfo;
        const email = body?.email;
        const clientRefId = body?.cardHolderId;

        // Reduce metadata size by only including essential information
        const metadata = body?.items?.map((item) => ({
            product: item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));

        const line_items = body?.items?.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                    metadata: { productId: item.product },
                },
                unit_amount: item.price * 100,
            },
            tax_rates: ['txr_1PWxz7RoHKATZDpC0UKHHwjq'],
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `http://localhost:3000/components/OrderCompleted?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:3000",
            customer_email: email,
            client_reference_id: clientRefId,
            mode: 'payment',
            metadata: {
                ShippingInfo: JSON.stringify(ShippingInfo),
                clientRefId,
                items: JSON.stringify(metadata)
            },
            shipping_options: [{ shipping_rate: "shr_1PWxpXRoHKATZDpCjr4Qjm9B" }],
            line_items,
        });

        return NextResponse.json({
            url: session.url,
            id: session.id,
            success: true,
            status: 200,
        });
    } catch (error) {
        console.error("Stripe API Error: ", error);
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        });
    }
}

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
        const allOrdersData = await Order.find();
        if (allOrdersData.length > 0) {
            return NextResponse.json({ data: allOrdersData, success: true });
        } else {
            return NextResponse.json({ message: "no data found", success: false, status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false, status: 500 });
    }
}

