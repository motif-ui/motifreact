import { cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import UploadInput from "@/components/Upload/UploadInput/UploadInput";
import { simulateChooseFiles } from "@/components/Upload/testHelper";
import { MESSAGE } from "@/components/Upload/constants";
import { MOCK } from "../mock";
import { userEvent } from "@testing-library/user-event";
import { InputSize } from "../../Form/types";
import { ReactNode } from "react";
import { mockXHRs } from "../../../../utils/testUtils";

describe("UploadInput", () => {
  const renderExt = (ui: ReactNode) => {
    const result = render(ui);

    const getInput = () => result.container.querySelector("input") as HTMLInputElement;

    const getFileItem = () => result.container.firstElementChild?.children[1] as HTMLElement;

    const getErrorIcon = () => screen.queryByText("error") as HTMLSpanElement;

    const getDeleteButton = () => screen.queryByText("delete") as HTMLButtonElement;

    const getUploadButton = () => screen.queryByText("Yükle") as HTMLButtonElement;

    const getBrowseButton = () => screen.queryByText("Gözat..") as HTMLButtonElement;

    const actHoverToErrorIcon = async () => {
      await userEvent.hover(getErrorIcon());
    };

    const waitForSuccessfulUpload = async (numberOfFiles?: number) => {
      const progressBar = screen.queryByTestId("progressBar");
      !!progressBar && (await waitForElementToBeRemoved(progressBar));

      await waitFor(() => {
        expect(result.queryByTestId("progressBar")).not.toBeInTheDocument();
        numberOfFiles && numberOfFiles > 1 && expect(result.queryByText("2 dosya yüklendi")).toBeInTheDocument();
        expect(getErrorIcon()).not.toBeInTheDocument();
        expect(getDeleteButton()).toBeInTheDocument();
      });
    };

    const waitForUploadFailure = async () => {
      const progressBar = screen.queryByTestId("progressBar");
      !!progressBar && (await waitForElementToBeRemoved(progressBar));

      await waitFor(() => {
        expect(result.queryByTestId("progressBar")).not.toBeInTheDocument();
        expect(getErrorIcon()).toBeInTheDocument();
        expect(getDeleteButton()).toBeInTheDocument();
      });
    };

    return {
      ...result,
      getInput,
      getFileItem,
      getErrorIcon,
      getDeleteButton,
      getUploadButton,
      getBrowseButton,
      actHoverToErrorIcon,
      waitForSuccessfulUpload,
      waitForUploadFailure,
    };
  };
  const requiredProps = { uploadRequest: MOCK.uploadRequest, deleteRequest: MOCK.deleteRequest };

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = renderExt(<UploadInput {...requiredProps} />);
    expect(container).toMatchSnapshot();
    expect(container.firstElementChild).toHaveClass("md");
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container, getBrowseButton } = renderExt(<UploadInput {...requiredProps} size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
      expect(getBrowseButton().parentElement).toHaveClass(size);
      cleanup();
    });
  });

  it("should display error when error prop is true", () => {
    const { container } = render(<UploadInput {...requiredProps} error />);
    expect(container.firstElementChild).toHaveClass("error");
  });

  it("should display success when success prop is true", () => {
    const { container } = render(<UploadInput {...requiredProps} success />);
    expect(container.firstElementChild).toHaveClass("success");
  });

  it("should be rendered as disabled when disabled prop is true", () => {
    const { container, getBrowseButton } = renderExt(<UploadInput {...requiredProps} disabled />);
    expect(container.firstElementChild).toHaveClass("disabled");
    expect(getBrowseButton()).toBeDisabled();
    expect(screen.queryByText("Dosya seçin")).toBeDisabled();
  });

  it("should be rendered as readOnly when readOnly prop is true", async () => {
    const handleChange = jest.fn();
    const { getInput, container } = renderExt(<UploadInput {...requiredProps} readOnly onChange={handleChange} />);
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(container.firstElementChild).toHaveClass("disabled");

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should fire onChange event when any file is selected", async () => {
    const handleChange = jest.fn();
    const { getInput } = renderExt(<UploadInput {...requiredProps} onChange={handleChange} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    //await waitForSuccessfulUpload();
    expect(handleChange).toHaveBeenCalled();
  });

  it("should fire onError event when an error occurs", async () => {
    const handleError = jest.fn();
    const { getInput } = renderExt(<UploadInput {...requiredProps} onError={handleError} maxFile={1} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb]);
    expect(handleError).toHaveBeenCalled();
  });

  it("should only accept files of the given file types with accept prop", async () => {
    const accept = ["application/pdf"];
    const { getInput, getFileItem, getErrorIcon, actHoverToErrorIcon } = renderExt(
      <UploadInput {...requiredProps} accept={accept} maxFile={2} autoUpload={false} />,
    );

    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    expect(getFileItem()).toHaveTextContent(MOCK.filePdf1kb.name);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    expect(getFileItem()).toHaveTextContent(MOCK.filePng2mb.name);
    expect(getErrorIcon()).toBeInTheDocument();

    await actHoverToErrorIcon();
    expect(
      screen.getByText("Sadece 'application/pdf' formatındaki dosyaları yükleyebilirsiniz. Dosyanızın formatı: 'image/png'"),
    ).toBeInTheDocument();
  });

  it("should allow the number of files specified by the maxFile prop to be uploaded and not allow more files to be added", async () => {
    const xhrSpy = mockXHRs();
    const maxFile = 2;
    const { rerender, getInput, getBrowseButton, getUploadButton, waitForSuccessfulUpload } = renderExt(
      <UploadInput {...requiredProps} maxFile={maxFile} />,
    );

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb]);
    await waitForSuccessfulUpload(maxFile);
    expect(getBrowseButton()).toBeDisabled();

    rerender(<UploadInput {...requiredProps} maxFile={maxFile} autoUpload={false} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb]);
    fireEvent.click(getUploadButton());
    await waitForSuccessfulUpload(maxFile);
    expect(getBrowseButton()).toBeDisabled();
    expect(getUploadButton()).toBeDisabled();

    xhrSpy.mockRestore();
  });

  it("should not automatically upload files which is larger (in size) than the maxSize prop", async () => {
    const maxSize = 1000000;
    const expectedErrorMessage = "Dosyanızın boyutu maksimum 1 MB olabilir. 'test.png' dosyanızın boyutu: 2 MB";
    const { getInput, actHoverToErrorIcon, queryByTestId } = renderExt(<UploadInput {...requiredProps} maxSize={maxSize} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    expect(queryByTestId("progressBar")).not.toBeInTheDocument();
    await actHoverToErrorIcon();
    expect(screen.queryByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("should render tooltip and pass the size prop to the tooltip when errors are present", async () => {
    const { getInput, actHoverToErrorIcon } = renderExt(<UploadInput {...requiredProps} maxSize={1000000} size="xs" />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    await actHoverToErrorIcon();
    expect(screen.queryByTestId("tooltipItem")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltipItem")).toHaveClass("xs");
  });

  it("should not allow to upload files with file size larger than the maxSize prop when autoUpload is false", async () => {
    const maxSize = 1000000;
    const expectedErrorMessage = "Dosyanızın boyutu maksimum 1 MB olabilir. 'test.png' dosyanızın boyutu: 2 MB";
    const { getInput, actHoverToErrorIcon, getUploadButton } = renderExt(
      <UploadInput {...requiredProps} maxSize={maxSize} autoUpload={false} />,
    );
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    expect(getUploadButton()).toBeDisabled();
    await actHoverToErrorIcon();
    expect(screen.queryByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it("should override maximum number of files error message when set explicitly", async () => {
    const defaultErrorMessage = "Maksimum 2 dosya yükleyebilirsiniz";
    const messages = { maxFileMessage: "Test max file message" };
    const { getInput, actHoverToErrorIcon } = renderExt(
      <UploadInput {...requiredProps} maxFile={2} messages={messages} autoUpload={false} />,
    );
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb, MOCK.fileJpeg1kb]);
    await actHoverToErrorIcon();
    expect(screen.queryByText(messages.maxFileMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override maximum file size error message when set explicitly", async () => {
    const maxSize = 1;
    const defaultErrorMessage = "Dosyanızın boyutu maksimum 1 MB olabilir. 'test.gif' dosyanızın boyutu: 2 MB";
    const messages = { maxSizeMessage: "Test max size message" };
    const { getInput, actHoverToErrorIcon } = renderExt(
      <UploadInput {...requiredProps} maxSize={maxSize} messages={messages} autoUpload={false} />,
    );
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    await actHoverToErrorIcon();
    expect(screen.queryByText(messages.maxSizeMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override file mime type error message when set explicitly", async () => {
    const accept = ["application/pdf"];
    const defaultErrorMessage = "Sadece 'application/pdf' formatındaki dosyaları yükleyebilirsiniz. Dosyanızın formatı: 'image/jpeg'";
    const expectedErrorMessage = "File Type Should Be application/pdf But Got image/jpeg";
    const messages = { mimeTypeMessage: "File Type Should Be %acceptType% But Got %fileType%" };
    const { getInput, actHoverToErrorIcon } = renderExt(
      <UploadInput {...requiredProps} accept={accept} messages={messages} autoUpload={false} />,
    );
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    await actHoverToErrorIcon();
    expect(screen.queryByText(expectedErrorMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultErrorMessage)).not.toBeInTheDocument();
  });

  it("should override upload fail error message when set explicitly", async () => {
    const xhrSpy = mockXHRs(500);

    const messages = { uploadFailMessage: "Test file upload error message" };
    const { getInput, actHoverToErrorIcon, waitForUploadFailure } = renderExt(<UploadInput {...requiredProps} messages={messages} />);
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);

    await waitForUploadFailure();
    await actHoverToErrorIcon();
    await waitFor(() => {
      expect(screen.queryByText(messages.uploadFailMessage)).toBeInTheDocument();
      expect(screen.queryByText(MESSAGE.UPLOAD_ERROR)).not.toBeInTheDocument();
    });

    xhrSpy.mockRestore();
  });

  it("should delete all uploaded files when delete icon is clicked", async () => {
    const xhrSpy = mockXHRs();
    const { getInput, getDeleteButton, waitForSuccessfulUpload, queryByText } = renderExt(<UploadInput {...requiredProps} maxFile={2} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb, MOCK.filePdf1kb]);
    await waitForSuccessfulUpload(2);

    await userEvent.click(getDeleteButton());
    await waitFor(() => {
      expect(getDeleteButton()).not.toBeInTheDocument();
      expect(queryByText("2 dosya yüklendi")).not.toBeInTheDocument();
    });

    xhrSpy.mockRestore();
  });

  it("should not render the upload button when already-uploaded files are deleted and autoUpload is false ", async () => {
    const xhrSpy = mockXHRs();
    const { getInput, queryByText, getUploadButton, getDeleteButton, waitForSuccessfulUpload } = renderExt(
      <UploadInput {...requiredProps} autoUpload={false} />,
    );
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    expect(queryByText(MOCK.filePng2mb.name)).toBeInTheDocument();

    fireEvent.click(getUploadButton());
    await waitForSuccessfulUpload();

    fireEvent.click(getDeleteButton());
    await waitFor(() => expect(queryByText(MOCK.filePng2mb.name)).not.toBeInTheDocument());
    expect(getUploadButton()).not.toBeInTheDocument();

    xhrSpy.mockRestore();
  });

  it("should display error message when a network error occurred during the upload process", async () => {
    const xhrSpy = mockXHRs(500);
    const { getInput, actHoverToErrorIcon, waitForUploadFailure } = renderExt(<UploadInput {...requiredProps} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    await waitForUploadFailure();
    await actHoverToErrorIcon();
    expect(screen.queryByText(MESSAGE.UPLOAD_ERROR)).toBeInTheDocument();
    xhrSpy.mockRestore();
  });

  it("should show error message when deleting a file from server fails", async () => {
    const xhrSpy = mockXHRs(200, 500);
    const { getInput, getDeleteButton, waitForSuccessfulUpload } = renderExt(<UploadInput {...requiredProps} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    await waitForSuccessfulUpload();
    await userEvent.click(getDeleteButton());
    await waitFor(() => {
      expect(getDeleteButton()).toBeInTheDocument();
      expect(screen.queryByText(MOCK.filePng2mb.name)).toBeInTheDocument();
    });

    xhrSpy.mockRestore();
  });

  it("should render the delete icon when a file is selected regardless of the upload or error state", async () => {
    const xhrSpy = mockXHRs();
    const { rerender, getInput, getFileItem, getDeleteButton, queryByText, waitForSuccessfulUpload } = renderExt(
      <UploadInput {...requiredProps} accept={["application/pdf"]} />,
    );

    // Error scenario
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    expect(getFileItem().lastChild?.lastChild).toHaveTextContent("error");
    expect(getDeleteButton()).toBeInTheDocument();

    await userEvent.click(getDeleteButton());
    await waitFor(() => {
      expect(getDeleteButton()).not.toBeInTheDocument();
      expect(queryByText(MOCK.filePng2mb.name)).not.toBeInTheDocument();
    });

    rerender(<UploadInput {...requiredProps} />);
    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    await waitForSuccessfulUpload();
    expect(getDeleteButton()).toBeInTheDocument();

    xhrSpy.mockRestore();
  });

  it("should validate each file with the given validate function and show the given error message if fails when customValidation prop is given", async () => {
    const xhrSpy = mockXHRs();
    const errorMessage = "Seçilen dosya formatı hatalı. Uygun formatta dosya seçerek tekrar deneyiniz.";
    const customValidation = (file: File) => ({ isValid: file.type === "application/pdf", errorMessage });

    const { getInput, getFileItem, waitForSuccessfulUpload, actHoverToErrorIcon } = renderExt(
      <UploadInput {...requiredProps} customValidation={customValidation} maxFile={2} />,
    );

    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);
    await waitForSuccessfulUpload();

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    expect(getFileItem().lastChild?.lastChild).toHaveTextContent("error");
    await actHoverToErrorIcon();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    xhrSpy.mockRestore();
  });
});
