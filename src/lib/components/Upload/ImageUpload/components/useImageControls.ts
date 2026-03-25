import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

const { ZOOM_STEP, MIN_SCALE, MAX_SCALE } = {
  ZOOM_STEP: 1.25,
  MAX_SCALE: 2,
  MIN_SCALE: 0.5,
};

export const useImageControls = (onClose: () => void) => {
  const browserSize = useMemo(() => ({ width: window.innerWidth, height: window.innerHeight }), []);
  const [{ width: naturalWidth, height: naturalHeight }, setNaturalSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

  const fitScale = naturalWidth > 0 ? Math.min(browserSize.width / naturalWidth, browserSize.height / naturalHeight) : 1;
  const initialScale = Math.min(fitScale, 1);

  const minScale = fitScale > MAX_SCALE ? 1 : MIN_SCALE * fitScale;
  const maxScale = fitScale < MIN_SCALE ? 1 : MAX_SCALE * fitScale;

  const handleImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = e.currentTarget;
      const fitScaleValue = Math.min(browserSize.width / naturalWidth, browserSize.height / naturalHeight);
      setNaturalSize({ width: naturalWidth, height: naturalHeight });
      setScale(Math.min(fitScaleValue, 1));
    },
    [browserSize],
  );

  const zoomIn = useCallback(() => setScale(prev => Math.min(prev * ZOOM_STEP, maxScale)), [maxScale]);
  const zoomOut = useCallback(() => setScale(prev => Math.max(prev / ZOOM_STEP, minScale)), [minScale]);
  const rotateLeft = useCallback(() => setRotation(prev => prev - 90), []);
  const rotateRight = useCallback(() => setRotation(prev => prev + 90), []);

  const isRotated = Math.abs(rotation % 180) === 90;
  const scaledW = (isRotated ? naturalHeight : naturalWidth) * scale;
  const scaledH = (isRotated ? naturalWidth : naturalHeight) * scale;
  const isDraggable = scaledW > browserSize.width || scaledH > browserSize.height;

  const clampPosition = useCallback(
    (pos: { x: number; y: number }) => {
      const maxX = Math.max(0, (scaledW - browserSize.width) / 2);
      const maxY = Math.max(0, (scaledH - browserSize.height) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, pos.x)),
        y: Math.max(-maxY, Math.min(maxY, pos.y)),
      };
    },
    [scaledW, scaledH, browserSize],
  );

  const clampRef = useRef<typeof clampPosition>(null!);
  clampRef.current = clampPosition;

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDraggable) return;
      dragRef.current = {
        isDragging: true,
        startX: clientX,
        startY: clientY,
        startPosX: positionRef.current.x,
        startPosY: positionRef.current.y,
      };
      setIsDragging(true);
    },
    [isDraggable],
  );

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLImageElement>) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    },
    [startDrag],
  );

  const handleTouchStart = useCallback(
    (e: ReactTouchEvent<HTMLImageElement>) => {
      if (e.touches.length !== 1) return;
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    },
    [startDrag],
  );

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!dragRef.current.isDragging) return;
      const { startX, startY, startPosX, startPosY } = dragRef.current;
      const raw = { x: startPosX + clientX - startX, y: startPosY + clientY - startY };
      const clamped = clampRef.current(raw);
      positionRef.current = clamped;
      setPosition(clamped);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleEnd = () => {
      dragRef.current.isDragging = false;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  useEffect(() => {
    setPosition(prev => {
      const clamped = isDraggable ? clampRef.current(prev) : { x: 0, y: 0 };
      if (prev.x === clamped.x && prev.y === clamped.y) return prev;
      positionRef.current = clamped;
      return clamped;
    });
  }, [isDraggable, scale, rotation]);

  const handleOutsideClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (!dragRef.current.isDragging) onClose();
    },
    [onClose],
  );

  const zoomOutDisabled = scale <= minScale;
  const zoomInDisabled = scale >= maxScale;
  const transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale / initialScale})`;
  const cursor = isDragging ? "grabbing" : isDraggable ? "grab" : "default";

  return {
    zoomOutDisabled,
    zoomInDisabled,
    transform,
    cursor,
    handleImageLoad,
    handleMouseDown,
    handleTouchStart,
    handleOutsideClick,
    zoomIn,
    zoomOut,
    rotateLeft,
    rotateRight,
  };
};
