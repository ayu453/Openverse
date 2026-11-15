import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./features/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#0b1020", panel: "#111a2e", line: "#25314a", mint: "#8ff0c5", violet: "#a99bff" }, boxShadow: { glow: "0 0 80px rgba(143, 240, 197, 0.12)" } } },
  plugins: []
};
export default config;
