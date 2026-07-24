import { useState, useCallback, useEffect, useRef } from "react";
import InputText from "@/components/Motif/InputText/InputText";
import styles from "../NavBar.module.scss";
import { useMotifContext } from "../../../motif/context/MotifProvider";
import { useOutsideClick } from "src/lib/hooks";
import { sanitizeModuleClasses } from "src/utils/cssUtils.ts";
import NavBarSearchResults from "@/components/NavBar/components/NavBarSearchResults.tsx";
import { NavBarSearchProps } from "@/components/NavBar/types.ts";

const NavBarSearch = (props: NavBarSearchProps) => {
  const { t } = useMotifContext();
  const {
    placeholder = t("g.search"),
    onPressEnter,
    pill,
    results = [],
    onResultClick,
    onButtonClick,
    onClear,
    searching,
    visibleContainerSize = "md",
  } = props;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const ref = useRef<HTMLDivElement>(null);
  const refSearchResult = useOutsideClick<HTMLUListElement>(() => setMaybeShowResults(false), [ref]);
  const [maybeShowResults, setMaybeShowResults] = useState(true);

  const onEnterPressed = useCallback(
    (evt: KeyboardEvent) => {
      evt.preventDefault();
      evt.key === "Enter" && onPressEnter!(searchQuery);
    },
    [onPressEnter, searchQuery],
  );

  useEffect(() => {
    const inputRef = ref.current?.querySelector("input");
    if (!inputRef || !onPressEnter) {
      return;
    }
    inputRef.addEventListener("keyup", onEnterPressed);
    return () => inputRef.removeEventListener("keyup", onEnterPressed);
  }, [onEnterPressed, onPressEnter]);

  const searchBoxClasses = sanitizeModuleClasses(styles, "searchBox", pill && "pill");

  return (
    <div className={searchBoxClasses}>
      <InputText
        size="md"
        pill={pill}
        clearable
        placeholder={placeholder}
        onChange={val => setSearchQuery(val as string)}
        onClearClick={() => {
          setSearchQuery("");
          onClear?.();
        }}
        onClick={results.length && !maybeShowResults ? () => setMaybeShowResults(true) : undefined}
        ref={ref}
        buttonRight={{
          name: "search",
          onClick: () => {
            setMaybeShowResults(true);
            onButtonClick?.(searchQuery);
          },
        }}
        {...(searching && { loader: true, disabled: true })}
        className={styles.searchInput}
      />
      {!!results.length && maybeShowResults && (
        <NavBarSearchResults
          onResultClick={value => {
            onResultClick?.(value);
            setMaybeShowResults(false);
          }}
          results={results}
          visibleContainerSize={visibleContainerSize}
          ref={refSearchResult}
        />
      )}
    </div>
  );
};

export default NavBarSearch;
