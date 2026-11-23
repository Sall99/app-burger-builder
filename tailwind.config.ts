import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            colors: {
                surface: {
                    DEFAULT: '#F8F6F2',
                    muted: '#F1EDE6',
                    subtle: '#FBF9F6',
                    card: '#FFFFFF',
                    border: '#E7E1D8'
                },
                ink: {
                    DEFAULT: '#141210',
                    muted: '#57514B',
                    subtle: '#8F8880'
                },
                charcoal: {
                    DEFAULT: '#141210',
                    light: '#231F1C',
                    border: '#322D29'
                },
                brand: {
                    50: '#FFF3EE',
                    100: '#FFE4D9',
                    200: '#FFC5B0',
                    300: '#FF9E7D',
                    400: '#F96A3D',
                    500: '#E8431D',
                    600: '#CC3411',
                    700: '#A6280C'
                },
                fresh: {
                    50: '#EAF9F1',
                    100: '#CEF2DF',
                    500: '#00B362',
                    600: '#009954',
                    700: '#007A43'
                },
                cheddar: {
                    50: '#FFF9E6',
                    100: '#FFEFBF',
                    400: '#FFCA28',
                    500: '#FFB300',
                    600: '#E09600'
                },
                basil: {
                    50: '#EAF9F1',
                    100: '#CEF2DF',
                    600: '#009954',
                    700: '#007A43'
                },
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
                sans: [
                    'var(--font-poppins)',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'sans-serif'
                ],
                display: [
                    'var(--font-outfit)',
                    'var(--font-poppins)',
                    '-apple-system',
                    'sans-serif'
                ],
                mono: [
                    'var(--font-geist-mono)',
                    'ui-monospace',
                    'SFMono-Regular',
                    'Menlo',
                    'monospace'
                ],
                roboto: ['var(--font-poppins)', 'sans-serif']
            },
            boxShadow: {
                soft: '0 1px 2px 0 rgba(20, 18, 16, 0.04)',
                card: '0 1px 2px 0 rgba(20, 18, 16, 0.05), 0 1px 1px 0 rgba(20, 18, 16, 0.02)',
                elevated:
                    '0 16px 40px -16px rgba(20, 18, 16, 0.22), 0 2px 6px -2px rgba(20, 18, 16, 0.06)',
                brand: '0 1px 2px 0 rgba(20, 18, 16, 0.08)',
                fresh: '0 1px 2px 0 rgba(20, 18, 16, 0.08)'
            },
            borderRadius: {
                xs: '0.125rem',
                sm: '0.25rem',
                md: '0.375rem',
                lg: '0.5rem',
                xl: '0.625rem',
                '2xl': '0.75rem',
                '3xl': '0.875rem'
            },
            spacing: {
                _52: '52px',
                _450: '450px',
                _776: '776px',
                _1280: '1280px'
            }
        }
    },
    plugins: []
}
export default config
