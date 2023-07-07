/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*', // or your origin. For example, http://localhost:3000
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'POST',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization',
                    },
                ],
            },
        ]
    }
}

module.exports = nextConfig
