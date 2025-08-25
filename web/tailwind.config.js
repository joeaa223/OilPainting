/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 风景油画主题色彩
        'nature': {
          'forest': '#244b3c',      // 森林绿
          'sky': '#2f6f9f',        // 天际蓝
          'warm': '#e6dccf',       // 暖灰
          'canvas': '#f5f1ea',     // 画布米色
          'dark': '#3b3b3b'        // 深灰
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'frame': '0 4px 20px rgba(36, 75, 60, 0.15)',
        'frame-hover': '0 8px 30px rgba(36, 75, 60, 0.25)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
