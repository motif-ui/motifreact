export default {
  "*.{js,jsx,mjs,cjs,ts,tsx}": ["npm run lint:staged"],
  "*.{js,jsx,mjs,cjs,ts,tsx,css,scss,md,mdx,html}": ["prettier --write"],
  "*.{scss}": ["npm run check:scss"],
  "*.{ts,tsx}": () => "npm run check:type",
};
