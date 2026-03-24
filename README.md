# Motif UI React

A comprehensive React component library initially designed for the [Turkish e-Government Gateway](https://turkiye.gov.tr)
internal projects. This library provides a collection of accessible, customizable, and production-ready UI components
following Motif UI design system guidelines, created and maintained by [TÜRKSAT](https://turksat.com.tr/)'s e-Government
Application Development Department.

🌐 Website 👉 https://motif-ui.com

📄 Documentation 👉 https://storybook.motif-ui.com

## Features

- ⚛️ **Modern React components** built with TypeScript
- 🧩 **Fully typed** with TypeScript definitions
- 📦 **Supports both ESM and CommonJS** module formats
- 🎨 **Themeable components** powered by design tokens
- ♿ **Accessible & WCAG-compliant** _(coming soon)_
- 📚 **Comprehensive Storybook** documentation
- 🚀 **Production-ready and tested**

## Installation

### 1. Install the core package

```bash
npm i @motif-ui/react @fontsource/inter
```

> [!NOTE]
> Motif UI React requires `React 19.2.3` or higher. Make sure you have the matching packages installed:

### 2. Wrap with Provider

```jsx
import { MotifProvider } from "@motif-ui/react";

function App() {
  return (
    <MotifProvider>
      {/* Your app content */}
    </MotifProvider>
  );
}
```

### 3. Import A Theme

```jsx
// import { MotifProvider } from '@motif-ui/react';
import "@motif-ui/react/themes/default-theme.css";

/* function App() {
  return (
    <MotifProvider>
      Your app content
    </MotifProvider>
  );
} */
```

And that's it! 🥳

Now you can import and use components in your application:

```jsx
import { Button } from "@motif-ui/react";

export const MyComponent = () => {
  return (
    <Button variant="primary">My Fancy Button</Button>
  );
}
```

## Development

This library is built on top of Next.js, which is used primarily to reduce boilerplate code rather than for its runtime features. This makes local development and component testing straightforward.

### Getting Started

1. Clone the repository

2. Install dependencies:

```bash
npm install
```

3. Develop and test your components

   _For quick component testing during development, you can use Next.js dev server directly or storybook locally :_

```bash
npm run dev
npm run storybook
```

4. Build the library:

```bash
npm run build:lib
```

This will generate ESM and CommonJS builds in the `/dist` folder.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](.github/CONTRIBUTING.md) for details on:

- Branch naming conventions
- Commit message format
- Pull request process
- Code style guidelines

Thank you all ❤️ We couldn't make this happen without you:

<a href="https://github.com/motif-ui/motifreact/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=motif-ui/motifreact" alt="Contributors" />
</a>

## License

See [LICENSE](LICENSE.md) file for details.

## Support

For issues, questions, or contributions, please open an issue on our GitHub repository.
