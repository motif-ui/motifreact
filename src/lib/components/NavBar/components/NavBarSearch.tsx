import { useState, useCallback, useEffect, useRef } from "react";
import InputText from "@/components/InputText";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import styles from "../NavBar.module.scss";

export type NavBarSearchProps = {
  placeholder?: string;
  onSubmit: (query: string) => void;
  pill?: boolean;
};

const NavBarSearch = (props: NavBarSearchProps) => {
  const { placeholder = "Ara...", onSubmit, pill } = props;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const ref = useRef<HTMLDivElement>(null);

  const onEnterPressed = useCallback(
    (evt: KeyboardEvent) => {
      evt.preventDefault();
      evt.key === "Enter" && onSubmit(searchQuery);
    },
    [onSubmit, searchQuery],
  );

  useEffect(() => {
    const inputRef = ref.current?.querySelector("input");
    if (inputRef) {
      inputRef.addEventListener("keyup", onEnterPressed);
      return () => inputRef.removeEventListener("keyup", onEnterPressed);
    }
  }, [onEnterPressed]);

  return (
    <InputText
      pill={pill}
      placeholder={placeholder}
      onChange={val => setSearchQuery(val as string)}
      iconLeft={<MotifIcon name="search" />}
      ref={ref}
      className={styles.searchBox}
    />
  );
};

export default NavBarSearch;
