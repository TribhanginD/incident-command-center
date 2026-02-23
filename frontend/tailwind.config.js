/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    glow: 'rgba(99, 102, 241, 0.3)',
                },
            },
        },
    },
    plugins: [],
}
