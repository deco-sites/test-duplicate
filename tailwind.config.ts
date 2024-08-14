import daisyui from "daisyui";
import { Config } from "npm:tailwindcss";

export default {
  // @ts-expect-error daisyui is a valid plugin
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    extend: {
      container: {
        screens: {
          "2xl": "1580px",
        },
      },
      colors: {
        "primary-500": "oklch(var(--primary-500))",
        "primary-400": "oklch(var(--primary-400))",
        "primary-400-content": "oklch(var(--primary-400-content))",
        "primary-300": "oklch(var(--primary-300))",
        "primary-300-content": "oklch(var(--primary-300-content))",
        "primary-200": "oklch(var(--primary-200))",
        "primary-200-content": "oklch(var(--primary-200-content))",
        "primary-100": "oklch(var(--primary-100))",
        "primary-100-content": "oklch(var(--primary-100-content))",

        "secondary-500": "oklch(var(--secondary-500))",
        "secondary-400": "oklch(var(--secondary-400))",
        "secondary-400-content": "oklch(var(--secondary-400-content))",
        "secondary-300": "oklch(var(--secondary-300))",
        "secondary-300-content": "oklch(var(--secondary-300-content))",
        "secondary-200": "oklch(var(--secondary-200))",
        "secondary-200-content": "oklch(var(--secondary-200-content))",
        "secondary-100": "oklch(var(--secondary-100))",
        "secondary-100-content": "oklch(var(--secondary-100-content))",

        "neutral-700": "oklch(var(--neutral-700))",
        "neutral-600": "oklch(var(--neutral-600))",
        "neutral-600-content": "oklch(var(--neutral-600-content))",
        "neutral-500": "oklch(var(--neutral-500))",
        "neutral-500-content": "oklch(var(--neutral-500-content))",
        "neutral-400": "oklch(var(--neutral-400))",
        "neutral-400-content": "oklch(var(--neutral-400-content))",
        "neutral-300": "oklch(var(--neutral-300))",
        "neutral-300-content": "oklch(var(--neutral-300-content))",
        "neutral-200": "oklch(var(--neutral-200))",
        "neutral-200-content": "oklch(var(--neutral-200-content))",
        "neutral-100": "oklch(var(--neutral-100))",
        "neutral-100-content": "oklch(var(--neutral-100-content))",

        "danger-500": "oklch(var(--danger-500))",
        "danger-400": "oklch(var(--danger-400))",
        "danger-400-content": "oklch(var(--danger-400-content))",
        "danger-300": "oklch(var(--danger-300))",
        "danger-300-content": "oklch(var(--danger-300-content))",
        "danger-200": "oklch(var(--danger-200))",
        "danger-200-content": "oklch(var(--danger-200-content))",
        "danger-100": "oklch(var(--danger-100))",
        "danger-100-content": "oklch(var(--danger-100-content))",

        "warning-500": "oklch(var(--warning-500))",
        "warning-400": "oklch(var(--warning-400))",
        "warning-400-content": "oklch(var(--warning-400-content))",
        "warning-300": "oklch(var(--warning-300))",
        "warning-300-content": "oklch(var(--warning-300-content))",
        "warning-200": "oklch(var(--warning-200))",
        "warning-200-content": "oklch(var(--warning-200-content))",
        "warning-100": "oklch(var(--warning-100))",
        "warning-100-content": "oklch(var(--warning-100-content))",

        "success-500": "oklch(var(--success-500))",
        "success-400": "oklch(var(--success-400))",
        "success-400-content": "oklch(var(--success-400-content))",
        "success-300": "oklch(var(--success-300))",
        "success-300-content": "oklch(var(--success-300-content))",
        "success-200": "oklch(var(--success-200))",
        "success-200-content": "oklch(var(--success-200-content))",
        "success-100": "oklch(var(--success-100))",
        "success-100-content": "oklch(var(--success-100-content))",

        "info-500": "oklch(var(--info-500))",
        "info-400": "oklch(var(--info-400))",
        "info-400-content": "oklch(var(--info-400-content))",
        "info-300": "oklch(var(--info-300))",
        "info-300-content": "oklch(var(--info-300-content))",
        "info-200": "oklch(var(--info-200))",
        "info-200-content": "oklch(var(--info-200-content))",
        "info-100": "oklch(var(--info-100))",
        "info-100-content": "oklch(var(--info-100-content))",
      },
      animation: {
        sliding: "sliding 30s linear infinite",
      },
      boxShadow: {
        "3xl":
          "0px 0px 0px 0px rgba(0, 0, 0, 0.05), 0px -1px 2px 0px rgba(0, 0, 0, 0.05), 0px -4px 4px 0px rgba(0, 0, 0, 0.04), 0px -8px 5px 0px rgba(0, 0, 0, 0.03), 0px -15px 6px 0px rgba(0, 0, 0, 0.01), 0px -23px 7px 0px rgba(0, 0, 0, 0.00)",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      fontFamily: {
        "primary": ["var(--font-primary)"],
        "secondary": ["var(--font-secondary)"],
        "tertiary": ["var(--font-tertiary)"],
      },
      lineHeight: {
        "3.5": "0.875rem",
      },
    },
  },
} satisfies Config;
