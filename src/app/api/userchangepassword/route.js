import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { User } from '@/Server/models/user';
const bcrypt = require('bcrypt');

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
        const email = searchParams.get('email');
        const password = searchParams.get('password');

        const user = await User.findOne({
            email: {
                $regex: email,
                $options: 'i'
            }
        });

        if (!user) {
            return NextResponse.json({
                message: `User with email: ${email} does not exist. Please check login credentials.`,
                success: false,
                status: 400
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return NextResponse.json({
                message: `The password for the provided email: ${email} is incorrect. Please check login credentials.`,
                success: false,
                statu: 400
            });
        }

        return NextResponse.json({
            success: true,
            message: 'password verified',
            status: 201
        });
    } catch (error) {
        return NextResponse.json({ message: error.message, success: false, status: 400 })
    }
}


export const PUT = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            message: 'Server is not connected yet, please wait or retry.',
            success: false,
            status: 500
        });
    }

    try {
        const { email, password, id } = await req.json(); // Parse JSON body from the PUT request

        const isExists = await User.findOne({ email });

        if (!isExists) {
            return NextResponse.json({
                message: `User with email: ${email} does not exist. Please check login credentials.`,
                success: false,
                status: 400
            });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateUser = await User.updateOne({ _id: id }, { password: hashedPassword })
        return NextResponse.json({ data: updateUser })

    } catch (error) {
        return NextResponse.json({ message: error.message, success: false, status: 400 })
    }
}