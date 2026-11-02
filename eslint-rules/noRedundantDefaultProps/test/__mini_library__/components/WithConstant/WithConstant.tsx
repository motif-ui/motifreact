const DEFAULT_SIZE = "lg";
const DEFAULT_PILL = true;
const DEFAULT_COUNT = -1;

type WithConstantProps = { size?: string; pill?: boolean; count?: number };

const WithConstant = ({ size = DEFAULT_SIZE, pill = DEFAULT_PILL, count = DEFAULT_COUNT }: WithConstantProps) => (
  <div data-size={size} data-pill={pill} data-count={count} />
);

export default WithConstant;
