import { forwardRef } from "react";

type ForwardRefedProps = { variant?: string; max?: number };

const ForwardRefed = forwardRef<HTMLDivElement, ForwardRefedProps>((props, ref) => {
  const { variant = "primary", max = 10 } = props;
  return <div ref={ref} data-variant={variant} data-max={max} />;
});

export default ForwardRefed;
