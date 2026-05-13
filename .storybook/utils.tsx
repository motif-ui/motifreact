import { JSX, FC } from "react";

export const iconOptions = {
  undefined: undefined,
  string: "motif_ui",
  "<i>": <i className="bi bi-airplane" />,
  "<span>": <span className="material-symbols-outlined">thumb_up</span>,
  "<svg>": (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5 3 4v4c0 3 2 5 5 6 3-1 5-3 5-6V4z" />
    </svg>
  ),
} as const;

export const iconDecorator = (StoryComponent: FC): JSX.Element => (
  <>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
    <StoryComponent />
  </>
);
