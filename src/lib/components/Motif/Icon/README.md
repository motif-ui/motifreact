## MotifIcon & MotifIconButton

This components are extending the current `<Icon>` and `<IconButton>` components to use
a very small subset of icons internally.

### Which icons are available?

Available icons are listed in [selection.json](./assets/selection.json) and also in [MotifIcon.module.scss](./MotifIcon.module.scss)
file as the css class names.

### How to add new icons?

Font icon is generated using `IcoMoon` app. The required json file to restore the current
IcoMoon project is [selection.json](./assets/selection.json).

When the project is restored into **Icomoon**, new icons can be added by importing the new SVG files.
Then the new font should be downloaded.

### Step by step guide

1. Open the [selection.json](./assets/selection.json) file in **Icomoon** app.
2. Import the new SVG files. (New icons could be exported from figma as SVG.)
   1. Select the icon above Icon section inside Figma.
   2. On the right bottom side of the panel exporting is possible, exported format should be SVG.
   3. Exported SVG could be directly imported into IcoMoon.
3. Do not forget to select the new icons.
4. Fill the empty name fields for the new icons (fi area under the selected icon).
5. Download the new font files.
6. Overwrite the existing font files in [./assets/fonts/](./assets/fonts/) folder with the new ones:
   - `motif-icons-default.ttf`
   - `motif-icons-default.woff`
   - `motif-icons-default.woff2` (convert woff to woff2 with online tool)
7. Replace the [selection.json](./assets/selection.json) file with the new one.
8. Change individual icon classes in [MotifIcon.module.scss](./MotifIcon.module.scss) file with the new ones in the new `style.css` file.
