export default {
  "*.{js,jsx,ts,tsx}": ["npm run lint:staged"],
  "*.{js,jsx,ts,tsx,css,scss,md,mdx,html}": ["prettier --write"],
  "*.{scss}": ["npm run check:scss"],
  "*.{ts,tsx}": () => "npm run check:type",
};
