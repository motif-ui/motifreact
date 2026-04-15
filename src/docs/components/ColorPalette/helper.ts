export type ColorItemType = {
  tone: string;
  cssVar: string;
  token: string;
  hex: string;
};

export type ColorSectionProps = {
  title?: string;
  data: ColorItemType[];
};
export type ColorVariant = "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "danger" | "neutral" | "grayscale";

export const COLORS = {
  primary: ["#EEF2FF", "#E0E7FF", "#C7D2FE", "#A5B4FC", "#818CF8", "#6366F1", "#4F46E5", "#4338CA", "#3730A3", "#312E81"],
  secondary: ["#F5F3FF", "#EDE9FE", "#DDD6FE", "#C4B5FD", "#A78BFA", "#8B5CF6", "#7C3AED", "#6D28D9", "#5B21B6", "#4C1D95"],
  accent: ["#FDF4FF", "#FAE8FF", "#F5D0FE", "#F0ABFC", "#E879F9", "#D946EF", "#C026D3", "#A21CAF", "#86198F", "#701A75"],
  info: ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A"],
  success: ["#F0FDF4", "#DCFCE7", "#BBF7D0", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A", "#15803D", "#166534", "#14532D"],
  warning: ["#FFFBEB", "#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F"],
  danger: ["#FEF2F2", "#FEE2E2", "#FECACA", "#FCA5A5", "#F87171", "#EF4444", "#DC2626", "#B91C1C", "#991B1B", "#7F1D1D"],
  neutral: ["#FAFAFA", "#F5F5F5", "#E5E5E5", "#D4D4D4", "#A3A3A3", "#737373", "#525252", "#404040", "#262626", "#171717"],
  grayscale: ["#F9FAFB", "#F3F4F6", "#E5E7EB", "#D1D5DB", "#9CA3AF", "#6B7280", "#4B5563", "#374151", "#1F2937", "#111827"],
} as const;

const TONES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

export const BASE_COLORS: ColorItemType[] = [
  { tone: "White", cssVar: "--theme-color-semantic-base-white", token: "theme.color.semantic.base.white", hex: "#FFFFFF" },
  { tone: "Black", cssVar: "--theme-color-semantic-base-black", token: "theme.color.semantic.base.black", hex: "#000000" },
];

export const generateColorData = (variant: ColorVariant): ColorItemType[] => {
  const colors = COLORS[variant];
  return colors.map((hex, i) => ({
    tone: TONES[i],
    cssVar: `--theme-color-semantic-${variant}-${variant}-${TONES[i]}`,
    token: `theme.color.semantic.${variant}.${variant}-${TONES[i]}`,
    hex,
  }));
};
