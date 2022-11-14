const edgeRuntime = {
    experimental: {
        runtime: 'experimental-edge',
        largePageDataBytes: 10 * 1024 * 1024 // 10MB
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
