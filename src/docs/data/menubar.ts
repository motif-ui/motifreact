import { MenuItemProps } from "@/components/NavBar/components/NavBarMenu/types";

export const menuItemsForDocs: MenuItemProps[] = [
  { label: "Home", icon: "home", href: "https://motif-ui.com/", active: true },
  {
    label: "Services",
    icon: "folder",
    items: [
      { label: "Basic", icon: "blind", href: "https://motif-ui.com/" },
      { label: "Middle Tier" },
      {
        label: "Premium",
        items: [
          {
            label: "Email Services",
            icon: "home",
            items: [
              { label: "< 10000 Emails", onClick: () => alert("< 10000 Emails") },
              { label: "> 10000 Emails", onClick: () => alert("> 10000 Emails") },
            ],
          },
          {
            label: "Social Media Related",
            items: [{ label: "Youtube Videos", onClick: () => alert("Youtube Videos") }, { label: "Other Services" }],
          },
        ],
      },
    ],
  },
  { label: "Contact", onClick: () => alert("Contact") },
];

export const menuItemsForDocsSimple = [
  { label: "Home", icon: "home" },
  { label: "Contact", icon: "mail", items: [{ label: "Email" }, { label: "Phone" }] },
];
