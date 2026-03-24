import styles from "../ImageUpload.module.scss";
import { PropsWithRefAndChildren } from "../../../../types";
import { useRef } from "react";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { MotifIcon, MotifIconButton } from "@/components/Motif/Icon";
import { useImageControls } from "./useImageControls";

type PreviewProps = {
  image: string;
  onClose: () => void;
};

const Preview = (props: PropsWithRefAndChildren<PreviewProps, HTMLDivElement>) => {
  const { image, onClose } = props;
  const {
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
  } = useImageControls(onClose);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const innerRef = useOutsideClick<HTMLImageElement>(handleOutsideClick, [toolbarRef]);

  return (
    <div className={styles.previewOverlay}>
      <div className={styles.previewContent} onClick={e => e.stopPropagation()}>
        <img
          ref={innerRef}
          className={styles.previewImage}
          src={image}
          alt="Image Preview"
          onLoad={handleImageLoad}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          draggable={false}
          style={{ transform, cursor }}
        />
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <MotifIcon name="close" />
        </button>
      </div>
      <div ref={toolbarRef} className={styles.toolbar}>
        <MotifIconButton variant="negative" name="undo" onClick={rotateLeft} />
        <MotifIconButton variant="negative" name="redo" onClick={rotateRight} />
        <MotifIconButton variant="negative" name="remove" disabled={zoomOutDisabled} onClick={zoomOut} />
        <MotifIconButton variant="negative" name="add" disabled={zoomInDisabled} onClick={zoomIn} />
      </div>
    </div>
  );
};

export default Preview;
