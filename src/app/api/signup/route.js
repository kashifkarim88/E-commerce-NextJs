import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { User } from '@/Server/models/user';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const jwtKey = 'nextecommerce'

export const POST = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            error: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }

    try {
        const { email, password, name, phone, address, street, city, country, isUser, isAdmin } = await req.json();
        console.log({ email, password, name, phone, address, street, city, country, isUser, isAdmin });

        // Check if the required fields are present
        if (!email || !password || !name || !phone || !address || !city || !country) {
            return NextResponse.json({
                error: 'All fields (email, password, name, phone, address) are required.',
                success: false,
            });
        }

        const isExists = await User.findOne({ email });

        if (isExists) {
            return NextResponse.json({
                message: `User with email: ${email} already exists. Please login or create another account.`,
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            phone,
            address,
            street,
            city,
            country,
            password: hashedPassword,
            isUser: typeof isUser !== 'undefined' ? isUser : true,
            isAdmin: typeof isAdmin !== 'undefined' ? isAdmin : false,
        });

        console.log('New User before save:', newUser);

        const registeredUser = await newUser.save();

        console.log('Registered User after save:', registeredUser);

        const userData = registeredUser.toObject();
        delete userData.password;

        return NextResponse.json({ results: userData, success: true });
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ error: error.message, success: false });
    }
};



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
        const email = searchParams.get('email');
        const password = searchParams.get('password');

        if (!email || !password) {
            return NextResponse.json({
                error: 'All fields (email, password) are required.',
                success: false,
            });
        }

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
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return NextResponse.json({
                message: `The password for the provided email: ${email} is incorrect. Please check login credentials.`,
                success: false,
            });
        }

        const userData = { ...user.toObject() };
        delete userData.password;

        const token = jwt.sign({ userData }, jwtKey, { expiresIn: '2h' });

        return NextResponse.json({
            success: true,
            message: 'Login successful.',
            data: { userdata: userData, auth: token }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false });
    }
};