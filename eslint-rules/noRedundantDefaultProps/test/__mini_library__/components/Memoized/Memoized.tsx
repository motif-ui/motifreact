import { memo } from "react";

type MemoizedProps = { size?: string; disabled?: boolean };

const Memoized = ({ size = "md", disabled = false }: MemoizedProps) => <div data-size={size} aria-disabled={disabled} />;

export default memo(Memoized);
