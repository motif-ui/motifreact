import "@testing-library/jest-dom";
import { validateChildren, validateElement } from "./reactUtils";
import { rotateArray } from "./utils";
import { sanitizeModuleClasses, sanitizeModuleRootClasses } from "./cssUtils";

describe("validateChildren()", () => {
  const AllowedComponent = () => <div>Allowed Component</div>;
  AllowedComponent.displayName = "AllowedComponent";

  it("should not throw an error when children are in allowedChildren", () => {
    const children = [<AllowedComponent key={1} />, <AllowedComponent key={2} />, <div key={3} />];
    expect(() => validateChildren(children, ["AllowedComponent", "div"])).not.toThrow();
  });

  it("should throw an error when any children are not in allowedChildren", () => {
    const children = [<AllowedComponent key={1} />, <div key={1} />];
    expect(() => validateChildren(children, ["AllowedComponent"])).toThrow();
  });
});

describe("validateElement()", () => {
  const AllowedComponent = () => <div>Allowed Component</div>;
  AllowedComponent.displayName = "AllowedComponent";

  it("should not throw an error when given element is in allowedChildren", () => {
    expect(() => validateElement(<AllowedComponent />, ["AllowedComponent", "div"])).not.toThrow();
  });

  it("should throw an error when given element is not in allowedChildren", () => {
    expect(() => validateChildren(<AllowedComponent />, ["div"])).toThrow();
  });
});

describe("rotateArray()", () => {
  const arr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const firstIndex = 0;
  const lastIndex = arr.length - 1;

  it("should rotate the array as given direction", () => {
    const leftRotatedArr = rotateArray(arr, "left", 1);
    expect(leftRotatedArr[firstIndex]).toBe(arr[firstIndex + 1]);
    expect(leftRotatedArr[lastIndex]).toBe(arr[firstIndex]);

    const rightRotatedArr = rotateArray(arr, "right", 1);
    expect(rightRotatedArr[firstIndex]).toBe(arr[lastIndex]);
    expect(rightRotatedArr[lastIndex]).toBe(arr[lastIndex - 1]);
  });

  it("should rotate the array by the given number of steps", () => {
    const step = 3;
    const rightRotatedArr = rotateArray(arr, "right", step);
    expect(rightRotatedArr[firstIndex + step]).toBe(arr[firstIndex]);
    expect(rightRotatedArr[lastIndex]).toBe(arr[lastIndex - step]);
  });

  it("should not change the array when step is given as number of array length or zero", () => {
    const leftRotatedArr = rotateArray(arr, "left", arr.length);
    expect(leftRotatedArr).toEqual(arr);

    const rightRotatedArr = rotateArray(arr, "right", 0);
    expect(rightRotatedArr).toEqual(arr);
  });
});

describe("sanitizeModuleRootClasses()", () => {
  const fakeCssModuleStyles = {
    medium: "size-md",
    rounded: "shape-r",
  };

  it("should return a space-delimited string of class names retrieved from moduleStyles for each propsValues items", () => {
    const componentProps = { size: "medium", shape: "rounded" };
    const { size, shape } = componentProps;

    const result = sanitizeModuleRootClasses(fakeCssModuleStyles, undefined, [size, shape]);
    expect(result).toBe("size-md shape-r");
  });

  it("should return an empty string when globalClass and propsValues are undefined", () => {
    const result = sanitizeModuleRootClasses(fakeCssModuleStyles, undefined);
    expect(result).toBe(undefined);
  });

  it("should return the given globalClass when propsValues is undefined", () => {
    const globalClass = "external-class";
    const result = sanitizeModuleRootClasses(fakeCssModuleStyles, globalClass);
    expect(result).toBe(globalClass);
  });

  it("should not return an undefined class name in the result when a class name for the given propsValues item is not found in moduleStyles", () => {
    const propsWithAdditionalProp = { size: "medium", shape: "rounded", color: "blue" };
    const { size, shape, color } = propsWithAdditionalProp;

    const result = sanitizeModuleRootClasses(fakeCssModuleStyles, undefined, [size, shape, color]);
    expect(result).toBe("size-md shape-r");

    const propsWithUnavailableProp = { size: "small", shape: "rounded" };
    const result2 = sanitizeModuleRootClasses(fakeCssModuleStyles, undefined, [
      propsWithUnavailableProp.size,
      propsWithUnavailableProp.shape,
    ]);
    expect(result2).toBe("shape-r");
  });

  it("should return a space-delimited combined string of globalClass and class names retrieved from moduleStyles for each propsValues items", () => {
    const componentProps = { size: "medium", shape: "rounded" };
    const { size, shape } = componentProps;
    const globalClass = "external-class";

    const result = sanitizeModuleRootClasses(fakeCssModuleStyles, globalClass, [size, shape]);
    expect(result).toBe(`size-md shape-r ${globalClass}`);
  });
});

describe("sanitizeModuleClasses()", () => {
  const fakeCssModuleStyles = {
    medium: "size-md",
    rounded: "shape-r",
  };

  it("should return a space-delimited string of class names retrieved from moduleStyles for each propsValues items", () => {
    const componentProps = { size: "medium", shape: "rounded" };
    const { size, shape } = componentProps;

    const result = sanitizeModuleClasses(fakeCssModuleStyles, size, shape);
    expect(result).toBe("size-md shape-r");
  });

  it("should return an empty string when globalClass and propsValues are undefined", () => {
    const result = sanitizeModuleClasses(fakeCssModuleStyles);
    expect(result).toBe(undefined);
  });

  it("should not return an undefined class name in the result when a class name for the given propsValues item is not found in moduleStyles", () => {
    const propsWithAdditionalProp = { size: "medium", shape: "rounded", color: "blue" };
    const { size, shape, color } = propsWithAdditionalProp;

    const result = sanitizeModuleClasses(fakeCssModuleStyles, size, shape, color);
    expect(result).toBe("size-md shape-r");

    const propsWithUnavailableProp = { size: "small", shape: "rounded" };
    const result2 = sanitizeModuleClasses(fakeCssModuleStyles, propsWithUnavailableProp.size, propsWithUnavailableProp.shape);
    expect(result2).toBe("shape-r");
  });
});
