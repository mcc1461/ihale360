export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F3B73", // Primary color
          light: "##4ea8de", // Light primary color
        },
        secondary: "#f49f0a", // Secondary color
        background: "#f1f3f6", // Background color
        "custom-green": "#00ff00", // Custom green color
        "custom-red": "#ff0000", // Custom red color
        "custom-blue": "#0000ff", // Custom blue color
        "custom-purple": "#800080", // Custom purple color
        "custom-cyan": "#00ffff", // Custom cyan color
        "custom-white": "#ffffff", // Custom white color
        "custom-black": "#000000", // Custom black color
        "custom-gray": "#808080", // Custom gray color
        "custom-orange": "#ffa500", // Custom orange color
        "custom-pink": "#ffc0cb", // Custom pink color
        "custom-brown": "#a52a2a", // Custom brown color
        "custom-violet": "#ee82ee", // Custom violet color
        "custom-indigo": "#4b0082", // Custom indigo color
        "custom-maroon": "#800000", // Custom maroon color
        "custom-teal": "#008080", // Custom teal color
        "custom-navy": "#000080", // Custom navy color
        "custom-olive": "#808000", // Custom olive color
        "custom-lime": "#00ff00", // Custom lime color
        "custom-aqua": "#00ffff", // Custom aqua color
        "custom-silver": "#c0c0c0", // Custom silver color
        "custom-gray": "#808080", // Custom gray color
        "custom-teal": "#008080", // Custom teal color
        "custom-yellow": "#ffff00", // Custom yellow color
        "custom-fuchsia": "#ff00ff", // Custom fuchsia color
        "custom-azure": "#f0ffff", // Custom azure color
        "custom-lavender": "#e6e6fa", // Custom lavender color
        "custom-beige": "#f5f5dc", // Custom beige color
        "custom-mint": "#f5fffa", // Custom mint color
        "custom-peach": "#ffe5b4", // Custom peach color
        "custom-gold": "#ffd700", // Custom gold color
        "custom-coral": "#ff7f50", // Custom coral color
        "custom-tomato": "#ff6347", // Custom tomato color
        "custom-salmon": "#fa8072", // Custom salmon color
        "custom-khaki": "#f0e68c", // Custom khaki color
        "custom-plum": "#dda0dd", // Custom plum color
        "custom-orchid": "#da70d6", // Custom orchid color
        "custom-cyan": "#00ffff", // Custom cyan color
        "custom-yellow2": "#f0f099", // Custom yellow color
      },
    },
  },
  plugins: [require("@tailwindcss/forms")], // ✅ Ensure this exists
};
