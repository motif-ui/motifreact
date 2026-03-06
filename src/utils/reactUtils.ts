import { isValidElement, Children, ReactElement, ReactNode } from "react";

/**
 * Validates children with allowed element types.
 *
 * @summary This function is used as a helper to check if children of a React Component only contains allowed children and throws an error otherwise.
 *
 * @param {React.ReactNode} children          Children property of a React Component.
 * @param {string[]}        allowedChildren   Types of children that are allowed in.
 *
 * @throws Error if any child element is not included in ${allowedChildren}.
 *
 */
export const validateChildren = (children: ReactNode, allowedChildren: string[]) => {
  Children.forEach(children, child => {
    const isValid = _isAllowed(child as ReactElement, allowedChildren);
    const childType = _getType(child as ReactElement);
    if (!isValid) {
      throw new Error(
        `Children of type "${childType}" aren't permitted. Only the following child elements are allowed in this component: ${allowedChildren.join(", ")}`,
      );
    }
  });
};

/**
 * Validates element with allowed element types.
 *
 * @summary This function is used as a helper to check if the given element is one of the allowed ones and throws an error otherwise.
 *
 * @param {React.ReactElement}  element           Element to check.
 * @param {string[]}            allowedElements   Types of elements that are allowed in.
 *
 * @throws Error if the element is not included in ${allowedChildren}.
 *
 */
export const validateElement = (element: ReactNode, allowedElements: string[]) => {
  const isValid = _isAllowed(element as ReactElement, allowedElements);
  const type = _getType(element as ReactElement);
  if (!isValid) {
    throw new Error(`Element of type "${type}" isn't permitted. Only the following elements are allowed: ${allowedElements.join(", ")}`);
  }
};

const getDisplayName = (type: unknown) =>
  (type as { displayName?: string }).displayName ??
  (type as { render?: { displayName?: string } }).render?.displayName ??
  "UnknownComponent";

const _getType = (child: ReactElement): string => (typeof child.type === "string" ? child.type : getDisplayName(child.type));
const _isSupportedElement = (child: ReactElement, allowedChildren: string[]) => allowedChildren.some(c => c === _getType(child));
const _isAllowed = (element: ReactElement, allowedElements: string[]) =>
  isValidElement(element) && _isSupportedElement(element, allowedElements);
