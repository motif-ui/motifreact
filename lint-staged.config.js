export default {
  "*.{js,jsx,ts,tsx}": ["npm run lint:staged"],
  "*.{js,jsx,ts,tsx,css,scss,md,mdx,html}": ["prettier --write"],
  "*.{scss}": ["npm run scss-check"],
  "*.{ts,tsx}": () => "npm run type-check",
};
