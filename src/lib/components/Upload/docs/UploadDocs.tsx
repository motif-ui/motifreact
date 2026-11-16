import { Markdown } from "@storybook/addon-docs/blocks";
import UploadDoc from "./UploadDoc.md?raw";

/**
 * Shared docs of the Upload components. Examples are written with UploadList, so they are shown with the given component.
 */
export const UploadDocs = ({ component }: { component: string }) => <Markdown>{UploadDoc.replaceAll("UploadList", component)}</Markdown>;
