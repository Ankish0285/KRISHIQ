/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#166534",
          green: "#166534",
        },
        leaf: "#22C55E",
        "light-green": "#DCFCE7",
        deep: "#14532D",
        "ai-blue": "#2563EB",
        "light-blue": "#DBEAFE",
        ink: "#0F172A",
        muted: "#64748B",
        canvas: "#F8FAFC",
        night: "#06150F",
        panel: "#0B1720",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(15, 23, 42, 0.12)",
        soft: "0 8px 24px -16px rgba(22, 101, 52, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
