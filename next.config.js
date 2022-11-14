const edgeRuntime = {
    experimental: {
        runtime: 'experimental-edge'
    }
}
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true
}
var finalConfig = {}
if (process.env.NODE_ENV === 'production') {
    finalConfig = { ...nextConfig, ...edgeRuntime }
}
else {
    finalConfig = nextConfig
}
export default finalConfig
