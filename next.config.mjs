/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        STRIPE_PUBLIC_KEY: 'pk_test_51PWubIRoHKATZDpCOGMrmyHmstbLzRUjRC1ED05OY5ZkAiwi5vVohDcYrpQ2g3b5lUE3McJb38r27Cw4wnKz2S2G003ueD7d84',
        STRIPE_PRIVATE_KEY: 'sk_test_51PWubIRoHKATZDpCy9BMxAiOUqzRb3lFb5pAG25VzzqGDR98zUOSICwAAK2189iwkL2On65EylC0OJ2M6Gho9VQG00RdFbgNmD',
        STRIPE_WEBHOOK_SECRECT: 'whsec_5726837d4c7f4827e447fed88ada0190b05de2eb054439d117928d4fe3e69ebb',
        MONGODB_URI: 'mongodb+srv://kashifkarimkhan88:NextJsFullStackEcommerce@nextjs.kb6lose.mongodb.net/?retryWrites=true&w=majority&appName=NextJs'
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
