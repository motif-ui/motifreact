import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ReactNode } from "react";
import FileInput from "@/components/Upload/FileInput";
import Form, { Validations } from "@/components/Form";
import { InputSize } from "../../Form/types";
import { simulateChooseFiles } from "@/components/Upload/testHelper";
import { MESSAGE } from "@/components/Upload/constants";
import { runSnapshotDefaultsAndStandardPropsTest, t } from "../../../../utils/testUtils";
import { StandardPropsWithRef } from "../../../types";
import { formatBytes, shortenText } from "../../../../utils/utils";

const createFile = (name: string, type: string, size = 1024) => {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

const PDF = createFile("report.pdf", "application/pdf");
const PNG = createFile("photo.png", "image/png");
const GIF = createFile("animation.gif", "image/gif");
const BIG_PNG = createFile("big.png", "image/png", 2_000_000);

describe("FileInput", () => {
  const renderExt = (ui: ReactNode) => {
    const result = render(ui);
    const getRoot = () => result.getByTestId("fileInput");
    const getInput = () => result.container.querySelector("input[type=file]") as HTMLInputElement;
    const getBrowseButton = () => screen.queryByText(t("g.browse"))?.closest("button") as HTMLButtonElement;
    const getDeleteButton = () => screen.queryByText("delete")?.closest("button") ?? null;
    return { ...result, getRoot, getInput, getBrowseButton, getDeleteButton };
  };

  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<HTMLDivElement>) => render(<FileInput {...props} />), {
    assertDefaults: ({ container }) => {
      // size: md
      expect(container.firstElementChild).toHaveClass("md");
      // maxFile: 1
      expect(container.querySelector("input")?.multiple).toBe(false);
    },
  });

  it("should pass name, accept and multiple to the native file input", () => {
    const { getInput } = renderExt(<FileInput name="files" accept={["application/pdf", "image/png"]} maxFile={2} />);
    expect(getInput()).toHaveAttribute("name", "files");
    expect(getInput()).toHaveAttribute("accept", "application/pdf,image/png");
    expect(getInput().multiple).toBe(true);
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { getRoot } = renderExt(<FileInput size={size} />);
      expect(getRoot()).toHaveClass(size);
      cleanup();
    });
  });

  it("should call onChange with the selected files and replace them on a new selection", async () => {
    const onChange = jest.fn();
    const { getInput, getRoot } = renderExt(<FileInput maxFile={3} onChange={onChange} />);

    await simulateChooseFiles(getInput(), [PDF]);
    expect(onChange).toHaveBeenLastCalledWith([PDF]);
    expect(getRoot()).toHaveTextContent(PDF.name);

    await simulateChooseFiles(getInput(), [PNG, GIF]);
    expect(onChange).toHaveBeenLastCalledWith([PNG, GIF]);
    expect(getRoot()).toHaveTextContent(t("upload.filesSelected", { count: 2 }));
  });

  it("should leave a file over maxSize out of onChange and report it to onError", async () => {
    const onChange = jest.fn();
    const onError = jest.fn();
    const maxSize = 1_000_000;
    const { getInput, getRoot } = renderExt(<FileInput maxSize={maxSize} onChange={onChange} onError={onError} />);

    await simulateChooseFiles(getInput(), [BIG_PNG]);

    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(onError).toHaveBeenLastCalledWith([
      t(MESSAGE.MAX_SIZE_ERROR, {
        maxSize: formatBytes(maxSize),
        fileName: shortenText(BIG_PNG.name, 30),
        fileSize: formatBytes(BIG_PNG.size),
      }),
    ]);
    expect(getRoot()).toHaveClass("error");
  });

  it("should check the mime type and the max file count", async () => {
    const onChange = jest.fn();
    const onError = jest.fn();
    const { getInput } = renderExt(<FileInput accept={["application/pdf", "image/png"]} onChange={onChange} onError={onError} />);

    await simulateChooseFiles(getInput(), [GIF, PDF, PNG]);

    expect(onChange).toHaveBeenLastCalledWith([PDF]);
    expect(onError).toHaveBeenLastCalledWith([
      t(MESSAGE.MIME_TYPE, { acceptType: "application/pdf,image/png", fileType: GIF.type }),
      t(MESSAGE.MAX_FILE, { maxFile: 1, count: 1 }),
    ]);
  });

  it("should use customValidation and the messages prop", async () => {
    const onError = jest.fn();
    const customMessage = "Only reports";
    const { getInput, rerender } = renderExt(
      <FileInput customValidation={file => ({ isValid: file.name.startsWith("report"), errorMessage: customMessage })} onError={onError} />,
    );

    await simulateChooseFiles(getInput(), [PNG]);
    expect(onError).toHaveBeenLastCalledWith([customMessage]);

    rerender(<FileInput maxSize={10} messages={{ maxSizeMessage: "Too big" }} onError={onError} />);
    await simulateChooseFiles(getInput(), [PDF]);
    expect(onError).toHaveBeenLastCalledWith(["Too big"]);
  });

  it("should clear the selection with the delete button", async () => {
    const onChange = jest.fn();
    const { getInput, getDeleteButton, getRoot } = renderExt(<FileInput onChange={onChange} />);

    expect(getDeleteButton()).not.toBeInTheDocument();
    await simulateChooseFiles(getInput(), [PDF]);
    await userEvent.click(getDeleteButton()!);

    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(getRoot()).toHaveTextContent(t("upload.selectFile"));
  });

  it("should not take files when disabled or readOnly", async () => {
    const onChange = jest.fn();
    const { getInput, getRoot, getBrowseButton, rerender } = renderExt(<FileInput disabled onChange={onChange} />);

    expect(getRoot()).toHaveClass("disabled");
    expect(getInput()).toBeDisabled();
    expect(getBrowseButton()).toBeDisabled();

    rerender(<FileInput readOnly onChange={onChange} />);
    expect(getRoot()).toHaveClass("readOnly");
    expect(getBrowseButton()).toBeDisabled();
    await simulateChooseFiles(getInput(), [PDF]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should render the error and success props", () => {
    const { getRoot, rerender } = renderExt(<FileInput error />);
    expect(getRoot()).toHaveClass("error");
    rerender(<FileInput success />);
    expect(getRoot()).toHaveClass("success");
  });

  it("should give the files to the form and block submit while the selection has errors", async () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <Form.Field name="attachment" validations={[Validations.Required]}>
          <FileInput name="attachment" maxSize={1_000_000} />
        </Form.Field>
      </Form>,
    );
    const input = screen.getByTestId("fileInput").querySelector("input") as HTMLInputElement;
    const submit = () => userEvent.click(screen.getByText(t("g.submit")));

    await submit();
    expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({ isValid: false }), expect.anything());

    await simulateChooseFiles(input, [BIG_PNG]);
    await submit();
    expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({ isValid: false }), expect.anything());

    await simulateChooseFiles(input, [PDF]);
    await submit();
    await waitFor(() => expect(onSubmit).toHaveBeenLastCalledWith({ isValid: true, values: { attachment: [PDF] } }, expect.anything()));
  });
});
