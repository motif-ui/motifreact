import Card from "@/components/Card/Card";
import { render, screen } from "@testing-library/react";
import Button from "@/components/Button";
import Link from "@/components/Link";
import IconButton from "@/components/IconButton";

describe("Card", () => {
  it("should be rendered with only required props", () => {
    expect(render(<Card />).container).toMatchSnapshot();
  });

  it("should render header part when title or subtitle or avatarText or icon or image or action is set", () => {
    const { rerender } = render(<Card title="title" />);
    expect(screen.getByTestId("cardHeader")).toBeInTheDocument();
    rerender(<Card subtitle="subtitle" />);
    expect(screen.getByTestId("cardHeader")).toBeInTheDocument();
    rerender(<Card avatarText="AB" />);
    expect(screen.getByTestId("cardHeader")).toBeInTheDocument();
    rerender(<Card icon="folder" />);
    expect(screen.getByTestId("cardHeader")).toBeInTheDocument();
    rerender(<Card image="/imagePath" />);
    expect(screen.getByTestId("cardHeader")).toBeInTheDocument();
    rerender(<Card action={{ icon: "download", onClick: () => {} }} />);
    expect(screen.getByTestId("cardHeader")).toBeInTheDocument();
  });

  it("should render content part when contentText or contentTitle or contentSubtitle or contentImage or children is set", () => {
    const { rerender } = render(<Card contentTitle="title" />);
    expect(screen.getByTestId("cardContent")).toBeInTheDocument();
    rerender(<Card contentSubtitle="subtitle" />);
    expect(screen.getByTestId("cardContent")).toBeInTheDocument();
    rerender(<Card contentText="text" />);
    expect(screen.getByTestId("cardContent")).toBeInTheDocument();
    rerender(<Card contentImage="/imagePath" />);
    expect(screen.getByTestId("cardContent")).toBeInTheDocument();
    rerender(
      <Card>
        <div>child</div>
      </Card>,
    );
    expect(screen.getByTestId("cardContent")).toBeInTheDocument();
  });

  it("should render action part contentActionButton or contentAlternateButton or buttons is set", () => {
    const { rerender } = render(<Card contentActionButton={{ text: "action", onClick: () => {} }} />);
    expect(screen.getByTestId("cardActions")).toBeInTheDocument();
    rerender(<Card contentAlternateButton={{ text: "alternate", onClick: () => {} }} />);
    expect(screen.getByTestId("cardActions")).toBeInTheDocument();
    rerender(<Card buttons={[<Button label="button" key="1" />]} />);
    expect(screen.getByTestId("cardActions")).toBeInTheDocument();
  });

  it("should render image in the header part when image is set as a url or path", () => {
    const path = "/imagePath";
    render(<Card image={path} />);
    const displayedImage = document.querySelector("img") as HTMLImageElement;
    expect(displayedImage.src).toContain(path);
  });

  it("should render icon in the header when icon name is set", () => {
    render(<Card icon="folder" />);
    expect(screen.getByText("folder")).toBeInTheDocument();
  });

  it("should render avatar text when avatarText is set", () => {
    render(<Card avatarText="AB" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("should should give precendence to icon prop when icon and avatarText is both set", () => {
    render(<Card icon="folder" avatarText="AB" />);
    expect(screen.getByText("folder")).toBeInTheDocument();
    expect(screen.queryByText("AB")).not.toBeInTheDocument();
  });

  it("should position the given image correctly considering the imagePosition property", () => {
    const { rerender } = render(<Card image="/imagePath" />);
    expect(screen.getByTestId("cardHeader")).not.toHaveClass("headerImageAlignRight");
    rerender(<Card image="/imagePath" imagePosition="right" />);
    expect(screen.getByTestId("cardHeader")).toHaveClass("headerImageAlignRight");
  });

  it("should render title in the header when title is given", () => {
    render(<Card title="title" />);
    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("should render subtitle in the header when subtitle is given", () => {
    render(<Card subtitle="subtitle" />);
    expect(screen.getByText("subtitle")).toBeInTheDocument();
  });

  it("should render given action icon in the header and trigger the action when action prop is set", () => {
    const onClick = jest.fn();
    render(<Card action={{ icon: "download", onClick }} />);
    screen.getByText("download").click();
    expect(onClick).toHaveBeenCalled();
  });

  it("should render an image in the content part when contentImage is set as a url or path", () => {
    const path = "/imagePath";
    render(<Card contentImage={path} />);
    const displayedImage = document.querySelector("img") as HTMLImageElement;
    expect(displayedImage.src).toContain(path);
  });

  it("should render title in the content part when contentTitle is given", () => {
    render(<Card contentTitle="title" />);
    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("should render subtitle in the content part when contentSubtitle is given", () => {
    render(<Card contentSubtitle="subtitle" />);
    expect(screen.getByText("subtitle")).toBeInTheDocument();
  });

  it("should render text in the content part when text is given ", () => {
    render(<Card contentText="text" />);
    expect(screen.getByText("text")).toBeInTheDocument();
  });

  it("should render link in the content part, redirect the given link and consider the related targetBlank prop when contentLink prop is set", () => {
    const { rerender } = render(<Card contentLink={{ text: "Motif Content Link", href: "https://motif-ui.com/", targetBlank: true }} />);
    const contentLink = screen.getByText("Motif Content Link");
    expect(contentLink).toHaveAttribute("href", "https://motif-ui.com/");
    expect(contentLink).toHaveAttribute("target", "_blank");

    rerender(<Card contentLink={{ text: "Motif Content Link", href: "https://motif-ui.com/", targetBlank: false }} />);
    expect(contentLink).not.toHaveAttribute("target", "_blank");
  });

  it("should render link in the content part, redirect the given link and consider the related targetBlank prop when contentActionLink prop is set ", () => {
    const { rerender } = render(<Card contentActionLink={{ text: "Motif Link", href: "https://motif-ui.com/", targetBlank: true }} />);
    const contentActionLink = screen.getByText("Motif Link").parentElement;
    expect(contentActionLink).toHaveAttribute("href", "https://motif-ui.com/");
    expect(contentActionLink).toHaveAttribute("target", "_blank");

    rerender(<Card contentActionLink={{ text: "Motif Link", href: "https://motif-ui.com/", targetBlank: false }} />);
    expect(contentActionLink).not.toHaveAttribute("target", "_blank");
  });

  it("should render the icon given in the 'icon' property of the contentActionLink", () => {
    render(<Card contentActionLink={{ text: "Motif Link", href: "https://motif-ui.com/", icon: "arrow_forward" }} />);
    expect(screen.getByText("arrow_forward")).toBeInTheDocument();
  });

  it("should render action button in the content part and trigger the given action when actionButton prop is set", () => {
    const onClick = jest.fn();
    render(<Card contentActionButton={{ text: "action", onClick }} />);
    screen.getByText("action").click();
    expect(onClick).toHaveBeenCalled();
  });

  it("should render alternate button in the content part and trigger the given action when alternateButton prop is set", () => {
    const onClick = jest.fn();
    render(<Card contentAlternateButton={{ text: "alternate", onClick }} />);
    screen.getByText("alternate").click();
    expect(onClick).toHaveBeenCalled();
  });

  it("should render additional buttons when buttons prop is set", () => {
    render(
      <Card
        buttons={[
          <Button key="1" label="button 1" />,
          <Link key="2" label="motif link" url="https://motif-ui.com" />,
          <IconButton name="download" key="3" />,
        ]}
      />,
    );
    expect(screen.getByText("button 1")).toBeInTheDocument();
    expect(screen.getByText("motif link")).toBeInTheDocument();
    expect(screen.getByText("download")).toBeInTheDocument();
  });

  it("should render additional buttons alongside with other action buttons when they are all set", () => {
    render(
      <Card
        contentActionButton={{ text: "action", onClick: () => {} }}
        contentAlternateButton={{ text: "alternate", onClick: () => {} }}
        buttons={[<IconButton name="download" key="3" />]}
      />,
    );
    expect(screen.getByText("action")).toBeInTheDocument();
    expect(screen.getByText("alternate")).toBeInTheDocument();
    expect(screen.getByText("download")).toBeInTheDocument();
  });

  it("should render children in the content part", () => {
    render(
      <Card>
        <div>child 1</div>
        <button>child 2</button>
        <input placeholder="child 3" />
      </Card>,
    );
    expect(screen.getByText("child 1")).toBeInTheDocument();
    expect(screen.getByText("child 2")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("child 3")).toBeInTheDocument();
  });

  it("should render children with the given text props", () => {
    render(
      <Card contentText="text" contentSubtitle="subtitle" contentTitle="title">
        <div>child 1</div>
      </Card>,
    );
    expect(screen.getByText("text")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("child 1")).toBeInTheDocument();
  });
});
