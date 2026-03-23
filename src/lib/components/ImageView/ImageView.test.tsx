import { render, screen, waitFor, act } from "@testing-library/react";
import ImageView from "./ImageView";
import { BROKEN_IMG_SRC } from "./constants";

const src = "https://picsum.photos/200";

describe("ImageView", () => {
  it("should be rendered with only required props", () => {
    expect(render(<ImageView src={src} />).container).toMatchSnapshot();
  });

  it("should render image when src prop is given", () => {
    render(<ImageView src={src} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", src);
  });

  it("should render a placeholder image until the image is loaded", async () => {
    render(<ImageView src={src} width={200} height={300} />);
    const imgElement = screen.getByRole("img");
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveClass("placeholder");

    act(() => {
      imgElement.dispatchEvent(new Event("load"));
    });
    await waitFor(() => {
      expect(imgElement).not.toHaveClass("placeholder");
    });
  });

  it("should display the alt text for the image", () => {
    render(<ImageView src={src} alt="Alt Text" />);
    expect(screen.getByAltText("Alt Text")).toBeInTheDocument();
  });

  it("should render image width with the given width prop", () => {
    const { rerender } = render(<ImageView src={src} width={300} />);
    expect(screen.getByRole("img")).toHaveStyle("width:300px");
    rerender(<ImageView src={src} width="300rem" />);
    expect(screen.getByRole("img")).toHaveStyle("width:300rem");
    rerender(<ImageView src={src} width="300%" />);
    expect(screen.getByRole("img")).toHaveStyle("width:300%");
  });

  it("should render image height with the given height prop", () => {
    const { rerender } = render(<ImageView src={src} height={300} />);
    expect(screen.getByRole("img")).toHaveStyle("height:300px");
    rerender(<ImageView src={src} height="300rem" />);
    expect(screen.getByRole("img")).toHaveStyle("height:300rem");
    rerender(<ImageView src={src} height="300%" />);
    expect(screen.getByRole("img")).toHaveStyle("height:300%");
  });

  it("should have given aspect ratio prop in the element attributes", () => {
    render(<ImageView src={src} width={300} aspectRatio={1} />);
    expect(screen.getByRole("img")).toHaveStyle("width:300px");
    expect(screen.getByRole("img").style.aspectRatio).toBe("1");
  });

  it("should resize the image with the given scaleType prop", () => {
    const { rerender } = render(<ImageView src={src} scaleType="original" width={200} height={300} />);
    const imgElement = screen.getByRole("img");
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveClass("original");

    rerender(<ImageView src={src} scaleType="original" width={200} aspectRatio={1} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement.style.aspectRatio).toBe("1");

    rerender(<ImageView src={src} scaleType="original" height={200} aspectRatio={1} />);
    expect(imgElement).toHaveStyle("height:200px");
    expect(imgElement.style.aspectRatio).toBe("1");

    rerender(<ImageView src={src} scaleType="fill" width={200} height={300} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveClass("fill");

    rerender(<ImageView src={src} scaleType="fit" width={200} height={300} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveClass("fit");

    rerender(<ImageView src={src} scaleType="fillKeepAspectRatio" width={200} height={300} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveClass("fillKeepAspectRatio");
  });

  it("should be positioned at top left by default", () => {
    render(<ImageView src={src} width={200} height={300} />);
    const imgElement = screen.getByRole("img");
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveStyle("objectPosition: top left");
  });

  it("image should be vertically aligned by the positionVertical prop", () => {
    const { rerender } = render(<ImageView src={src} positionVertical="top" positionHorizontal="left" width={200} height={300} />);
    const imgElement = screen.getByRole("img");
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveStyle("objectPosition: top left");

    rerender(<ImageView src={src} positionVertical="top" positionHorizontal="left" width={200} aspectRatio={1} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement.style.aspectRatio).toBe("1");

    rerender(<ImageView src={src} positionVertical="top" positionHorizontal="left" height={200} aspectRatio={1} />);
    expect(imgElement).toHaveStyle("height:200px");
    expect(imgElement.style.aspectRatio).toBe("1");

    rerender(<ImageView src={src} positionVertical="center" positionHorizontal="left" width={200} height={300} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveStyle("objectPosition: center left");

    rerender(<ImageView src={src} positionVertical="bottom" positionHorizontal="left" width={200} height={300} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveStyle("objectPosition: bottom left");
  });

  it("image should be horizontally aligned by the positionHorizontal prop", () => {
    const { rerender } = render(<ImageView src={src} positionHorizontal="center" positionVertical="top" width={200} height={300} />);
    const imgElement = screen.getByRole("img");
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveStyle("objectPosition : top center");

    rerender(<ImageView src={src} positionHorizontal="center" positionVertical="top" width={200} aspectRatio={1} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement.style.aspectRatio).toBe("1");

    rerender(<ImageView src={src} positionHorizontal="center" positionVertical="top" height={300} aspectRatio={1} />);
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement.style.aspectRatio).toBe("1");

    rerender(<ImageView src={src} positionHorizontal="left" positionVertical="top" width={200} height={300} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveStyle("objectPosition : top left");

    rerender(<ImageView src={src} positionHorizontal="right" positionVertical="top" width={200} height={300} />);
    expect(imgElement).toHaveStyle("width:200px");
    expect(imgElement).toHaveStyle("height:300px");
    expect(imgElement).toHaveStyle("objectPosition : top right");
  });

  it("should fire onImageLoaded when the image is loaded", async () => {
    const onImageLoaded = jest.fn();
    render(<ImageView src={src} onImageLoaded={onImageLoaded} />);
    act(() => {
      screen.getByRole("img").dispatchEvent(new Event("load"));
    });
    await waitFor(() => {
      expect(onImageLoaded).toHaveBeenCalledTimes(1);
    });
  });

  it("should have a solid background when solid prop is true", () => {
    render(<ImageView src={src} solid />);
    expect(screen.getByRole("img")).toHaveClass("solid");
  });

  it("should render a border when bordered prop is true", () => {
    render(<ImageView src={src} bordered />);
    expect(screen.getByRole("img")).toHaveClass("bordered");
  });

  it("should show a broken image if the image fails to load", async () => {
    render(<ImageView src={src} />);
    const imgElement = screen.getByRole("img");
    act(() => {
      imgElement.dispatchEvent(new Event("error"));
    });
    await waitFor(() => {
      expect(imgElement.getAttribute("src")).toBe(BROKEN_IMG_SRC);
    });
  });
});
