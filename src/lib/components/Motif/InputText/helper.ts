export const applyTextTransform = (value: string, textTransform: string) => {
  switch (textTransform) {
    case "uppercase":
      return value.toUpperCase();
    case "lowercase":
      return value.toLowerCase();
    case "capitalize":
      return value.replace(/(^|\s)\S/g, char => char.toUpperCase());
    default:
      return value;
  }
};
