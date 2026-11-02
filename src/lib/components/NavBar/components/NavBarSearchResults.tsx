import styles from "@/components/NavBar/NavBar.module.scss";
import { PropsWithRef } from "src/lib/types.ts";
import { NavBarSearchResultsProps } from "@/components/NavBar/types.ts";

const containerSizes = { sm: 116, md: 194, lg: 272 };

const NavBarSearchResults = (props: PropsWithRef<NavBarSearchResultsProps, HTMLUListElement>) => {
  const { onResultClick, results, visibleContainerSize, ref } = props;

  return (
    <ul className={styles.searchResults} ref={ref} style={{ maxHeight: containerSizes[visibleContainerSize!] }} role="listbox">
      {results!.map(({ text, value }, idx) => (
        <li key={idx}>
          <button onClick={() => onResultClick?.(value)} type="button">
            {text}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NavBarSearchResults;
