import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { User } from '@/Server/models/user';

const userCache = new Map();

export const GET = async (req) => {
    const isConnected = await dbConnect(); // connect to the database

    if (!isConnected) {
        return NextResponse.json({
            message: 'Server is not connected yet, please wait or retry.',
            success: false,
        });
    }
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({
                message: 'Please, provide user id',
                success: false,
            });
        }

        if (userCache.has(userId)) {
            const cachedData = userCache.get(userId);
            return NextResponse.json({
                message: `User # ${userId} found (cached)`,
                data: cachedData,
                success: true,
            });
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({
                message: `User with user_id # ${userId} doesn't exists`,
                success: false,
            });
        }
        const userData = { ...user.toObject() };
        delete userData.password;

        // Cache the user data
        userCache.set(userId, userData);

        return NextResponse.json({
            message: `User # ${userId} found`,
            data: userData,
            success: true,
        });
    } catch (error) {
        return NextResponse.json({
            message: error.message,
            success: false,
        });
    }
};
