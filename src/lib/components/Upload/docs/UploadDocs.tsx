import { Markdown } from "@storybook/addon-docs/blocks";
import CustomMessagesDoc from "./customMessage.md?raw";
import FileActionsDoc from "./fileActions.md?raw";

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
const withUniqueHeadingIds = (docs: string[]) => {
  const seen = new Map<string, number>();
  return docs.map(doc =>
    doc.replace(TOC_HEADING, (line, hashes: string, text: string) => {
      const slug = slugify(text);
      const count = seen.get(slug) ?? 0;
      seen.set(slug, count + 1);
      if (!count) return line;
      const tag = `h${hashes.length}`;
      return `<${tag} id="${slug}-${count}">${text}</${tag}>`;
    }),
  );
};

const [customMessages, fileActions] = withUniqueHeadingIds([CustomMessagesDoc, FileActionsDoc]);

/**
 * Shared docs of the Upload components.
 */
export const UploadDocs = () => (
  <>
    <Markdown>{customMessages}</Markdown>
    <Markdown>{fileActions}</Markdown>
  </>
);
