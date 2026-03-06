## Formatting

Visible date format can be changed by the **format** prop. The default format is **DD/MM/YYYY**. All the props but
the **order** is optional. Each one of them has default values stated below.

```tsx
type DateFormat = {
  // The order of the date parts
  order: ("day" | "month" | "year")[];
  // The prefix of the date parts. It is possible to prepend any string to the date parts.
  prefix?: string[];
  // default: /
  delimiter?: string;
  // default: DD
  dayFormat?: "DD" | "D";
  // default: MM
  monthFormat?: "MM" | "M";
  // default: YYYY
  yearFormat?: "YYYY" | "YY";
};
```

#### Examples

```tsx
{
  order: ["day", "month", "year"],
  delimiter: " ",
  yearFormat: "YY"
}
// Result -> 31 01 24

{
  order: ["month", "year"],
  delimiter: "",
  prefix:["(", ")-"]
}
// Result -> (12)-2024

{
  order: ["day", "month", "year"],
  delimiter: "--",
  dayFormat: "D",
  monthFormat: "M",
  yearFormat: "YY"
}
// Result -> 1--1--24
```
