## MotifIcon & MotifIconButton

This components are extending the current `<Icon>` and `<IconButton>` components to use
a very small subset of icons internally.

### Which icons are available?

Available icons are listed in [selection.icomoon.json](./assets/selection.icomoon.json) and also in [MotifIcon.module.scss](./MotifIcon.module.scss)
file as the css class names.

To verify all available icons, navigate to the hidden Storybook story **Chromatic/MotifIcon**. This story is visible in Storybook but tagged with `!dev` and `!autodocs` to hide it from the sidebar.

### How to add new icons?

Font icons are generated using the `IcoMoon` app. The required json file to restore the current IcoMoon project is [selection.json](./assets/selection.json).

When the project is restored into **IcoMoon**, new icons can be added by importing new SVG files and downloading the updated font bundle. **Note:** IcoMoon now automatically generates all font formats (.ttf, .woff, .woff2), eliminating the need for manual conversion.

#### Step by step guide

1. Prepare SVG files from Figma:
   1. Select the icon above Icon section inside Figma.
   2. On the right bottom side of the panel exporting is possible, exported format should be SVG.
   3. Exported SVG could be directly imported into IcoMoon.

2. Open [IcoMoon app](https://app.icomoon.io) in your browser.

3. Click **Import** and select the [selection.json](./assets/selection.json) file to restore the current project.

4. Click **Load** to load the existing icons into the editor.

5. In the left sidebar, click **Select** and choose the new SVG files you prepared from Figma.

6. The selected icons will appear in the middle panel alongside existing icons.

7. Fill in the name fields for the new icons if needed.

8. Click **Export** in the left sidebar.

9. In the Export section, click **Download** to download the font package.

10. The downloaded package includes:
    - `selection.icomoon.json` (the project file)
    - Font files in all formats: `.ttf`, `.woff`, and `.woff2`

11. Overwrite the existing font files in [./assets/fonts/](./assets/fonts/) folder with the new ones:
    - `motif-icons-default.ttf`
    - `motif-icons-default.woff`
    - `motif-icons-default.woff2`

12. Replace the [selection.json](./assets/selection.json) file with the newly downloaded one. Remove any old selection files (e.g., `selection.json`) to keep the assets folder clean.

13. Update the icon class names in [MotifIcon.module.scss](./MotifIcon.module.scss) file with the new ones from the exported `style.css` file.
