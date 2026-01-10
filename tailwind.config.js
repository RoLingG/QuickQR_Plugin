/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{vue,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'], // 强制衬线体
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

