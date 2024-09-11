import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: 'var(--color-primary-100)',
                    200: 'var(--color-primary-200)',
                    300: 'var(--color-primary-300)',
                    400: 'var(--color-primary-400)',
                    500: 'var(--color-primary-500)',
                    600: 'var(--color-primary-600)'
                },
                gray: {
                    100: 'var(--color-gray-100)',
                    200: 'var(--color-gray-200)',
                    300: 'var(--color-gray-300)',
                    400: 'var(--color-gray-400)'
                }
            },
            fontFamily: {
                roboto: ['Roboto', 'sans-serif']
            },
            borderRadius: {
                xs: '0.2rem',
                sm: '0.4rem',
                md: '0.6rem',
                lg: '0.8rem',
                xl: '1rem',
                '2xl': '1.2rem'
            },
            spacing: {
                _52: '52px',
                _450: '450px',
                _776: '776px'
            }
        }
    },
    plugins: []
};
export default config;
