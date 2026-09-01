/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Government Design System Tokens
        gov: {
          navy: "#1E3A8A",
          blue: "#2563EB",
          "blue-light": "#3B82F6",
          "blue-pale": "#DBEAFE",
          bg: "#F3F4F6",
          text: "#1F2937",
          success: "#10B981",
          "success-light": "#D1FAE5",
          warning: "#F59E0B",
          "warning-light": "#FEF3C7",
          danger: "#EF4444",
          "danger-light": "#FEE2E2",
          border: "#E5E7EB",
          muted: "#6B7280",
          card: "#FFFFFF",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ["Poppins", "Inter", "sans-serif"],
        body: ["Inter", "Roboto", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      backgroundImage: {
        "gov-gradient": "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
        "gov-gradient-subtle": "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
      },
      boxShadow: {
        gov: "0 1px 3px 0 rgba(30,58,138,0.1), 0 1px 2px -1px rgba(30,58,138,0.1)",
        "gov-md": "0 4px 6px -1px rgba(30,58,138,0.1), 0 2px 4px -2px rgba(30,58,138,0.1)",
        "gov-lg": "0 10px 15px -3px rgba(30,58,138,0.1), 0 4px 6px -4px rgba(30,58,138,0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
