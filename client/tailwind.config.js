/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  // Specify paths to all of your template files
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  // Enable dark mode based on the 'dark' class on the HTML element
  darkMode: 'class', 
  theme: {
    extend: {
        // Define Inter as the primary font
        fontFamily: {
            sans: ['Inter', ...defaultTheme.fontFamily.sans],
        },
        // Custom animations for the typing effect and element fades
        keyframes: {
            blink: {
                '0%, 100%': { opacity: '1' },
                '50%': { opacity: '0' },
            },
            fadeInUp: {
                '0%': { opacity: '0', transform: 'translateY(20px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            }
        },
        animation: {
            blink: 'blink 1s step-end infinite',
            fadeInUp: 'fadeInUp 0.6s ease-out forwards',
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
    },
  },
  plugins: [
      // Required for styling the markdown content in your blog detail pages
      require('@tailwindcss/typography'), 
  ],
}
