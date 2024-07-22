import { NextResponse } from 'next/server';
import dbConnect from '@/Server/dbConnect';
import { Product } from '@/Server/models/products';

export const GET = async (req) => {
    await dbConnect(); // Ensure database is connected

    // Extract query parameters from the URL
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const limit = parseInt(searchParams.get('limit'), 10) || 5;
    const category = searchParams.get('category') || 'all';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || Infinity;

    let query = {
        price: { $gte: minPrice, $lte: maxPrice }
    };

    if (category && category !== 'select category' && category !== 'all') {
        query.category = category;
    }

    try {
        const [allProducts, totalProducts] = await Promise.all([
            Product.find(query).skip((page - 1) * limit).limit(limit),
            Product.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        return NextResponse.json({
            data: allProducts,
            currentPage: page,
            totalPages,
            totalProducts,
            success: true
        });

    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json({
            error: 'An error occurred while processing your request.',
            success: false
        });
    }
};
