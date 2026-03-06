import styles from "../ImageUpload.module.scss";
import { PropsWithRefAndChildren } from "../../../../types";
import { SyntheticEvent, useCallback, useMemo, useRef, useState } from "react";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { MotifIcon, MotifIconButton } from "@/components/Motif/Icon";

type PreviewProps = {
  image: string;
  onClose: () => void;
};

const { ZOOM_STEP, MIN_SCALE, MAX_SCALE } = {
  ZOOM_STEP: 1.25,
  MAX_SCALE: 2,
  MIN_SCALE: 0.5,
};

const Preview = (props: PropsWithRefAndChildren<PreviewProps, HTMLDivElement>) => {
  const { image, onClose } = props;
  const browserSize = useMemo(() => ({ width: window.innerWidth, height: window.innerHeight }), []);
  const [{ width: naturalWidth, height: naturalHeight }, setNaturalSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const innerRef = useOutsideClick<HTMLImageElement>(onClose, [toolbarRef]);

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

  return (
    <div className={styles.previewOverlay}>
      <div className={styles.previewContent} onClick={e => e.stopPropagation()}>
        <img
          ref={innerRef}
          className={styles.previewImage}
          src={image}
          alt="Image Preview"
          onLoad={handleImageLoad}
          style={{ scale: scale / initialScale, transform: `rotate(${rotation}deg)` }}
        />
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <MotifIcon name="close" />
        </button>
      </div>
      <div ref={toolbarRef} className={styles.toolbar}>
        <MotifIconButton variant="negative" name="undo" onClick={rotateLeft} />
        <MotifIconButton variant="negative" name="redo" onClick={rotateRight} />
        <MotifIconButton variant="negative" name="remove" disabled={scale <= minScale} onClick={zoomOut} />
        <MotifIconButton variant="negative" name="add" disabled={scale >= maxScale} onClick={zoomIn} />
      </div>
    </div>
  );
};

export default Preview;
