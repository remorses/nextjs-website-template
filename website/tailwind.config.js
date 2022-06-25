const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
    mode: 'jit',
    purge: [
        './src/**/*.{js,ts,jsx,tsx}', //
        '../beskar/src/**/*.{js,ts,jsx,tsx}', //
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gray: colors.neutral,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
