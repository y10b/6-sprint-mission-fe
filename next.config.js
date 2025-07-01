module.exports = {
    eslint: {
        // 배포 시 ESLint 에러 무시
        ignoreDuringBuilds: true,
    },
    typescript: {
        // 배포 시 TypeScript 에러 무시
        ignoreBuildErrors: true,
    },
    // swcMinify: false, // Next.js 15에서 제거됨
    // experimental: {
    //     forceSwcTransforms: true, // Turbopack에서 지원되지 않음
    // },
    // API 호출은 환경 변수 NEXT_PUBLIC_API_URL 사용
    // rewrites 제거하여 직접 API 호출
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "connect-src 'self' https://*;"
                    }
                ]
            }
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
