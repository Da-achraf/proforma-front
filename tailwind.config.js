/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3c5d9e',
          light: '#7f99e0',
          50: '#c3dbff',
          100: '#a0b9ff',
          200: '#5e7abf'
        },
        secondary: {
          DEFAULT: '#ff6528',    // Vibrant orange
          light: '#ffbdc9',      // Lighter orange for hover
          50: '#ff9c98',        // Very light orange for backgrounds
          100: '#ff7e63',       // Light orange for borders/dividers
        },
        neutral: {
          DEFAULT: '#FFFFFF',    // Pure white
          surface: '#F8F9FA',    // Off-white for backgrounds
          100: '#F0F2F5',       // Light gray for cards/sections
          200: '#E4E6EB',       // Border color
          300: '#CFD1D6',       // Disabled backgrounds
        },
        text: {
          DEFAULT: '#1A1A1A',    // Primary text color
          secondary: '#4A4A4A',  // Secondary text
          muted: '#737373',      // Muted text
          onPrimary: '#FFFFFF',  // Text on primary color
          onSecondary: '#FFFFFF' // Text on secondary color
        },
        status: {
          success: '#00875A',    // Green for success states
          warning: '#FF8800',    // Amber for warnings
          error: '#E11900',      // Red for errors
          info: '#0066CC'        // Blue for information
        },
        background: {
          DEFAULT: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
