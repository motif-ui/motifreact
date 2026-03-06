export const sortByType = (a: unknown, b: unknown, type: string) => {
  switch (type) {
    case "string":
      return sortStrings(a as string, b as string);
    case "number":
      return sortNumbers(a as number, b as number);
    case "boolean":
      return sortBoolean(a as boolean, b as boolean);
    case "object":
      return sortObjects(a, b);
    default:
      return 0;
  }
};

const sortStrings = (s1: string, s2: string) => s1.localeCompare(s2);

const sortNumbers = (n1: number, n2: number) => n1 - n2;

const sortBoolean = (b1: boolean, b2: boolean) => (b1 === b2 ? 0 : b1 ? 1 : -1);

const sortObjects = (a: unknown, b: unknown) => {
  if (!a || !b) {
    return a === b ? 0 : !a ? -1 : 1;
  }
  return 0;
};
