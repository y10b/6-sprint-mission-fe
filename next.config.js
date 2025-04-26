module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://panda-market-api.vercel.app/:path*',
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            }
        ]
    },
}
