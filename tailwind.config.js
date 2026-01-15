/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f2f9f4',
                    100: '#e1f2e5',
                    200: '#c5e2cc',
                    300: '#9cc9a8',
                    400: '#6fa67e',
                    500: '#4a825a',
                    600: '#386645',
                    700: '#2f5233', // Deep Herbal Green
                    800: '#27412b',
                    900: '#203624',
                    950: '#111f14',
                },
                secondary: {
                    50: '#fbf9eb',
                    100: '#f6f1cd',
                    200: '#ede29e',
                    300: '#e2cf6b',
                    400: '#d4af37', // Gold/Ochre
                    500: '#b89228',
                    600: '#94711e',
                    700: '#76561b',
                    800: '#63471d',
                    900: '#543d1d',
                    950: '#30210d',
                },
                earth: {
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#454545',
                    900: '#3d3d3d',
                    950: '#1a1a1a', // Charcoal Black
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
}
