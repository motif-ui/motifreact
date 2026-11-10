import { Markdown } from "@storybook/addon-docs/blocks";
import UploadDoc from "./UploadDoc.md?raw";

const TOC_HEADING = /^(#{2,3}) (.+)$/gm;

// Same as the Markdown block's default slugify for plain ASCII headings
const slugify = (text: string) =>
  text
    .replace(/[^a-z0-9- ]/gi, "")
    .replace(/ /g, "-")
    .toLowerCase();

/**
 * The Markdown block gives headings with the same text the same id, so "On this page" links of repeated headings
 * (e.g. "Type Definition") all go to the first one. This gives each repeated heading a unique id instead.
 */
const withUniqueHeadingIds = (doc: string) => {
  const seen = new Map<string, number>();
  return doc.replace(TOC_HEADING, (line, hashes: string, text: string) => {
    const slug = slugify(text);
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (!count) return line;
    const tag = `h${hashes.length}`;
    return `<${tag} id="${slug}-${count}">${text}</${tag}>`;
  });
};

const uploadDoc = withUniqueHeadingIds(UploadDoc);

/**
 * Shared docs of the Upload components. Examples are written with UploadList, so they are shown with the given component.
 */
export const UploadDocs = ({ component }: { component: string }) => <Markdown>{uploadDoc.replaceAll("UploadList", component)}</Markdown>;
