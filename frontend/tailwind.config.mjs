/**
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Sử dụng import.meta.require thay vì require cho ES modules
    (await import('@tailwindcss/forms')).default,
  ],
  darkMode: 'class',
}
