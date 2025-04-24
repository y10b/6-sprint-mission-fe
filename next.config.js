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
        domains: ['search.pstatic.net', 'encrypted-tbn0.gstatic.com', 'health.chosun.com', 'via.placeholder.com', 'cdn.choicenews.co.kr', 'example.com'], // 외부 이미지 도메인 추가
    },
}
