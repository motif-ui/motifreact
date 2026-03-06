import "./colorPalette.scss";
import { capitalizeFirstLetter } from "src/utils/utils";
import { isBright } from "src/utils/cssUtils";
import { BASE_COLORS, ColorItemType, COLORS, ColorSectionProps, generateColorData, ColorVariant } from "./colorPaletteHelper";

const ColorItem = ({ tone, cssVar, hex }: ColorItemType) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const textColor = isBright(r, g, b) ? "#121826 " : "#FFFFFF";

  return (
    <span className="color-swatch" style={{ backgroundColor: `var(${cssVar})`, color: textColor }}>
      {tone}
    </span>
  );
};

const ColorSection = ({ title, data }: ColorSectionProps) => {
  return (
    <section className="color-section">
      <h2>{title}</h2>
      <div className="color-grid">
        {data.map(item => (
          <ColorItem key={item.tone} {...item} />
        ))}
      </div>
    </section>
  );
};

const ColorTableRow = ({ item }: { item: ColorItemType }) => {
  return (
    <tr>
      <td>
        <div className="color-table-swatch" style={{ backgroundColor: `var(${item.cssVar})` }} />
      </td>
      <td>
        <code>{item.hex}</code>
      </td>
      <td>
        <code>{item.token}</code>
      </td>
      <td>
        <code>{item.cssVar}</code>
      </td>
    </tr>
  );
};

const ColorTable = ({ data }: ColorSectionProps) => {
  return (
    <section className="color-section">
      <table className="color-table">
        <thead>
          <tr>
            <th>Swatch</th>
            <th>Hex Code</th>
            <th>Token</th>
            <th>CSS Var</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <ColorTableRow key={item.tone} item={item} />
          ))}
        </tbody>
      </table>
    </section>
  );
};

export const ColorPalettePage = () => {
  const variants = Object.keys(COLORS) as ColorVariant[];

  return (
    <div className="color-page">
      <div>
        <ColorSection title="Base" data={BASE_COLORS} />
        <ColorTable data={BASE_COLORS} />
      </div>

      {variants.map(v => {
        const data = generateColorData(v);
        return (
          <div key={v}>
            <ColorSection title={capitalizeFirstLetter(v)} data={data} />
            <ColorTable data={data} />
          </div>
        );
      })}
      <hr />
    </div>
  );
};
