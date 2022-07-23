const path = require('path')
const transpile = require('next-transpile-modules')([
    // 'beskar', //
    // 'db',
])

// const withImages = require('next-images')
const { withSuperjson } = require('next-superjson')
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: Boolean(process.env.ANALYZE),
// })

const withRpc = require('next-rpc')({
    experimentalContext: true,
})

const piped = pipe(withRpc, transpile, withSuperjson())

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,

    experimental: {
        externalDir: true,

        // runtime: 'edge',
        // serverComponents: true,
    },

    swcMinify: true,
    images: {},
    // next images extensions
    // fileExtensions: ['svg'],
    webpack: (config, { isServer, dev: isDev }) => {
        config.externals = config.externals.concat([])
        return config
    },
}

module.exports = piped(config)

function pipe(...fns) {
    return (x) => fns.reduce((v, f) => f(v), x)
}
