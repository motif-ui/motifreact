import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MESSAGE } from "@/components/Upload/constants";
import "@testing-library/jest-dom";
import { ReactNode } from "react";

export const simulateChooseFiles = async (input: Element | null, files: File[]) => {
  if (!input) throw new Error("Input element is null or undefined");
  await act(() => fireEvent.change(input, { target: { files } }));
};

export const simulateDrop = async (dragArea: Element | null, files: File[]) => {
  if (!dragArea) throw new Error("Input element is null or undefined");
  await act(() => fireEvent.drop(dragArea, { dataTransfer: { files } }));
};

export const renderExtUploadFileList = (ui: ReactNode) => {
  const result = render(ui);

  const getInput = () => result.container.querySelector("input") as HTMLInputElement;

  const getFileList = () => result.queryByTestId("uploadFileList");

  const getDeleteButton = (index?: number) =>
    (index === undefined ? screen.queryByText("delete") : screen.queryAllByText("delete")[index]) as HTMLButtonElement;

  const getFileItemFirst = () => getFileList()?.firstChild as HTMLDivElement;

  const getFileItemLast = () => getFileList()?.lastChild as HTMLDivElement;

  const getUploadButton = () => screen.queryByText("Yükle")?.parentElement as HTMLButtonElement;

  const getDragArea = () => result.container.firstElementChild?.firstChild as Element;

  return {
    ...result,
    getInput,
    getFileItemFirst,
    getFileItemLast,
    getFileList,
    getDeleteButton,
    getUploadButton,
    getDragArea,
  };
};

export const waitForSuccessfulUpload = (fileItem: HTMLDivElement) =>
  waitFor(() => expect(fileItem).toHaveTextContent(mockT(MESSAGE.UPLOAD_SUCCESS)));
