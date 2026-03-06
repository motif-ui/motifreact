# Contributing to Motif UI 🚀

Hey there 👋

First of all — thank you for even thinking about contributing to **Motif UI**.

**Motif UI** is the React component library of the Motif Design System. The goal is simple: **Make it easy and enjoyable
to build consistent, scalable, beautiful interfaces.** We always welcome contributions to make this ✌**our**✌ goal.

### Ways of contribute

- 🐛 Found a bug
- ✨ Build a new component
- 📚 Improve documentation
- 🧪 Strengthen tests
- 💡 Suggest an idea
- 📣 Share the project

### The flow

- Decide your contribution.
- Always check the issues and PRs before starting to work on something.
- Now you can start working on your code.
- Always make sure to follow the code style and write tests for your code (We know for the UI, it is hard, but we
  believe that you will do your best!). Don't worry, we got you covered with scripts and jobs to achieve this 😉
- Submit your PR and wait for the review. We will try to review your PR as soon as possible, but please be patient with
  us and always remember we have other things to do as well 🙏
- We will review, help and do our best to get your PR merged as soon as possible.
- Your PR is merged 🎉 and you are now a contributor to the project. Welcome to the family! 🥳

## 🧑‍💻 Development Setup

In order to begin, fork the [repo](https://github.com/motif-ui/motifreact), clone your fork and create a feature branch.

```bash
git clone https://github.com/<your-username>/motifreact.git
cd motifreact
git checkout -b feature-name
```

Install dependencies with npm

```bash
npm install
```

Motif UI uses NextJS out of the box, so you can run the development server with the script below. This starts the
development playground app where you can develop components, check styles and see changes instantly.

```bash
npm run dev
```

And that's it 🚀 You can now use the components simply by just putting them into `src/app/page.tsx` and see the changes
in [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

We use [Storybook](https://storybook.js.org) for effortless documentation. For your new component, you should create a
new story file in components folder. You can check the existing story files for reference.

To run Storybook, use the following command:

```bash
npm run storybook
```

Then you can see the documentation in [http://localhost:6006](http://localhost:6006) and check your new component's story there. You can also
add more stories to show different states of your component if necessary and make it easier for others to understand
how to use it.

## 🏗 Project Structure

```
motifreact/
├── src/
│   ├── app/
│   ├── docs/
│   ├── lib/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── motif/
│   │   ├── styles/
│   │   ├── types/
│   │   └── index.ts
│   ├── scripts/
│   └── utils/
└── package.json
```

## 📜 Rules to Follow

- We love typescript, we develop in typescript, and we want you to develop in typescript as well.
- For styling, css modules are used and BEM-style class naming convention has to be followed.
- You can use all the power of SCSS 💪
- Do not use hardcoded values for colors, spacing, typography, etc. Always use design tokens.
- Always write tests for your code. We use Jest and React Testing Library for testing.
- Functional programming is our friend, so we prefer to write pure functions and avoid side effects as much as possible.
- ES6 features are highly encouraged, so push yourself to use arrow functions, destructuring, spread/rest operators, etc.

### 💬 PR Title Rules

We follow the [Conventional Commits](https://www.conventionalcommits.org) specification, not in the commits but in the PR title to make the life easier
for you. So please make sure following the rules in the table below:

| Commit Type | Description                                                                  | Version Effect |
| ----------- | ---------------------------------------------------------------------------- | -------------- |
| `perf`      | Big structural change that affects the whole library                         | X . _ . _      |
| `feat`      | New feature or a significant change                                          | _ . X . _      |
| `fix`       | Bug fix and other minor stuff                                                | _ . _ . X      |
| docs        | Documentation changes                                                        | N/A            |
| style       | Style or Css changes that does not affect the library in general             | N/A            |
| refactor    | Every code change which does not add a new feature or bugfix                 | N/A            |
| test        | Test related changes                                                         | N/A            |
| chore       | Operational changes that possible affects the build process or related stuff | N/A            |
| build       | Might be stated as the new version of `chore`                                | N/A            |
| ci          | Changes that are related with Continuous integration and pipelines           | N/A            |
| revert      | Work to make rollback for non-fix changes                                    | N/A            |

Here are some good examples for you:

- feat(ui): Add `Button` component
- fix: The unnecessary margin between table cells

## 🧩 Component Development

- Every component must be developed in `src/lib/components` folder with its own folder named in **PascalCase**.
- The folder must contain at least the following files (e.g. MyComponent):

```
MyComponent/
├── MyComponent.tsx
├── MyComponent.module.scss
├── MyComponent.stories.tsx
├── MyComponent.test.tsx
├── index.ts
└── types.ts
```

#### Important notes:

- Some of the component props can be defaultable, so you should use `usePropsWithThemeDefaults` hook to get the props with theme defaults applied.
- You should retrieve your class names by using `sanitizeModuleRootClasses` to maintain the css class name uniqueness.
- `.Root` class name must be defined in the module scss file for the root element of the component.
- When there is a default value for an optional prop, it should be defined as default in the storybook file as well, so that it will be visible in the documentation.
- Test file should start with a **snapshot** and **default value control** test to ensure that the component renders correctly and to catch any unexpected changes in the future.
- Every component must have a ref forwarding and style props. You can use `PropsWithRef` type for this purpose.
- Please;
  - Choose arrow functions for your component implementation,
  - Use **just** your props type as the parameter type,
  - Default export the component,
  - Fill the relevant index.ts files.
- If more files are needed, you may create them as well, but try to keep the component folder clean and organized. For example, if your component has a sub component, you can create a sub folder for it and put the relevant files there.
- It is always a good idea to check the existing components for reference.

#### Example:

```tsx
import styles from './MyComponent.module.scss';
import usePropsWithThemeDefaults from "src/hooks/usePropsWithThemeDefaults";
import type { MyComponentProps, PropsWithRef } from './types';

const MyComponent = (props: PropsWithRef<MyComponentProps>) => {
  const { label, size, className, ref } = usePropsWithThemeDefaults(props, 'MyComponent');
  const classNames = sanitizeModuleRootClasses(styles, className, [size]);
  return (
    <div className={styles.myComponent} ref={ref}>
      {label} - {size}
    </div>
  );
};
MyComponent.displayName = "MyComponent";
export default MyComponent;
```
