import type { DragEvent } from "react";
import { useCallback, useState } from "react";

type Props = {
  disabled?: boolean;
  onNewFilesAdded: (files: FileList | null) => void;
};

export const useUploadDragDrop = (props: Props) => {
  const { disabled, onNewFilesAdded } = props;
  const [hovered, setHovered] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setHovered(false);
      if (disabled) return;
      onNewFilesAdded(e.dataTransfer.files);
    },
    [disabled, onNewFilesAdded],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHovered(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHovered(false);
  }, []);

  return { hovered, handleDrop, handleDragOver, handleDragLeave };
};
