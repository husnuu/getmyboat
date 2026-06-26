import preset from "@getyourboat/config/tailwind";

/** @type {import("tailwindcss").Config} */
const config = {
  presets: [preset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
