/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#375360',
          100: '#0b1113',
          200: '#162227',
          300: '#22323a',
          400: '#2d434e',
          500: '#375360',
          600: '#527b8e',
          700: '#779fb1',
          800: '#a4bfcb',
          900: '#d2dfe5'
        },
        caribbean_current: {
          DEFAULT: '#0B6358',
          100: '#021412',
          200: '#042824',
          300: '#073d36',
          400: '#095148',
          500: '#0b6358',
          600: '#13ad9b',
          700: '#28e7d1',
          800: '#70efe0',
          900: '#b7f7f0'
        },
        prussian_blue: {
          DEFAULT: '#1D344B',
          100: '#060a0f',
          200: '#0b141d',
          300: '#111f2c',
          400: '#17293b',
          500: '#1d344b',
          600: '#335c84',
          700: '#4f85ba',
          800: '#89add1',
          900: '#c4d6e8'
        },
        white: {
          DEFAULT: '#FFFFFF',
          100: '#333333',
          200: '#666666',
          300: '#999999',
          400: '#cccccc',
          500: '#ffffff',
          600: '#ffffff',
          700: '#ffffff',
          800: '#ffffff',
          900: '#ffffff'
        },
        cadet_gray: {
          DEFAULT: '#A0ADB0',
          100: '#1f2425',
          200: '#3d4749',
          300: '#5c6b6e',
          400: '#7c8e91',
          500: '#a0adb0',
          600: '#b3bec0',
          700: '#c6ced0',
          800: '#d9dedf',
          900: '#ecefef'
        },
        // Keep oxford_blue as alias to charcoal for backward compatibility
        oxford_blue: {
          DEFAULT: '#375360',
          100: '#0b1113',
          200: '#162227',
          300: '#22323a',
          400: '#2d434e',
          500: '#375360',
          600: '#527b8e',
          700: '#779fb1',
          800: '#a4bfcb',
          900: '#d2dfe5'
        },
        // Keep slate_gray as alias to cadet_gray for backward compatibility
        slate_gray: {
          DEFAULT: '#A0ADB0',
          100: '#1f2425',
          200: '#3d4749',
          300: '#5c6b6e',
          400: '#7c8e91',
          500: '#a0adb0',
          600: '#b3bec0',
          700: '#c6ced0',
          800: '#d9dedf',
          900: '#ecefef'
        },
      },
    },
  },
  plugins: [],
};