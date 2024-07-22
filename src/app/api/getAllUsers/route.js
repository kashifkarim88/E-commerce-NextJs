import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { User } from '@/Server/models/user';

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
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 1;

        const skip = (page - 1) * limit;

        // Get the total count of users
        const totalUsers = await User.countDocuments({ isUser: true });

        // Get the paginated users
        const allUsers = await User.find({ isUser: true }).skip(skip).limit(limit);

        return NextResponse.json({
            allUsers,
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false });
    }
};
