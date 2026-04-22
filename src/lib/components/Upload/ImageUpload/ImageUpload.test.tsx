import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { simulateDrop, simulateChooseFiles, renderExtUploadFileList } from "@/components/Upload/testHelper";
import { formatBytes, shortenText } from "../../../../utils/utils";
import { MESSAGE } from "@/components/Upload/constants";
import ImageUpload from "@/components/Upload/ImageUpload/ImageUpload";
import { ImageUploadProps } from "@/components/Upload/ImageUpload/types";
import { MOCK } from "../mock";
import { mockXHRs, t } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";

type ImageUploadRequiredProps = Pick<ImageUploadProps, "uploadRequest" | "deleteRequest">;

describe("ImageUpload", () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalCreateObjectURL = global.URL.createObjectURL;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalRevokeObjectURL = global.URL.revokeObjectURL;
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  let xhrSpy: ReturnType<typeof mockXHRs>;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "mock-object-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  afterAll(() => {
    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  beforeEach(() => {
    xhrSpy = mockXHRs();
  });

  afterEach(() => {
    xhrSpy.mockRestore();
  });

  const mockWindowSize = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", { value: width, writable: true });
    Object.defineProperty(window, "innerHeight", { value: height, writable: true });
  };

  const mockImageLoad = (img: HTMLElement, naturalWidth: number, naturalHeight: number) => {
    Object.defineProperty(img, "naturalWidth", { value: naturalWidth, configurable: true });
    Object.defineProperty(img, "naturalHeight", { value: naturalHeight, configurable: true });
    act(() => {
      img.dispatchEvent(new Event("load"));
    });
  };

  const resetWindowSize = () => mockWindowSize(originalInnerWidth, originalInnerHeight);

  const getTransformScale = (el: HTMLElement) => {
    const match = el.style.transform.match(/scale\(([^)]+)\)/);
    return match ? parseFloat(match[1]) : NaN;
  };

  const renderExt = (ui: ReactElement) => {
    const result = renderExtUploadFileList(ui);
    return {
      ...result,
      getThumbnail: () => screen.queryByAltText("Image Thumbnail"),
    };
  };

  const requiredProps: ImageUploadRequiredProps = {
    uploadRequest: MOCK.uploadRequest,
    deleteRequest: MOCK.deleteRequest,
  };

  const simulateImageUpload = async () => {
    const renderResult = renderExt(<ImageUpload {...requiredProps} />);

    await simulateChooseFiles(renderResult.getInput(), [MOCK.fileJpeg1kb]);
    await waitFor(() => {
      expect(renderResult.getThumbnail()).toBeInTheDocument();
    });

    return renderResult;
  };

  const simulateImageUploadAndPreviewClick = async () => {
    await simulateImageUpload();

    await userEvent.click(screen.getByText("visibility"));
    const previewImage = screen.queryByAltText("Image Preview")!;
    await waitFor(() => expect(previewImage).toBeInTheDocument());

    const previewInitialScale = getTransformScale(previewImage);

    const getButton = (name: string) => screen.getAllByText(name)[0];
    const zoomInButton = getButton("add");
    const zoomOutButton = getButton("remove");
    const rotateLeftButton = getButton("undo");
    const rotateRightButton = getButton("redo");

    return {
      previewImage,
      previewInitialScale,
      zoomInButton,
      zoomOutButton,
      rotateLeftButton,
      rotateRightButton,
    };
  };

  const verifyUploadError = async (getThumbnail: () => HTMLElement | null) => {
    await waitFor(() => {
      expect(screen.queryByText(t(MESSAGE.UPLOAD_ERROR))).toBeInTheDocument();
    });

    expect(getThumbnail()).not.toBeInTheDocument();
    expect(screen.queryByText("imagesmode")).toBeInTheDocument();
  };

  it("should be rendered with only required props", () => {
    expect(renderExt(<ImageUpload {...requiredProps} />).container).toMatchSnapshot();
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes = ["sm", "md", "lg"] as const;
    sizes.forEach(size => {
      const { container, unmount } = renderExt(<ImageUpload {...requiredProps} size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
      unmount();
    });
  });

  it("should only allow image files to be selected and shown in the thumbnail", async () => {
    const { getInput, getThumbnail } = renderExt(<ImageUpload {...requiredProps} />);

    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);

    await waitFor(() => {
      expect(screen.queryByText(/Only.*format files can be uploaded\. Your file format: 'application\/pdf'/)).toBeInTheDocument();
    });

    expect(getThumbnail()).not.toBeInTheDocument();
  });

  it("should upload the image when customValidation prop is given and the given file passes the validation", async () => {
    const customValidation = (file: File) => ({
      isValid: file.size < 2000,
      errorMessage: "File is too small.",
    });
    const { getInput, getThumbnail } = renderExt(<ImageUpload {...requiredProps} customValidation={customValidation} />);
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    await waitFor(() => {
      expect(getThumbnail()).toBeInTheDocument();
    });
    expect(screen.queryByText("Choose or drag an image")).not.toBeInTheDocument();
    expect(screen.queryByText("File is too small.")).not.toBeInTheDocument();
  });

  it("should not upload the image when customValidation prop is given and the given file fails the validation", async () => {
    const customErrorMessage = "The file is too large.";
    const customValidation = (file: File) => ({
      isValid: file.size < 1000000,
      errorMessage: customErrorMessage,
    });
    const { getInput, getThumbnail } = renderExt(<ImageUpload {...requiredProps} customValidation={customValidation} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);
    await waitFor(() => {
      expect(screen.queryByText(customErrorMessage)).toBeInTheDocument();
    });
    expect(getThumbnail()).not.toBeInTheDocument();
  });

  it("should allow uploading single image file", async () => {
    const { getInput, getThumbnail } = renderExt(<ImageUpload {...requiredProps} />);

    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb, MOCK.fileGif1mb]);

    await waitFor(() => {
      expect(getThumbnail()).toBeInTheDocument();
    });

    const uploadedSrc = getThumbnail()!.getAttribute("src");
    expect(uploadedSrc).toBeTruthy();
    expect(uploadedSrc).toBe("mock-object-url");

    expect(screen.queryByText("Choose or drag an image")).not.toBeInTheDocument();
  });

  it("should not upload files larger than the size specified in maxSize prop", async () => {
    const maxSize = 500000;
    const expectedErrorMessage = t(MESSAGE.MAX_SIZE_ERROR, {
      maxSize: formatBytes(maxSize),
      fileName: shortenText(MOCK.filePng2mb.name, 30),
      fileSize: formatBytes(MOCK.filePng2mb.size),
    });
    const { getInput, getThumbnail } = renderExt(<ImageUpload {...requiredProps} maxSize={maxSize} />);
    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);

    await waitFor(() => {
      expect(screen.queryByText(expectedErrorMessage)).toBeInTheDocument();
    });
    expect(getThumbnail()).not.toBeInTheDocument();
  });

  it("should upload image when file is dropped into the drag area", async () => {
    const { getDragArea, getThumbnail } = renderExt(<ImageUpload {...requiredProps} />);

    await simulateDrop(getDragArea(), [MOCK.fileJpeg1kb]);

    await waitFor(() => {
      expect(getThumbnail()).toBeInTheDocument();
    });
  });

  it("should render preview and delete buttons when image is uploaded successfully", async () => {
    await simulateImageUpload();

    expect(screen.getByText("visibility")).toBeInTheDocument();
    expect(screen.getByText("delete")).toBeInTheDocument();
  });

  it("should delete the image when delete button is clicked", async () => {
    xhrSpy = mockXHRs(200, 200);
    const { getInput, getDeleteButton, getThumbnail } = renderExt(<ImageUpload {...requiredProps} />);

    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);

    await waitFor(() => {
      expect(getThumbnail()).toBeInTheDocument();
    });

    expect(getDeleteButton()).toBeInTheDocument();
    await userEvent.click(getDeleteButton());

    await waitFor(() => {
      expect(getThumbnail()).not.toBeInTheDocument();
    });

    expect(screen.getByText(t("upload.message.chooseOrDragImage"))).toBeInTheDocument();
  });

  it("should show preview when preview button is clicked", async () => {
    await simulateImageUploadAndPreviewClick();
  });

  it("should render a generic error message with file name in it along with an error icon when upload fails", async () => {
    xhrSpy = mockXHRs(500);
    const { getInput } = renderExt(<ImageUpload {...requiredProps} />);

    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);

    await waitFor(() => {
      expect(screen.queryByText(t(MESSAGE.UPLOAD_ERROR))).toBeInTheDocument();
    });

    const errorIcon = screen.getByText("imagesmode");
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass("danger");
  });

  it("should allow to upload another file from scratch when an error happens", async () => {
    xhrSpy = mockXHRs(500, 200);

    const { getInput, getThumbnail } = renderExt(<ImageUpload {...requiredProps} />);
    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);

    await waitFor(() => {
      expect(screen.queryByText(t(MESSAGE.UPLOAD_ERROR))).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("delete"));

    await waitFor(() => {
      expect(getThumbnail()).not.toBeInTheDocument();
    });

    expect(screen.getByText(t("upload.message.chooseOrDragImage"))).toBeInTheDocument();

    await simulateChooseFiles(getInput(), [MOCK.fileGif1mb]);

    await waitFor(() => {
      expect(getThumbnail()).toBeInTheDocument();
    });
  });

  it("should not allow dropping another file when there is already a file uploaded", async () => {
    const { getInput, getDragArea, getThumbnail } = renderExt(<ImageUpload {...requiredProps} />);

    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);

    await waitFor(() => {
      expect(getThumbnail()).toBeInTheDocument();
    });

    const firstSrc = getThumbnail()!.getAttribute("src");

    await simulateDrop(getDragArea(), [MOCK.fileGif1mb]);

    await waitFor(() => {
      expect(getThumbnail()!.getAttribute("src")).toBe(firstSrc);
    });
  });

  it("should not remove the current thumbnail when delete button is clicked and delete process is failed", async () => {
    xhrSpy = mockXHRs(200, 500);
    const { getInput, getDeleteButton, getThumbnail } = renderExt(<ImageUpload {...requiredProps} />);

    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);

    await waitFor(() => {
      expect(getThumbnail()).toBeInTheDocument();
    });

    await userEvent.click(getDeleteButton());

    await waitFor(() => {
      expect(screen.queryByText(t(MESSAGE.DELETE_ERROR))).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getThumbnail()).toBeInTheDocument();
    });

    expect(getDeleteButton()).toBeInTheDocument();
  });

  it("should allow zooming in/out on preview", async () => {
    const { previewImage, previewInitialScale, zoomInButton, zoomOutButton } = await simulateImageUploadAndPreviewClick();

    await userEvent.click(zoomInButton);

    await waitFor(() => {
      const zoomedInScale = getTransformScale(previewImage);
      expect(zoomedInScale).toBeGreaterThan(previewInitialScale);
    });

    const zoomedInScale = getTransformScale(previewImage);

    await userEvent.click(zoomOutButton);

    await waitFor(() => {
      const zoomedOutScale = getTransformScale(previewImage);
      expect(zoomedOutScale).toBeLessThan(zoomedInScale);
    });
  });

  it("should change preview scale by 1.25x on each zoom click", async () => {
    const { previewImage, previewInitialScale, zoomInButton, zoomOutButton } = await simulateImageUploadAndPreviewClick();

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(previewInitialScale * 1.25));

    await userEvent.click(zoomOutButton);
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(previewInitialScale));
    await userEvent.click(zoomOutButton);
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(previewInitialScale * 0.8));
  });

  it("should render initial preview image without exceeding the browser size", async () => {
    mockWindowSize(1000, 800);
    const { previewImage } = await simulateImageUploadAndPreviewClick();

    // Image larger than browser
    mockImageLoad(previewImage, 2000, 1000);
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(1));

    // Image smaller than browser
    mockImageLoad(previewImage, 500, 400);
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(1));

    // Image with different aspect ratio (tests smaller fit ratio)
    mockImageLoad(previewImage, 4000, 1000);
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(1));

    resetWindowSize();
  });

  it("should constrain preview zoom between 0.5x and 2x browser size when preview natural size is within these limits", async () => {
    const { previewImage, zoomInButton, zoomOutButton } = await simulateImageUploadAndPreviewClick();

    // Zoom in to max
    while (!zoomInButton.hasAttribute("disabled")) {
      await userEvent.click(zoomInButton);
    }
    expect(zoomInButton).toBeDisabled();
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(2));

    // Zoom out to min
    while (!zoomOutButton.hasAttribute("disabled")) {
      await userEvent.click(zoomOutButton);
    }
    expect(zoomOutButton).toBeDisabled();
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(0.5));
  });

  it("should disable zoom out and render the preview at natural size for images smaller than min zoom threshold (0.5x)", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton, zoomOutButton } = await simulateImageUploadAndPreviewClick();

    mockImageLoad(previewImage, 200, 160);

    await waitFor(() => expect(getTransformScale(previewImage)).toBe(1));

    expect(zoomOutButton).toBeDisabled();
    expect(zoomInButton).not.toBeDisabled();

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(getTransformScale(previewImage)).toBeGreaterThan(1));

    resetWindowSize();
  });

  it("should extend preview zoom in limit to preview natural size when it's size is bigger than 2x browser size", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton } = await simulateImageUploadAndPreviewClick();

    mockImageLoad(previewImage, 4000, 3200);

    await waitFor(() => expect(getTransformScale(previewImage)).toBe(1));

    // Zoom in to max (limited to natural size = 4x cssScale)
    while (!zoomInButton.hasAttribute("disabled")) {
      await userEvent.click(zoomInButton);
    }
    await waitFor(() => expect(getTransformScale(previewImage)).toBe(4));

    resetWindowSize();
  });

  it("should rotate image to the direction of the rotation button that is clicked on preview", async () => {
    const { previewImage, rotateLeftButton, rotateRightButton } = await simulateImageUploadAndPreviewClick();

    // Right button
    await userEvent.click(rotateRightButton);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("rotate(90deg)");
    });

    // Left button
    await userEvent.click(rotateLeftButton);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("rotate(0deg)");
    });
  });

  it("should keep the same scale when rotated while zoomed in", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton, rotateRightButton } = await simulateImageUploadAndPreviewClick();
    mockImageLoad(previewImage, 2000, 1000);

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(previewImage.style.transform).toContain("scale(1.25)"));

    await userEvent.click(rotateRightButton);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("rotate(90deg)");
      expect(previewImage.style.transform).toContain("scale(1.25)");
    });

    resetWindowSize();
  });

  it("should clamp drag position to new boundaries when rotated while zoomed and dragged", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton, rotateRightButton } = await simulateImageUploadAndPreviewClick();
    mockImageLoad(previewImage, 2000, 1000);

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(previewImage.style.transform).toContain("scale(1.25)"));

    fireEvent.mouseDown(previewImage, { clientX: 500, clientY: 400 });
    fireEvent.mouseMove(window, { clientX: 5000, clientY: 400 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("translate(125px, 0px)");
    });

    await userEvent.click(rotateRightButton);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("rotate(90deg)");
      expect(previewImage.style.transform).toContain("translate(0px, 0px)");
    });

    resetWindowSize();
  });

  it("should allow dragging the image when zoomed image exceeds browser size via mouse", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton } = await simulateImageUploadAndPreviewClick();
    mockImageLoad(previewImage, 2000, 1000);

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(previewImage.style.transform).toContain("scale(1.25)"));

    fireEvent.mouseDown(previewImage, { clientX: 500, clientY: 400 });
    fireEvent.mouseMove(window, { clientX: 550, clientY: 400 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("translate(50px,");
    });

    resetWindowSize();
  });

  it("should not allow dragging the image when not zoomed in", async () => {
    const { previewImage } = await simulateImageUploadAndPreviewClick();

    fireEvent.mouseDown(previewImage, { clientX: 500, clientY: 400 });
    fireEvent.mouseMove(window, { clientX: 600, clientY: 500 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("translate(0px, 0px)");
    });
  });

  it("should not allow dragging when zoomed but image still fits in browser", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton } = await simulateImageUploadAndPreviewClick();
    mockImageLoad(previewImage, 200, 160);

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(getTransformScale(previewImage)).toBeGreaterThan(1));

    fireEvent.mouseDown(previewImage, { clientX: 500, clientY: 400 });
    fireEvent.mouseMove(window, { clientX: 600, clientY: 500 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("translate(0px, 0px)");
    });

    resetWindowSize();
  });

  it("should allow dragging the image when zoomed image exceeds browser size via touch", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton } = await simulateImageUploadAndPreviewClick();
    mockImageLoad(previewImage, 2000, 1000);

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(previewImage.style.transform).toContain("scale(1.25)"));

    fireEvent.touchStart(previewImage, { touches: [{ clientX: 500, clientY: 400 }] });
    fireEvent.touchMove(window, { touches: [{ clientX: 550, clientY: 400 }] });
    fireEvent.touchEnd(window);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("translate(50px,");
    });

    resetWindowSize();
  });

  it("should clamp drag position to image boundaries", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton } = await simulateImageUploadAndPreviewClick();
    mockImageLoad(previewImage, 2000, 1000);

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(previewImage.style.transform).toContain("scale(1.25)"));

    fireEvent.mouseDown(previewImage, { clientX: 500, clientY: 400 });
    fireEvent.mouseMove(window, { clientX: 5000, clientY: 5000 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("translate(125px, 0px)");
    });

    resetWindowSize();
  });

  it("should reset position when zoomed image no longer exceeds browser size", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton, zoomOutButton } = await simulateImageUploadAndPreviewClick();
    mockImageLoad(previewImage, 2000, 1000);

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(previewImage.style.transform).toContain("scale(1.25)"));

    fireEvent.mouseDown(previewImage, { clientX: 500, clientY: 400 });
    fireEvent.mouseMove(window, { clientX: 550, clientY: 400 });
    fireEvent.mouseUp(window);

    await userEvent.click(zoomOutButton);

    await waitFor(() => {
      expect(previewImage.style.transform).toContain("translate(0px, 0px)");
    });

    resetWindowSize();
  });

  it("should close preview when close button on the preview is clicked", async () => {
    const { previewImage } = await simulateImageUploadAndPreviewClick();

    await userEvent.click(screen.getByText("close"));
    await waitFor(() => {
      expect(previewImage).not.toBeInTheDocument();
    });
  });

  it("should close preview when clicked outside", async () => {
    const { previewImage } = await simulateImageUploadAndPreviewClick();

    await userEvent.click(document.body);
    await waitFor(() => {
      expect(previewImage).not.toBeInTheDocument();
    });
  });

  it("should not close preview when drag ends outside the image", async () => {
    mockWindowSize(1000, 800);
    const { previewImage, zoomInButton } = await simulateImageUploadAndPreviewClick();
    mockImageLoad(previewImage, 2000, 1000);

    await userEvent.click(zoomInButton);
    await waitFor(() => expect(previewImage.style.transform).toContain("scale(1.25)"));

    fireEvent.mouseDown(previewImage, { clientX: 500, clientY: 400 });
    fireEvent.mouseMove(window, { clientX: 550, clientY: 400 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(previewImage).toBeInTheDocument();
      expect(previewImage.style.transform).toContain("translate(50px,");
    });

    resetWindowSize();
  });

  it("should not allow image upload when any of the url props in uploadRequest or deleteRequest not available", async () => {
    const { getInput, getThumbnail, getDeleteButton, rerender } = renderExt(
      <ImageUpload uploadRequest={{ url: "", method: "POST" }} deleteRequest={MOCK.deleteRequest} />,
    );

    // Empty uploadRequest.url
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    await verifyUploadError(getThumbnail);
    await userEvent.click(getDeleteButton());

    // Empty deleteRequest.url
    rerender(<ImageUpload uploadRequest={MOCK.uploadRequest} deleteRequest={{ url: "", method: "DELETE" }} />);
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    await verifyUploadError(getThumbnail);
    await userEvent.click(getDeleteButton());

    // Both URLs empty
    rerender(<ImageUpload uploadRequest={{ url: "", method: "POST" }} deleteRequest={{ url: "", method: "DELETE" }} />);
    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    await verifyUploadError(getThumbnail);
  });

  it("should send the headers given in the headers prop of uploadRequest/deleteRequest props", async () => {
    xhrSpy = mockXHRs(200, 200);
    const { getInput, getDeleteButton, getThumbnail } = renderExt(
      <ImageUpload
        uploadRequest={{
          ...MOCK.uploadRequest,
          headers: [
            { key: "Upload-Token", value: "Bearer upload-token" },
            { key: "Upload-Source", value: "web-app" },
          ],
        }}
        deleteRequest={{
          ...MOCK.deleteRequest,
          headers: [
            { key: "Delete-Token", value: "Bearer delete-token" },
            { key: "Delete-Reason", value: "user-request" },
          ],
        }}
      />,
    );

    await simulateChooseFiles(getInput(), [MOCK.fileJpeg1kb]);
    await waitFor(() => expect(getThumbnail()).toBeInTheDocument());

    const uploadXHR = xhrSpy.mock.results[0].value as { setRequestHeader: jest.Mock };
    expect(uploadXHR.setRequestHeader).toHaveBeenCalledWith("Upload-Token", "Bearer upload-token");
    expect(uploadXHR.setRequestHeader).toHaveBeenCalledWith("Upload-Source", "web-app");

    await userEvent.click(getDeleteButton());
    await waitFor(() => expect(getThumbnail()).not.toBeInTheDocument());

    const deleteXHR = xhrSpy.mock.results[1].value as { setRequestHeader: jest.Mock };
    expect(deleteXHR.setRequestHeader).toHaveBeenCalledWith("Delete-Token", "Bearer delete-token");
    expect(deleteXHR.setRequestHeader).toHaveBeenCalledWith("Delete-Reason", "user-request");
  });

  it("should override max size error message when set explicitly", async () => {
    const messages = { maxSizeMessage: "Dosya boyutu çok büyük!" };
    const { getInput, getThumbnail } = renderExt(<ImageUpload {...requiredProps} maxSize={500000} messages={messages} />);

    await simulateChooseFiles(getInput(), [MOCK.filePng2mb]);

    expect(screen.queryByText(messages.maxSizeMessage)).toBeInTheDocument();
    expect(screen.queryByText(/File size must be at most/)).not.toBeInTheDocument();
    expect(getThumbnail()).not.toBeInTheDocument();
  });

  it("should override mime type error message when set explicitly", async () => {
    const messages = { mimeTypeMessage: "Sadece resim dosyaları yükleyebilirsiniz!" };
    const { getInput, getThumbnail } = renderExt(<ImageUpload {...requiredProps} messages={messages} />);

    await simulateChooseFiles(getInput(), [MOCK.filePdf1kb]);

    expect(screen.queryByText(messages.mimeTypeMessage)).toBeInTheDocument();
    expect(screen.queryByText(/Only.*format files can be uploaded/)).not.toBeInTheDocument();
    expect(getThumbnail()).not.toBeInTheDocument();
  });
});
