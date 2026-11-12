import "@testing-library/jest-dom";
import type { ReactElement } from "react";
import { createElementPropsComparator, isSameElement, mergeRefs, validateChildren, validateElement } from "./reactUtils";
import { rotateArray, shallowEqual } from "./utils";
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

describe("mergeRefs()", () => {
  it("should set object refs and call callback refs, skipping the missing ones", () => {
    const objectRef = { current: null as HTMLDivElement | null };
    const callbackRef = jest.fn();
    const node = document.createElement("div");

    mergeRefs(objectRef, callbackRef, undefined, null)(node);
    expect(objectRef.current).toBe(node);
    expect(callbackRef).toHaveBeenCalledWith(node);

    mergeRefs(objectRef, callbackRef)(null);
    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
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

describe("shallowEqual()", () => {
  it("should be true for objects with the same keys and identical values", () => {
    const shared = {};
    expect(shallowEqual({ a: 1, b: shared, c: NaN }, { a: 1, b: shared, c: NaN })).toBe(true);
  });

  it("should be false when a value differs by reference", () => {
    expect(shallowEqual({ a: {} }, { a: {} })).toBe(false);
  });

  it("should be false when the keys differ", () => {
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(shallowEqual({ a: undefined }, { b: undefined })).toBe(false);
  });
});

describe("isSameElement()", () => {
  const Comp = ({ name }: { name: string }) => <span>{name}</span>;

  it("should be true for identical values", () => {
    expect(isSameElement("home", "home")).toBe(true);
    expect(isSameElement(undefined, undefined)).toBe(true);
  });

  it("should be true for elements with the same type, key and shallowly equal props", () => {
    expect(isSameElement(<Comp name="home" />, <Comp name="home" />)).toBe(true);
  });

  it("should be false when the type, key or a prop differs", () => {
    expect(isSameElement(<Comp name="home" />, <Comp name="info" />)).toBe(false);
    expect(isSameElement(<Comp key="a" name="home" />, <Comp key="b" name="home" />)).toBe(false);
    expect(isSameElement(<span>home</span>, <i>home</i>)).toBe(false);
  });

  it("should be false for elements with nested element children", () => {
    const nested = () => (
      <span>
        <i />
      </span>
    );
    expect(isSameElement(nested(), nested())).toBe(false);
  });
});

describe("createElementPropsComparator()", () => {
  type Props = { icon?: ReactElement | string; size?: string };
  const Comp = ({ name }: { name: string }) => <span>{name}</span>;
  const arePropsEqual = createElementPropsComparator<Props>("icon");

  it("should be true when the element prop is an equal inline element and the other props are the same", () => {
    expect(arePropsEqual({ icon: <Comp name="home" />, size: "md" }, { icon: <Comp name="home" />, size: "md" })).toBe(true);
  });

  it("should be false when the element prop differs", () => {
    expect(arePropsEqual({ icon: <Comp name="home" /> }, { icon: <Comp name="info" /> })).toBe(false);
  });

  it("should be false when another prop differs", () => {
    expect(arePropsEqual({ icon: "home", size: "md" }, { icon: "home", size: "lg" })).toBe(false);
  });
});
