import { cleanup, screen, waitFor } from "@testing-library/react";
import UploadList from "@/components/Upload/UploadList/UploadList";
import { FileType } from "@/components/Upload/types";
import { Size4SM } from "../../../types";
import { InputValue } from "@/components/Form/types";
import { simulateDrop, simulateChooseFiles, renderExtUploadFileList, waitForSuccessfulUpload } from "@/components/Upload/testHelper";
import { formatBytes, shortenText } from "../../../../utils/utils";
import { MESSAGE } from "@/components/Upload/constants";
import { MOCK } from "../mock";
import { ReactNode } from "react";
import { mockXHRs, t } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

describe("UploadList", () => {
  const renderExt = (ui: ReactNode) => {
    const getBrowseButton = () => screen.queryByText(t("g.browse"))?.parentElement as HTMLButtonElement;

    return {
      ...renderExtUploadFileList(ui),
      getBrowseButton,
    };
  };
  const requiredProps = { id: "uploadList", uploadRequest: MOCK.uploadRequest, deleteRequest: MOCK.deleteRequest };
  const serverFile = { id: "file-1", name: "server-doc.pdf", type: "application/pdf", size: 2048 };
  const serverFile2 = { id: "file-2", name: "server-img.png", type: "image/png", size: 4096 };

  beforeEach(() => mockXHRs());
  afterEach(() => jest.restoreAllMocks());

  it("should be rendered with only required props", () => {
    expect(renderExt(<UploadList {...requiredProps} />).container).toMatchSnapshot();
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: Size4SM[] = ["xs", "sm", "md", "lg"];
    for (const size of sizes) {
      const { container, getBrowseButton } = renderExt(<UploadList {...requiredProps} size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
      expect(getBrowseButton()).toHaveClass(size);
      cleanup();
    }
  });

  it("should display error when error prop is true", () => {
    const { getDragArea } = renderExt(<UploadList {...requiredProps} error />);
    expect(getDragArea()).toHaveClass("error");
  });

  it("should display success when success prop is true", () => {
    const { getDragArea } = renderExt(<UploadList {...requiredProps} success />);
    expect(getDragArea()).toHaveClass("success");
  });

  it("should keep error styling after file is added", async () => {
    const { getDragArea, getInput } = renderExt(<UploadList {...requiredProps} error autoUpload={false} />);
    expect(getDragArea()).toHaveClass("error");
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(getDragArea()).toHaveClass("error");
  });

  it("should keep success styling after file is added", async () => {
    const { getDragArea, getInput } = renderExt(<UploadList {...requiredProps} success autoUpload={false} />);
    expect(getDragArea()).toHaveClass("success");
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(getDragArea()).toHaveClass("success");
  });

  it("should be rendered as disabled when readOnly prop is true", async () => {
    const { getDragArea, getBrowseButton, getInput, getDeleteButton, getFileItemFirst } = renderExt(
      <UploadList {...requiredProps} readOnly autoUpload={false} />,
    );
    expect(getDragArea()).toHaveClass("disabled");
    expect(getBrowseButton()).toBeDisabled();
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(getFileItemFirst()).toBeInTheDocument();
    expect(getDeleteButton()).not.toBeInTheDocument();
  });

  it("should be rendered as disabled when disabled prop is true", async () => {
    const handleChange = (val?: InputValue) => {
      const files = val as FileType[];
      expect(files).toHaveLength(0);
    };
    const { getDragArea, getBrowseButton } = renderExt(<UploadList {...requiredProps} disabled onChange={handleChange} />);
    expect(getDragArea()).toHaveClass("disabled");
    expect(getBrowseButton()).toBeDisabled();

    await simulateDrop(getDragArea(), [MOCK.filePng2mb]);
  });

  it("should fire onChange event when any file is selected", async () => {
    const handleChange = jest.fn();
    const { getInput } = renderExt(<UploadList {...requiredProps} onChange={handleChange} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    expect(handleChange).toHaveBeenCalled();
  });

  it("should fire onError event when any error is happened", async () => {
    const handleError = jest.fn();
    const { getInput } = renderExt(<UploadList {...requiredProps} onError={handleError} maxFile={1} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb]);

    expect(handleError).toHaveBeenCalled();
  });

  it("should only accept files of the given file types with accept prop", async () => {
    const { getInput, getFileItemFirst, getFileItemLast } = renderExt(
      <UploadList {...requiredProps} accept={["application/pdf"]} maxFile={2} />,
    );

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb]);

    const fileItem1 = getFileItemFirst();
    expect(fileItem1).toHaveTextContent(MOCK.filePng2mb.name);
    expect(fileItem1).toHaveTextContent(t(MESSAGE.MIME_TYPE, { acceptType: "application/pdf", fileType: "image/png" })); // Validation failed : File type PNG
    expect(fileItem1.childNodes[1].lastChild).toHaveClass("helperError");

    const fileItem2 = getFileItemLast();
    expect(fileItem2).toHaveTextContent(MOCK.filePdf1kb.name);
    await waitForSuccessfulUpload(fileItem2); // Successfully uploaded : File type PDF;
  });

  it("should validate each file with the given validate function and show the given error message if fails when customValidation prop is given", async () => {
    const errorMessage = "Seçilen dosya formatı hatalı. Uygun formatta dosya seçerek tekrar deneyiniz.";

    const customValidation = (file: File) => ({ isValid: file.type === "application/pdf", errorMessage });
    const { getInput, getFileItemFirst, getFileItemLast } = renderExt(
      <UploadList {...requiredProps} customValidation={customValidation} maxFile={2} />,
    );

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb]);
    const fileItem1 = getFileItemFirst();
    expect(fileItem1).toHaveTextContent(errorMessage); // Validation failed : File type PNG
    expect(fileItem1.childNodes[1].lastChild).toHaveClass("helperError");

    const fileItem2 = getFileItemLast();
    await waitForSuccessfulUpload(fileItem2); // Successfully uploaded : File type PDF;
  });

  it("should allow uploading as many files as specified with the maxFile prop", async () => {
    const { getInput, getFileItemFirst, getFileItemLast, getBrowseButton } = renderExt(<UploadList {...requiredProps} maxFile={1} />);
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb, MOCK.filePdf1kb]);

    const fileItem2 = getFileItemLast();
    expect(fileItem2).toHaveTextContent(MOCK.filePdf1kb.name);
    expect(fileItem2).toHaveTextContent(t(MESSAGE.MAX_FILE, { maxFile: 1 }));
    expect(getBrowseButton()).toBeDisabled();

    const fileItem1 = getFileItemFirst();
    expect(fileItem1).toHaveTextContent(MOCK.fileJpeg1kb.name);
    await waitForSuccessfulUpload(fileItem1);
  });

  it("should not upload files whose file size is larger than given size in maxSize prop", async () => {
    const maxSize = 1000000;
    const expectedErrorMessage = t(MESSAGE.MAX_SIZE_ERROR, {
      maxSize: formatBytes(maxSize),
      fileName: shortenText(MOCK.filePng2mb.name, 30),
      fileSize: formatBytes(MOCK.filePng2mb.size),
    });
    const { getInput, getFileItemFirst } = renderExt(<UploadList {...requiredProps} maxSize={maxSize} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.filePng2mb.name);
    expect(fileItem).toHaveTextContent(expectedErrorMessage);
    expect(screen.queryByText(t(MESSAGE.UPLOAD_SUCCESS))).not.toBeInTheDocument();
  });

  it("should override maximum number of files error message when set explicitly", async () => {
    const maxFile = 2;
    const defaultErrorMessage = t(MESSAGE.MAX_FILE, { maxFile: maxFile });
    const messages = { maxFileMessage: "Maximum %maxFile% Files Could Be Uploaded" };
    const { getInput } = renderExt(<UploadList {...requiredProps} maxFile={maxFile} messages={messages} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileJpeg1kb]);

    expect(screen.queryByText(messages.maxFileMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override maximum file size error message when set explicitly", async () => {
    const maxSize = 1;
    const defaultErrorMessage = t(MESSAGE.MAX_SIZE_ERROR, {
      maxSize: formatBytes(maxSize),
      fileName: shortenText(MOCK.filePng2mb.name, 30),
      fileSize: formatBytes(MOCK.filePng2mb.size),
    });
    const messages = { maxSizeMessage: "Test Max Size Message" };
    const { getInput } = renderExt(<UploadList {...requiredProps} maxSize={maxSize} messages={messages} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);

    expect(screen.queryByText(messages.maxSizeMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override file mime type error message when set explicitly", async () => {
    const accept: string[] = ["application/pdf"];
    const defaultErrorMessage = t(MESSAGE.MIME_TYPE, { acceptType: "application/pdf", fileType: MOCK.fileJpeg1kb.type });
    const messages = { mimeTypeMessage: "Test Mime Type Message" };
    const { getInput } = renderExt(<UploadList {...requiredProps} accept={accept} messages={messages} />);

    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    expect(screen.queryByText(messages.mimeTypeMessage)).toBeInTheDocument();

    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override upload fail error message when set explicitly", async () => {
    const xhrSpy = mockXHRs(500);
    const messages = { uploadFailMessage: "Test Upload Fail Message" };
    const { getInput } = renderExt(<UploadList {...requiredProps} messages={messages} />);

    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    await waitFor(() => {
      expect(screen.queryByText(messages.uploadFailMessage)).toBeInTheDocument();
      expect(screen.queryByText(t(MESSAGE.UPLOAD_ERROR))).not.toBeInTheDocument();
    });

    xhrSpy.mockRestore();
  });

  it("should not upload file when same file is already uploaded", async () => {
    const { getInput, getDragArea, getFileList, getBrowseButton, getFileItemFirst } = renderExt(
      <UploadList {...requiredProps} maxFile={2} />,
    );

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    await waitForSuccessfulUpload(getFileItemFirst());
    const fileList = getFileList();
    expect(fileList?.childNodes).toHaveLength(1);

    await simulateDrop(getDragArea(), [MOCK.filePng2mb]);
    expect(fileList?.childNodes).toHaveLength(1);
    expect(getBrowseButton()).not.toBeDisabled();
  });

  it("should upload files when files are dropped to the file drag area", async () => {
    const { getDragArea, getFileList, getFileItemFirst } = renderExt(<UploadList {...requiredProps} />);

    await simulateDrop(getDragArea(), [MOCK.filePng2mb]);

    const fileList = getFileList();
    expect(fileList?.childNodes).toHaveLength(1);
    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.filePng2mb.name);
    await waitForSuccessfulUpload(fileItem);
  });

  it("should not upload files automatically when autoUpload prop is false", async () => {
    const { getInput, getFileItemFirst } = renderExt(<UploadList {...requiredProps} autoUpload={false} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);

    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.filePng2mb.name);
    expect(fileItem).not.toHaveTextContent(t(MESSAGE.UPLOAD_SUCCESS));
    expect(fileItem).toHaveTextContent(t(MESSAGE.WAITING_TO_UPLOAD));
  });

  it("should allow files to be uploaded manually when autoUpload prop is false", async () => {
    const { getInput, getFileItemFirst, getUploadButton } = renderExt(<UploadList {...requiredProps} autoUpload={false} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    await userEvent.click(getUploadButton());

    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.filePng2mb.name);
    await waitForSuccessfulUpload(fileItem);
  });

  it("should delete the file from the list when delete icon of that file is clicked", async () => {
    const { getDragArea, getFileItemFirst, getBrowseButton, getDeleteButton, getFileList } = renderExt(<UploadList {...requiredProps} />);

    await simulateDrop(getDragArea(), [MOCK.filePng2mb]);
    expect(getBrowseButton()).toBeDisabled();

    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.filePng2mb.name);
    await waitForSuccessfulUpload(fileItem);

    await userEvent.click(getDeleteButton());
    await waitFor(() => expect(getFileList()).not.toBeInTheDocument());
  });

  it("should automatically upload a file which was errored because the maximum number of file limit is reached, when an already uploaded file is deleted and autoUpload is true", async () => {
    const { getDragArea, getFileList, getFileItemFirst, getFileItemLast, getDeleteButton } = renderExt(<UploadList {...requiredProps} />);

    const initialFile1 = MOCK.filePng2mb;
    await simulateDrop(getDragArea(), [initialFile1, MOCK.filePdf1kb]);

    expect(getFileList()?.childNodes).toHaveLength(2);

    expect(getFileItemLast()).toHaveTextContent(MOCK.filePdf1kb.name);
    expect(getFileItemLast()).toHaveTextContent(t(MESSAGE.MAX_FILE, { maxFile: 1 }));

    expect(getFileItemFirst()).toHaveTextContent(initialFile1.name);
    await waitForSuccessfulUpload(getFileItemFirst());

    await userEvent.click(getDeleteButton(0)); // delete success file
    await waitForSuccessfulUpload(getFileItemFirst());
    expect(getFileList()?.childNodes).toHaveLength(1);
    expect(getFileItemFirst()).toHaveTextContent(MOCK.filePdf1kb.name);
    expect(screen.queryByText(initialFile1.name)).not.toBeInTheDocument();
  });

  it("should show error and prevent uploading for exceeding files when more files than the maxFile prop is dropped and autoUpload is false", async () => {
    const maxFile = 2;
    const expectedErrorMessage = t(MESSAGE.MAX_FILE, { maxFile: maxFile });
    const { getDragArea, getFileList, getUploadButton, getFileItemLast } = renderExt(
      <UploadList {...requiredProps} maxFile={maxFile} autoUpload={false} />,
    );

    await simulateDrop(getDragArea(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileJpeg1kb]);

    expect(getFileList()?.childNodes).toHaveLength(3);
    expect(getFileItemLast()).toHaveTextContent(MOCK.fileJpeg1kb.name);
    expect(getFileItemLast()).toHaveTextContent(expectedErrorMessage);

    await userEvent.click(getUploadButton());
    await waitFor(() => {
      expect(getFileItemLast()).toHaveTextContent(MOCK.fileJpeg1kb.name);
      expect(getFileItemLast()).toHaveTextContent(expectedErrorMessage);
    });
  });

  it("should upload valid files and make the upload button disabled when autoUpload is false and more files than maxFile are added", async () => {
    const maxFile = 2;
    const { getDragArea, getUploadButton } = renderExt(<UploadList {...requiredProps} maxFile={maxFile} autoUpload={false} />);

    await simulateDrop(getDragArea(), [MOCK.filePdf1kb, MOCK.fileJpeg1kb, MOCK.fileTxt1kb]);
    await userEvent.click(getUploadButton());

    await waitFor(() => {
      expect(screen.queryAllByText(t(MESSAGE.UPLOAD_SUCCESS))).toHaveLength(maxFile);
      expect(getUploadButton()).toBeDisabled();
    });
  });

  it("should enable the upload button when one of the already-uploadeded files is deleted and autoUpload is false and waiting files have only maxFile exceed error", async () => {
    const maxFile = 2;
    const { getDragArea, getUploadButton, getDeleteButton } = renderExt(
      <UploadList {...requiredProps} maxFile={maxFile} autoUpload={false} />,
    );

    await simulateDrop(getDragArea(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileTxt1kb]);
    await userEvent.click(getUploadButton());
    expect(getUploadButton()).toBeDisabled();

    await waitFor(() => expect(screen.queryAllByText(t(MESSAGE.UPLOAD_SUCCESS))).toHaveLength(maxFile));
    await userEvent.click(getDeleteButton(0)); // delete a success file
    await waitFor(() => expect(getUploadButton()).not.toBeDisabled());
  });

  it("should keep the upload button as disabled when autoUpload is false and one of the maxFile-exceed-errored files are deleted", async () => {
    const maxFile = 2;
    const { getDragArea, getUploadButton, getDeleteButton } = renderExt(
      <UploadList {...requiredProps} maxFile={maxFile} autoUpload={false} />,
    );
    await simulateDrop(getDragArea(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileTxt1kb, MOCK.fileJpeg1kb]);

    const uploadButton = getUploadButton();
    await userEvent.click(uploadButton);
    await waitFor(() => expect(uploadButton).toBeDisabled());
    await userEvent.click(getDeleteButton(3)); // delete a failed file
    expect(uploadButton).toBeDisabled();
  });

  it("should allow user to retry uploading via re-upload button when a network error occurs", async () => {
    const xhrSpy = mockXHRs(500, 200);
    const { getInput, getFileItemFirst } = renderExt(<UploadList {...requiredProps} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);

    await waitFor(() => expect(screen.queryByText(t(MESSAGE.UPLOAD_ERROR))).toBeInTheDocument());

    const reloadButton = screen.queryByText("autorenew");
    await userEvent.click(reloadButton!);

    await waitForSuccessfulUpload(getFileItemFirst());
    expect(screen.queryByText(t(MESSAGE.UPLOAD_ERROR))).not.toBeInTheDocument();
    expect(reloadButton).not.toBeInTheDocument();

    xhrSpy.mockRestore();
  });

  it("should show error message when deleting a file from server fails", async () => {
    const xhrSpy = mockXHRs(200, 500);
    const { getInput, getDeleteButton, getFileItemFirst } = renderExt(<UploadList {...requiredProps} />);
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(screen.queryByText(MOCK.filePdf1kb.name)).toBeInTheDocument();

    await waitForSuccessfulUpload(getFileItemFirst());
    await userEvent.click(getDeleteButton()); // delete success file
    await waitFor(() => expect(screen.queryByText(t(MESSAGE.DELETE_ERROR))).toBeInTheDocument());
    expect(getDeleteButton()).toBeInTheDocument();

    xhrSpy.mockRestore();
  });

  it("should render a single file given in the value prop", () => {
    const { getFileList, getFileItemFirst } = renderExt(<UploadList {...requiredProps} value={[serverFile]} />);
    expect(getFileList()?.childNodes).toHaveLength(1);
    expect(getFileItemFirst()).toHaveTextContent(serverFile.name);
    expect(getFileItemFirst()).toHaveTextContent(formatBytes(serverFile.size));
  });

  it("should render multiple files given in the value prop", () => {
    const { getFileList, getFileItemFirst, getFileItemLast } = renderExt(
      <UploadList {...requiredProps} value={[serverFile, serverFile2]} />,
    );
    expect(getFileList()?.childNodes).toHaveLength(2);
    expect(getFileItemFirst()).toHaveTextContent(serverFile.name);
    expect(getFileItemLast()).toHaveTextContent(serverFile2.name);
  });

  it("should send a delete request and remove the file when the delete button is clicked for a value file", async () => {
    const { getFileList, getDeleteButton } = renderExt(<UploadList {...requiredProps} value={[serverFile]} />);
    await userEvent.click(getDeleteButton());
    await waitFor(() => expect(getFileList()).not.toBeInTheDocument());
  });

  it("should show a delete error when deleting a value file from the server fails", async () => {
    const xhrSpy = mockXHRs(500);
    const { getDeleteButton } = renderExt(<UploadList {...requiredProps} value={[serverFile]} />);
    await userEvent.click(getDeleteButton());
    await waitFor(() => expect(screen.queryByText(t(MESSAGE.DELETE_ERROR))).toBeInTheDocument());
    xhrSpy.mockRestore();
  });

  it("should render the download button when onDownloadClick is provided in value", () => {
    const { unmount, getDownloadButton } = renderExt(<UploadList {...requiredProps} value={[serverFile]} />);
    expect(getDownloadButton()).not.toBeInTheDocument();
    unmount();
    renderExt(<UploadList {...requiredProps} value={[{ ...serverFile, onDownloadClick: jest.fn() }]} />);
    expect(getDownloadButton()).toBeInTheDocument();
  });

  it("should call onDownloadClick when the download button is clicked", async () => {
    const onDownloadClick = jest.fn();
    const { getDownloadButton } = renderExt(<UploadList {...requiredProps} value={[{ ...serverFile, onDownloadClick }]} />);
    await userEvent.click(getDownloadButton());
    expect(onDownloadClick).toHaveBeenCalledTimes(1);
  });

  it("should show the download button but hide action buttons when readOnly or disabled", () => {
    const { getDownloadButton, getDeleteButton, unmount } = renderExt(
      <UploadList {...requiredProps} value={[{ ...serverFile, onDownloadClick: jest.fn() }]} readOnly />,
    );
    expect(getDownloadButton()).toBeInTheDocument();
    expect(getDeleteButton()).not.toBeInTheDocument();
    unmount();

    renderExt(<UploadList {...requiredProps} value={[{ ...serverFile, onDownloadClick: jest.fn() }]} disabled />);
    expect(getDownloadButton()).toBeInTheDocument();
    expect(getDeleteButton()).not.toBeInTheDocument();
  });

  it("should disable the browse button when the maxFile limit is already reached by value files", () => {
    const { getBrowseButton } = renderExt(<UploadList {...requiredProps} value={[serverFile]} maxFile={1} />);
    expect(getBrowseButton()).toBeDisabled();
  });

  it("should not add a duplicate file when a chosen file matches a value file by name, size, and type", async () => {
    const matchingValueFile = { id: "server-pdf", name: MOCK.filePdf1kb.name, type: MOCK.filePdf1kb.type, size: MOCK.filePdf1kb.size };
    const { getFileList, getInput } = renderExt(<UploadList {...requiredProps} value={[matchingValueFile]} maxFile={2} />);
    expect(getFileList()?.childNodes).toHaveLength(1);
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(getFileList()?.childNodes).toHaveLength(1);
  });
});
