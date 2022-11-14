import * as removeImports from "next-remove-imports";

export default removeImports.default({
    experimental: {
        runtime: 'experimental-edge',
    },
    reactStrictMode: true,
    swcMinify: true
});
