import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { Size4SM } from "../../../types";
import { simulateDrop, simulateChooseFiles, renderExtUploadFileList, waitForSuccessfulUpload } from "@/components/Upload/testHelper";
import { MESSAGE } from "@/components/Upload/constants";
import UploadDragger from "@/components/Upload/UploadDragger/UploadDragger";
import { MOCK } from "../mock";
import { mockXHRs } from "../../../../utils/testUtils";
import { userEvent } from "@testing-library/user-event";

describe("UploadDragger", () => {
  const renderExt = renderExtUploadFileList;
  const requiredProps = { uploadRequest: MOCK.uploadRequest, deleteRequest: MOCK.deleteRequest };

  it("should be rendered with only required props", () => {
    expect(renderExt(<UploadDragger {...requiredProps} />).container).toMatchSnapshot();
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: Size4SM[] = ["xs", "sm", "md", "lg"];
    for (const size of sizes) {
      const { container } = renderExt(<UploadDragger {...requiredProps} size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
      cleanup();
    }
  });

  it("should display error when error prop is true", () => {
    const { getDragArea } = renderExt(<UploadDragger {...requiredProps} error />);
    expect(getDragArea()).toHaveClass("error");
  });

  it("should display success when success prop is true", () => {
    const { getDragArea } = renderExt(<UploadDragger {...requiredProps} success />);
    expect(getDragArea()).toHaveClass("success");
  });

  it("should be rendered as disabled when disabled prop is true", async () => {
    const handleChange = jest.fn();
    const { getDragArea } = renderExt(<UploadDragger {...requiredProps} disabled onChange={handleChange} />);
    expect(getDragArea()).toHaveClass("disabled");
    await simulateDrop(getDragArea(), [MOCK.filePng2mb]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should be rendered as disabled when readOnly prop is true", async () => {
    const handleChange = jest.fn();
    const { getDragArea } = renderExt(<UploadDragger {...requiredProps} readOnly onChange={handleChange} />);
    expect(getDragArea()).toHaveClass("disabled");
    await simulateDrop(getDragArea(), [MOCK.filePng2mb]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should keep error styling after file is added", async () => {
    const { getDragArea, getInput } = renderExt(<UploadDragger {...requiredProps} error autoUpload={false} />);
    expect(getDragArea()).toHaveClass("error");
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(getDragArea()).toHaveClass("error");
  });

  it("should keep success styling after file is added", async () => {
    const { getDragArea, getInput } = renderExt(<UploadDragger {...requiredProps} success autoUpload={false} />);
    expect(getDragArea()).toHaveClass("success");
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(getDragArea()).toHaveClass("success");
  });

  it("should only accept files of the given file types with accept prop", async () => {
    const xhrSpy = mockXHRs();
    const accept: string[] = ["application/pdf"];
    const expectedErrorMessage = "Sadece 'application/pdf' formatındaki dosyaları yükleyebilirsiniz. Dosyanızın formatı: 'image/png'";
    const { getInput, getFileItemFirst, getFileItemLast } = renderExt(<UploadDragger {...requiredProps} accept={accept} maxFile={2} />);
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb, MOCK.filePng2mb]);
    expect(getFileItemFirst()).toHaveTextContent(MOCK.filePdf1kb.name);
    await waitForSuccessfulUpload(getFileItemFirst());

    const fileItem2 = getFileItemLast();
    expect(fileItem2).toHaveTextContent(MOCK.filePng2mb.name);
    expect(fileItem2).toHaveTextContent(expectedErrorMessage); // Validation failed : File type PNG
    // expect(fileItem2).toHaveTextContent(mockT("upload.message.mimeTypeError")); // Validation failed : File type PNG
    expect(fileItem2.childNodes[1].lastChild).toHaveClass("helperError");

    xhrSpy.mockRestore();
  });

  it("should validate each file with the given validate function and show the given error message if fails when customValidation prop is given", async () => {
    const xhrSpy = mockXHRs();
    const errorMessage = "Seçilen dosya formatı hatalı. Uygun formatta dosya seçerek tekrar deneyiniz.";

    const customValidation = (file: File) => ({ isValid: file.type === "application/pdf", errorMessage });

    const { getInput, getFileItemFirst, getFileItemLast } = renderExt(
      <UploadDragger {...requiredProps} customValidation={customValidation} maxFile={2} />,
    );
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb, MOCK.filePng2mb]);
    await waitForSuccessfulUpload(getFileItemFirst());

    const fileItem2 = getFileItemLast();
    expect(fileItem2).toHaveTextContent(errorMessage); // Validation failed : File type PNG
    expect(fileItem2.childNodes[1].lastChild).toHaveClass("helperError");

    xhrSpy.mockRestore();
  });

  it("should allow uploading as many files as specified with the maxFile prop", async () => {
    const xhrSpy = mockXHRs();
    const maxFile = 1;
    const expectedErrorMessage = "Maksimum 1 dosya yükleyebilirsiniz";
    const { getInput, getFileItemFirst, getFileItemLast } = renderExt(<UploadDragger {...requiredProps} maxFile={maxFile} />);
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb, MOCK.fileTxt1kb]);

    await waitFor(() => {
      const fileItem1 = getFileItemFirst();
      expect(fileItem1).toHaveTextContent(MOCK.fileJpeg1kb.name);
      expect(fileItem1).toHaveTextContent(mockT(MESSAGE.UPLOAD_SUCCESS));
    });
    const fileItem2 = getFileItemLast();
    expect(fileItem2).toHaveTextContent(MOCK.fileTxt1kb.name);
    expect(fileItem2).toHaveTextContent(expectedErrorMessage);

    xhrSpy.mockRestore();
  });

  it("should not upload files whose file size is larger than given size in maxSize prop", async () => {
    const maxSize = 500000;
    const expectedErrorMessage = "Dosyanızın boyutu maksimum 500 KB olabilir. 'test.gif' dosyanızın boyutu: 1 MB";
    const { getInput, getFileItemFirst } = renderExt(<UploadDragger {...requiredProps} maxSize={maxSize} />);
    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);

    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.fileGif1mb.name);
    expect(fileItem).toHaveTextContent(expectedErrorMessage);
    expect(screen.queryByText(mockT(MESSAGE.UPLOAD_SUCCESS))).not.toBeInTheDocument();
  });

  it("should override maximum number of files error message when set explicitly", async () => {
    const maxFile = 2;
    const defaultErrorMessage = "Maksimum 2 dosya yükleyebilirsiniz";
    const messages = { maxFileMessage: "Test Max File Message" };
    const { getInput } = renderExt(<UploadDragger {...requiredProps} maxFile={maxFile} messages={messages} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileGif1mb]);

    expect(screen.queryByText(messages.maxFileMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override maximum file size error message when set explicitly", async () => {
    const maxSize = 1;
    const defaultErrorMessage = "Dosyanızın boyutu maksimum 1 MB olabilir. 'test.gif' dosyanızın boyutu: 2 MB";
    const messages = { maxSizeMessage: "Maximum File Size Should Be %maxSize% MB But Got %fileSize%" };
    const { getInput } = renderExt(<UploadDragger {...requiredProps} maxSize={maxSize} messages={messages} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    expect(screen.queryByText(messages.maxSizeMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override file mime type error message when set explicitly", async () => {
    const accept: string[] = ["application/pdf"];
    const defaultErrorMessage = "Sadece 'application/pdf' formatındaki dosyaları yükleyebilirsiniz. Dosyanızın formatı: 'image/jpeg'";
    const messages = { mimeTypeMessage: "Test Mime Type Message" };
    const { getInput } = renderExt(<UploadDragger {...requiredProps} accept={accept} messages={messages} />);
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    expect(screen.queryByText(messages.mimeTypeMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override upload fail error message when set explicitly", async () => {
    const mockXhr = mockXHRs(500);
    const messages = { uploadFailMessage: "Test Upload Fail Message" };
    const { getInput } = renderExt(<UploadDragger {...requiredProps} messages={messages} />);
    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);
    await waitFor(() => {
      expect(screen.queryByText(messages.uploadFailMessage)).toBeInTheDocument();
      expect(screen.queryByText(mockT(MESSAGE.UPLOAD_ERROR))).not.toBeInTheDocument();
    });
    mockXhr.mockRestore();
  });

  it("should not upload file when same file is already uploaded", async () => {
    const { getInput, getDragArea, getFileList } = renderExt(<UploadDragger {...requiredProps} maxFile={2} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    const fileList = getFileList();
    expect(fileList?.childNodes).toHaveLength(1);
    expect(fileList?.firstChild).toHaveTextContent(MOCK.filePng2mb.name);
    await simulateDrop(getDragArea(), [MOCK.filePng2mb]);
    expect(fileList?.childNodes).toHaveLength(1);
  });

  it("should upload files when files are dropped to the file drag area", async () => {
    const xhrSpy = mockXHRs();
    const { getFileList, getFileItemFirst, getDragArea } = renderExt(<UploadDragger {...requiredProps} />);
    await simulateDrop(getDragArea(), [MOCK.filePng2mb]);
    expect(getFileList()?.childNodes).toHaveLength(1);
    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.filePng2mb.name);
    await waitForSuccessfulUpload(fileItem);
    xhrSpy.mockRestore();
  });

  it("should not upload files automatically when autoUpload prop is false", async () => {
    const { getFileItemFirst, getInput } = renderExt(<UploadDragger {...requiredProps} autoUpload={false} />);
    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);
    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.fileGif1mb.name);
    expect(fileItem).not.toHaveTextContent(mockT(MESSAGE.UPLOAD_SUCCESS));
    expect(fileItem).toHaveTextContent(mockT(MESSAGE.WAITING_TO_UPLOAD));
  });

  it("should allow files to be uploaded manually when autoUpload prop is false", async () => {
    const xhrSpy = mockXHRs();
    const { getFileItemFirst, getInput, getUploadButton } = renderExt(<UploadDragger {...requiredProps} autoUpload={false} />);
    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);
    const fileItem = getFileItemFirst();
    await userEvent.click(getUploadButton());
    expect(fileItem).toHaveTextContent(MOCK.fileGif1mb.name);
    await waitForSuccessfulUpload(fileItem);
    xhrSpy.mockRestore();
  });

  it("should delete the file from the list when delete icon of that file is clicked", async () => {
    const xhrSpy = mockXHRs(200, 200);
    const { container, getFileList, getFileItemFirst, getDeleteButton } = renderExt(<UploadDragger {...requiredProps} />);
    const dragArea = container.firstElementChild?.firstChild;
    await simulateDrop(dragArea as Element, [MOCK.filePng2mb]);
    const fileList = getFileList();
    const fileItem = getFileItemFirst();
    expect(fileItem).toHaveTextContent(MOCK.filePng2mb.name);
    await waitForSuccessfulUpload(fileItem);
    expect(getDeleteButton()).toBeInTheDocument();

    await userEvent.click(getDeleteButton());
    await waitFor(() => {
      expect(getDeleteButton()).not.toBeInTheDocument();
      expect(fileList).not.toBeInTheDocument();
    });
    xhrSpy.mockRestore();
  });

  it("should automatically upload a file which was errored because the maximum number of file limit is reached, when an already uploaded file is deleted and autoUpload is true", async () => {
    const xhrSpy = mockXHRs(200, 200, 200);
    const { getDragArea, getFileList, getFileItemFirst, getFileItemLast, getDeleteButton } = renderExt(
      <UploadDragger {...requiredProps} />,
    );
    await simulateDrop(getDragArea(), [MOCK.filePng2mb, MOCK.fileGif1mb]);

    expect(getFileList()?.childNodes).toHaveLength(2);

    const fileItem2 = getFileItemLast();
    expect(fileItem2).toHaveTextContent(MOCK.fileGif1mb.name);
    expect(fileItem2).toHaveTextContent("Maksimum 1 dosya yükleyebilirsiniz");

    const fileItem1 = getFileItemFirst();
    expect(fileItem1).toHaveTextContent(MOCK.filePng2mb.name);
    await waitForSuccessfulUpload(fileItem1);

    await userEvent.click(getDeleteButton(0));
    await waitFor(() => {
      expect(getFileList()?.childNodes).toHaveLength(1);
      expect(getFileItemFirst()).toHaveTextContent(MOCK.fileGif1mb.name);
      expect(screen.queryByText(MOCK.filePng2mb.name)).not.toBeInTheDocument();
    });

    await waitForSuccessfulUpload(getFileItemFirst());

    xhrSpy.mockRestore();
  });

  it("should show error and prevent uploading for exceeding files when more files than the maxFile prop is dropped and autoUpload is false", async () => {
    const xhrSpy = mockXHRs();
    const maxFile = 1;
    const expectedErrorMessage = "Maksimum 1 dosya yükleyebilirsiniz";
    const { getDragArea, getFileList, getUploadButton } = renderExt(
      <UploadDragger {...requiredProps} maxFile={maxFile} autoUpload={false} />,
    );
    await simulateDrop(getDragArea(), [MOCK.fileGif1mb, MOCK.fileTxt1kb]);

    const fileList = getFileList();
    expect(fileList?.childNodes).toHaveLength(2);

    const fileItem = fileList?.childNodes[1];
    expect(fileItem).toHaveTextContent(MOCK.fileTxt1kb.name);
    expect(fileItem).toHaveTextContent(expectedErrorMessage);
    await userEvent.click(getUploadButton());
    await waitFor(() => {
      expect(fileItem).not.toHaveTextContent(mockT(MESSAGE.UPLOAD_SUCCESS));
      expect(fileItem).toHaveTextContent(expectedErrorMessage);
    });
    xhrSpy.mockRestore();
  });

  it("should upload valid files and make the upload button disabled when autoUpload is false and more files than maxFile are added", async () => {
    const xhrSpy = mockXHRs(200, 200);
    const maxFile = 2;
    const { getDragArea, getUploadButton } = renderExt(<UploadDragger {...requiredProps} maxFile={maxFile} autoUpload={false} />);
    await simulateDrop(getDragArea(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileJpeg1kb]);

    const uploadButton = getUploadButton();
    await userEvent.click(uploadButton);
    expect(uploadButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryAllByText(mockT(MESSAGE.UPLOAD_SUCCESS))).toHaveLength(maxFile);
    });

    xhrSpy.mockRestore();
  });

  it("should enable the upload button when one of the already-uploadeded files is deleted and autoUpload is false and waiting files have only maxFile exceed error", async () => {
    const xhrSpy = mockXHRs(200, 200);
    const maxFile = 2;
    const { getDragArea, getUploadButton, getDeleteButton } = renderExt(
      <UploadDragger {...requiredProps} maxFile={maxFile} autoUpload={false} />,
    );
    await simulateDrop(getDragArea(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileGif1mb]);
    await userEvent.click(getUploadButton());
    expect(getUploadButton()).toBeDisabled();

    await waitFor(async () => {
      expect(screen.queryAllByText(mockT(MESSAGE.UPLOAD_SUCCESS))).toHaveLength(maxFile);
      await userEvent.click(getDeleteButton(1)); // delete a success file
    });
    await waitFor(() => expect(getUploadButton()).not.toBeDisabled());

    xhrSpy.mockRestore();
  });

  it("should keep the upload button as disabled when autoUpload is false and one of the maxFile-exceed-errored files are deleted", async () => {
    const xhrSpy = mockXHRs(200, 200);
    const maxFile = 2;
    const { getDragArea, getUploadButton, getDeleteButton } = renderExt(
      <UploadDragger {...requiredProps} maxFile={maxFile} autoUpload={false} />,
    );
    await simulateDrop(getDragArea(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileTxt1kb, MOCK.fileGif1mb]);

    const uploadButton = getUploadButton();
    await userEvent.click(uploadButton as Element);
    await waitFor(() => expect(uploadButton).toBeDisabled());
    await userEvent.click(getDeleteButton(2));
    expect(uploadButton).toBeDisabled();

    xhrSpy.mockRestore();
  });

  it("should allow user to retry uploading via re-upload button when a network error occurs", async () => {
    const xhrSpy = mockXHRs(500, 200);

    const { getInput } = renderExt(<UploadDragger {...requiredProps} />);
    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);

    await waitFor(() => {
      expect(screen.queryByText(mockT(MESSAGE.UPLOAD_ERROR))).toBeInTheDocument();
      fireEvent.click(screen.queryByText("autorenew")!);
    });

    await waitFor(() => {
      expect(screen.queryByText("autorenew")).not.toBeInTheDocument();
      expect(screen.queryByText(mockT(MESSAGE.UPLOAD_ERROR))).not.toBeInTheDocument();
      expect(screen.queryByText(mockT(MESSAGE.UPLOAD_SUCCESS))).toBeInTheDocument();
    });

    xhrSpy.mockRestore();
  });

  it("should show error message in the file row when deleting a file from server fails", async () => {
    const xhrSpy = mockXHRs(200, 500);
    const { getDeleteButton, getInput } = renderExt(<UploadDragger {...requiredProps} />);
    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);
    await waitFor(() => {
      fireEvent.click(getDeleteButton());
      expect(screen.queryByText(mockT(MESSAGE.DELETE_ERROR))).toBeInTheDocument();
    });
    xhrSpy.mockRestore();
  });
});
