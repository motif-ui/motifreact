export default {
  "*.{js,jsx,ts,tsx}": ["npm run lint:staged"],
  "*.{js,jsx,ts,tsx,css,scss,md,mdx,html}": ["prettier --write"],
  "*.{ts,tsx}": () => "npm run type-check",
};
