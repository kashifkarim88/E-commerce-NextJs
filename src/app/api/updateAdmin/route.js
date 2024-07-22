import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { User } from '@/Server/models/user';


export const POST = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }

    try {
        const { name, email, phone, password } = await req.json();
        const isExists = await User.findOne({ email })
        if (isExists) {
            const responce = await User.updateOne({ email: email }, { name, email, phone, password })
            if (responce) {
                return NextResponse.json({
                    message: `Admin ${name} Info has been Updated`,
                    state: responce,
                    success: true
                });
            }
        } else {
            return NextResponse.json({
                message: `User ${email} doesn't exists.`,
                success: false
            });
        }
    } catch (error) {
        return NextResponse.json({
            message: error.message,
            success: false
        });
    }
}