import { CSSProperties, RefObject, useCallback, useRef, useState } from "react";
import { Position } from "@/components/Tooltip/types";

const positions: Position[] = ["top", "topLeft", "right", "bottomLeft", "bottom", "bottomRight", "left", "topRight"] as const;
const getMaxWidth = (maxWidth: number) => Math.min(maxWidth, 300);

export const usePositionTooltip = (
  position: Position,
  anchorRef: RefObject<HTMLElement | undefined>,
  tooltipRef: RefObject<HTMLDivElement | null>,
) => {
  const [positionStyle, setPositionStyle] = useState<CSSProperties>();
  const tryCounter = useRef(0);
  const lastTriedPosition = useRef<Position>(position);

  const resetPosition = useCallback(() => {
    tryCounter.current = 0;
    lastTriedPosition.current = position;
  }, [position]);

  const getStyleOfPosition = useCallback(
    (positionToPut: Position) => {
      if (!anchorRef.current) return;

      const { top, left, right, bottom, width, height } = anchorRef.current.getBoundingClientRect();
      const { scrollX, scrollY, visualViewport } = window;
      const { offsetLeft } = visualViewport ?? { offsetLeft: 0 };
      const screenWidth = document.documentElement.clientWidth;
      const screenHeight = document.documentElement.clientHeight;

      const bottomForTopPositions = screenHeight - top - scrollY;
      const topForBottomPositions = bottom + scrollY;
      const topForHorizontalPositions = top + scrollY + height / 2;

      switch (positionToPut) {
        case "top":
          return {
            bottom: bottomForTopPositions,
            left: left + scrollX + width / 2,
            transform: "translateX(-50%)",
            maxWidth: getMaxWidth(screenWidth),
          };
        case "bottom":
          return {
            top: topForBottomPositions,
            left: left + scrollX + width / 2,
            transform: "translateX(-50%)",
            maxWidth: getMaxWidth(screenWidth),
          };
        case "right":
          return {
            top: topForHorizontalPositions,
            left: right + scrollX,
            transform: "translateY(-50%)",
            maxWidth: getMaxWidth(screenWidth - right + offsetLeft),
          };
        case "left":
          return {
            top: topForHorizontalPositions,
            right: screenWidth - scrollX - left,
            transform: "translateY(-50%)",
            maxWidth: getMaxWidth(left - offsetLeft),
          };
        case "topLeft":
          return { bottom: bottomForTopPositions, left: left + scrollX, maxWidth: getMaxWidth(width + screenWidth - right + offsetLeft) };
        case "topRight":
          return { bottom: bottomForTopPositions, right: screenWidth - scrollX - right, maxWidth: getMaxWidth(width + left - offsetLeft) };
        case "bottomLeft":
          return { top: topForBottomPositions, left: left + scrollX, maxWidth: getMaxWidth(width + screenWidth - right + offsetLeft) };
        case "bottomRight":
          return { top: topForBottomPositions, right: screenWidth - scrollX - right, maxWidth: getMaxWidth(width + left - offsetLeft) };
      }
    },
    [anchorRef],
  );

  const tryToKeepTooltipInTheScreen = useCallback(() => {
    if (!tooltipRef.current) return false;

    const { top, left, bottom, right } = tooltipRef.current.getBoundingClientRect();
    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;
    const offsetHorizontal = window.visualViewport?.offsetLeft ?? window.scrollX;
    const offsetVertical = window.visualViewport?.offsetTop ?? window.scrollY;

    const overflowLeft = left < offsetHorizontal;
    const overflowRight = right > screenWidth + offsetHorizontal;
    const overflowTop = top < offsetVertical;
    const overflowBottom = bottom > screenHeight + offsetVertical;

    const maybeOverflow = overflowTop || overflowRight || overflowBottom || overflowLeft;
    if (!maybeOverflow || (lastTriedPosition.current === position && tryCounter.current === positions.length)) {
      return true;
    }

    lastTriedPosition.current = positions[(positions.indexOf(lastTriedPosition.current) + 1) % positions.length];
    tryCounter.current++;
    setPositionStyle(getStyleOfPosition(lastTriedPosition.current));
    return false;
  }, [getStyleOfPosition, position, tooltipRef]);

  const setTooltipPosition = useCallback(() => {
    setPositionStyle(getStyleOfPosition(position));
  }, [getStyleOfPosition, position]);

  return { resetPosition, positionStyle, setTooltipPosition, tryToKeepTooltipInTheScreen, lastTriedPosition: lastTriedPosition.current };
};
