import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import GlobalIconWrapper from "./GlobalIconWrapper";
import { runIconPropTest } from "../../../../utils/testUtils";

describe("GlobalIconWrapper", () => {
  it("should render the main icon given in the icon prop", () => {
    runIconPropTest(icon => render(<GlobalIconWrapper icon={icon} className="testClass" />), "testClass");
  });
});
