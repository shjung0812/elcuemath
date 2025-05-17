module.exports = {
  plugins: [
    require('tailwindcss'), // Tailwind CSS 플러그인 추가
    require('@tailwindcss/postcss'), // @tailwindcss/postcss 플러그인 추가
    require('autoprefixer'), // Autoprefixer는 일반적으로 마지막에 위치합니다.
  ],
};