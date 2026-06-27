import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 1. Disable 'any' check (Luxury fix for fast builds)
      "@typescript-eslint/no-explicit-any": "off",
      
      // 2. Unused vars only as warning
      "@typescript-eslint/no-unused-vars": "warn",
      
      // 3. Allow standard <img> tags (Cloudinary/External images ke liye easier hai)
      "@next/next/no-img-element": "off",
      
      // 4. Disable unescaped entities (apostrophes etc.)
      "react/no-unescaped-entities": "off",
      
      // 5. Disable hydration cascading render warnings
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;