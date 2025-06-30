module.exports = {
    eslint: {
        // 배포 시 ESLint 에러 무시
        ignoreDuringBuilds: true,
    },
    typescript: {
        // 배포 시 TypeScript 에러 무시 (선택사항)
        ignoreBuildErrors: true,
    },
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
