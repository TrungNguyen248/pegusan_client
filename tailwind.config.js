const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')
const { parseColor } = require('tailwindcss/lib/util/color')
const { transform } = require('lodash')

/** @type {import('tailwindcss').Config} */

const toRGB = (value) => {
    return parseColor(value).color.join(' ')
}

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,vue}'],
    safelist: [
        {
            pattern: /animate-delay-.+/,
        },
    ],
    darkMode: 'class',
    theme: {
        height: {
            18: '72px',
        },
        scale: {
            101: '1.01',
            102: '1.02',
            104: '1.04',
        },
        extend: {
            fontFamily: {
                quicksand: ['Quicksand', 'sans-serif'],
                'noto-jp': ['Noto Sans JP', 'sans-serif'],
            },
            colors: {
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                success: 'rgb(var(--color-success) / <alpha-value>)',
                info: 'rgb(var(--color-info) / <alpha-value>)',
                warning: 'rgb(var(--color-warning) / <alpha-value>)',
                pending: 'rgb(var(--color-pending) / <alpha-value>)',
                danger: 'rgb(var(--color-danger) / <alpha-value>)',
                light: 'rgb(var(--color-light) / <alpha-value>)',
                dark: 'rgb(var(--color-dark) / <alpha-value>)',
                darkmode: {
                    50: 'rgb(var(--color-darkmode-50) / <alpha-value>)',
                    100: 'rgb(var(--color-darkmode-100) / <alpha-value>)',
                    200: 'rgb(var(--color-darkmode-200) / <alpha-value>)',
                    300: 'rgb(var(--color-darkmode-300) / <alpha-value>)',
                    400: 'rgb(var(--color-darkmode-400) / <alpha-value>)',
                    500: 'rgb(var(--color-darkmode-500) / <alpha-value>)',
                    600: 'rgb(var(--color-darkmode-600) / <alpha-value>)',
                    700: 'rgb(var(--color-darkmode-700) / <alpha-value>)',
                    800: 'rgb(var(--color-darkmode-800) / <alpha-value>)',
                    900: 'rgb(var(--color-darkmode-900) / <alpha-value>)',
                },
            },
            fontWeight: {
                normal: '500',
                medium: '600',
                semibold: '700',
            },
            container: {
                center: true,
            },
            maxWidth: {
                '1/4': '25%',
                '1/2': '50%',
                '3/4': '75%',
            },
            strokeWidth: {
                0.5: 0.5,
                1.5: 1.5,
                2.5: 2.5,
            },
            backgroundImage: {
                'svg-background':
                    'url("data:image/svg+xml;charset=utf-8,%0A%3Csvg%20width%3D%22230%22%20height%3D%22230%22%20viewBox%3D%220%200%20125%20125%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cpath%20style%3D%22%22%20fill%3D%22none%22%20stroke%3D%22%23cccccc%22%20d%3D%22M62.5%2C0L62.5%2C125%22%20stroke-width%3D%221%22%20stroke-dasharray%3D%224%2C4%22%3E%3C%2Fpath%3E%0A%20%20%3Cpath%20style%3D%22%22%20fill%3D%22none%22%20stroke%3D%22%23cccccc%22%20d%3D%22M0%2C62.5L125%2C62.5%22%20stroke-width%3D%221%22%20stroke-dasharray%3D%224%2C4%22%3E%3C%2Fpath%3E%0A%3C%2Fsvg%3E")',
                'menu-active':
                    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='80' viewBox='0 0 20 122.1'%3E%3Cpath data-name='Union 1' d='M16.038 122H16v-2.213a95.805 95.805 0 00-2.886-20.735 94.894 94.894 0 00-7.783-20.434A39.039 39.039 0 010 61.051a39.035 39.035 0 015.331-17.567 94.9 94.9 0 007.783-20.435A95.746 95.746 0 0016 2.314V0h4v122h-3.961v.1l-.001-.1z' fill='%23f1f5f8'/%3E%3C/svg%3E\")",
                'menu-active-dark':
                    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='80' viewBox='0 0 20 122.1'%3E%3Cpath data-name='Union 1' d='M16.038 122H16v-2.213a95.805 95.805 0 00-2.886-20.735 94.894 94.894 0 00-7.783-20.434A39.039 39.039 0 010 61.051a39.035 39.035 0 015.331-17.567 94.9 94.9 0 007.783-20.435A95.746 95.746 0 0016 2.314V0h4v122h-3.961v.1l-.001-.1z' fill='%23232e45'/%3E%3C/svg%3E\")",
                'bredcrumb-chevron-dark':
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right breadcrumb__icon'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E\")",
                'bredcrumb-chevron-light':
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e8eeff' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right breadcrumb__icon'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E\")",
                'bredcrumb-chevron-darkmode':
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right breadcrumb__icon'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E\")",
            },
            animation: {
                'next-icon-trans': 'next-icon-trans 1s ease-in-out forwards',
                'text-fade': 'text-fade 0.6s linear',
                'transform-top': 'transform-top 0.5s ease-in-out',
            },
            keyframes: {
                // Side & simple menu
                'transform-top': {
                    '0%': {
                        transform: 'translate(-50%,-300px) ',
                    },
                    '100%': {
                        transform: 'translateY(-50%,0px)',
                    },
                },
                'text-fade': {
                    '0%': {
                        opacity: 0,
                    },
                    '100%': {
                        opacity: 1,
                    },
                },
                cloud: {
                    '0%': {
                        left: '-10%',
                        transform: 'translateX(-20vw)',
                    },
                    '100%': {
                        transform: 'translateX(50vw)',
                    },
                },
                'next-icon-trans': {
                    '0%': {
                        transform: 'translateX(-5px)',
                        'animation-timing-function':
                            'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        transform: 'translateX(5px)',
                        'animation-timing-function':
                            'cubic-bezier(0, 0, 0.2, 1)',
                    },
                    '100%': {
                        transform: 'translateX(0px)',
                        'animation-timing-function':
                            'cubic-bezier(0.8, 0, 1, 1)',
                    },
                },
                'intro-divider': {
                    '100%': {
                        opacity: 1,
                    },
                },
                'intro-menu': {
                    '100%': {
                        opacity: 1,
                        transform: 'translateX(0px)',
                    },
                },
                'active-side-menu-chevron': {
                    '100%': {
                        opacity: 1,
                        'margin-right': '-27px',
                    },
                },

                // Top menu
                'intro-top-menu': {
                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0px)',
                    },
                },
                'active-top-menu-chevron': {
                    '100%': {
                        opacity: 1,
                        'margin-bottom': '-56px',
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        plugin(function ({ addBase, matchUtilities }) {
            addBase({
                // Default colors
                ':root': {
                    '--color-primary': toRGB(colors.cyan['900']),
                    '--color-secondary': toRGB(colors.slate['200']),
                    '--color-success': toRGB(colors.teal['600']),
                    '--color-info': toRGB(colors.cyan['500']),
                    '--color-warning': toRGB(colors.amber['500']),
                    '--color-pending': toRGB(colors.amber['600']),
                    '--color-danger': toRGB(colors.red['700']),
                    '--color-light': toRGB(colors.slate['100']),
                    '--color-dark': toRGB(colors.slate['800']),
                },
                // Default dark-mode colors
                '.dark': {
                    '--color-primary': toRGB(colors.cyan['800']),
                    '--color-darkmode-50': '87 103 132',
                    '--color-darkmode-100': '74 90 121',
                    '--color-darkmode-200': '65 81 114',
                    '--color-darkmode-300': '53 69 103',
                    '--color-darkmode-400': '48 61 93',
                    '--color-darkmode-500': '41 53 82',
                    '--color-darkmode-600': '40 51 78',
                    '--color-darkmode-700': '35 45 69',
                    '--color-darkmode-800': '27 37 59',
                    '--color-darkmode-900': '15 23 42',
                },
                // Theme 1 colors
                '.theme-1': {
                    '--color-primary': toRGB(colors.blue['800']),
                    '--color-secondary': toRGB(colors.slate['200']),
                    '--color-success': toRGB(colors.lime['500']),
                    '--color-info': toRGB(colors.cyan['500']),
                    '--color-warning': toRGB(colors.yellow['400']),
                    '--color-pending': toRGB(colors.orange['500']),
                    '--color-danger': toRGB(colors.red['600']),
                    '--color-light': toRGB(colors.slate['100']),
                    '--color-dark': toRGB(colors.slate['800']),
                    '&.dark': {
                        '--color-primary': toRGB(colors.emerald['800']),
                    },
                },
                // Theme 2 colors
                '.theme-2': {
                    '--color-primary': toRGB(colors.blue['900']),
                    '--color-secondary': toRGB(colors.slate['200']),
                    '--color-success': toRGB(colors.teal['600']),
                    '--color-info': toRGB(colors.cyan['500']),
                    '--color-warning': toRGB(colors.amber['500']),
                    '--color-pending': toRGB(colors.orange['500']),
                    '--color-danger': toRGB(colors.red['700']),
                    '--color-light': toRGB(colors.slate['100']),
                    '--color-dark': toRGB(colors.slate['800']),
                    '&.dark': {
                        '--color-primary': toRGB(colors.blue['800']),
                    },
                },
                // Theme 3 colors
                '.theme-3': {
                    '--color-primary': toRGB(colors.emerald['900']),
                    '--color-secondary': toRGB(colors.slate['200']),
                    '--color-success': toRGB(colors.emerald['600']),
                    '--color-info': toRGB(colors.cyan['500']),
                    '--color-warning': toRGB(colors.yellow['400']),
                    '--color-pending': toRGB(colors.amber['500']),
                    '--color-danger': toRGB(colors.rose['600']),
                    '--color-light': toRGB(colors.slate['100']),
                    '--color-dark': toRGB(colors.slate['800']),
                    '&.dark': {
                        '--color-primary': toRGB(colors.cyan['800']),
                    },
                },
                // Theme 4 colors
                '.theme-4': {
                    '--color-primary': toRGB(colors.indigo['900']),
                    '--color-secondary': toRGB(colors.slate['200']),
                    '--color-success': toRGB(colors.emerald['600']),
                    '--color-info': toRGB(colors.cyan['500']),
                    '--color-warning': toRGB(colors.yellow['500']),
                    '--color-pending': toRGB(colors.orange['600']),
                    '--color-danger': toRGB(colors.red['700']),
                    '--color-light': toRGB(colors.slate['100']),
                    '--color-dark': toRGB(colors.slate['800']),
                    '&.dark': {
                        '--color-primary': toRGB(colors.indigo['700']),
                    },
                },
            })

            // Animation delay utilities
            matchUtilities(
                {
                    'animate-delay': (value) => ({
                        'animation-delay': value,
                    }),
                },
                {
                    values: (() => {
                        const values = {}
                        for (let i = 1; i <= 50; i++) {
                            values[i * 10] = `${i * 0.1}s`
                        }
                        return values
                    })(),
                },
            )

            // Animation fill mode utilities
            matchUtilities(
                {
                    'animate-fill-mode': (value) => ({
                        'animation-fill-mode': value,
                    }),
                },
                {
                    values: {
                        none: 'none',
                        forwards: 'forwards',
                        backwards: 'backwards',
                        both: 'both',
                    },
                },
            )
        }),
    ],
    variants: {
        extend: {
            boxShadow: ['dark'],
        },
    },
}
