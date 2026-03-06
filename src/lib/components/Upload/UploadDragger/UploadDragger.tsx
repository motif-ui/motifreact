"use client";
import { PropsWithRef } from "../../../types";
import { UploadProps } from "../types";
import FileList from "@/components/Upload/UploadFileList/FileList";
import { UploadProvider } from "@/components/Upload/UploadProvider";
import DragArea from "@/components/Upload/UploadDragger/components/DragArea";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import styles from "./UploadDragger.module.scss";

const UploadDragger = (props: PropsWithRef<UploadProps, HTMLDivElement>) => {
  const { ref, style, className } = props;
  const classes = sanitizeModuleRootClasses(styles, className);

  return (
    <UploadProvider props={props}>
      <div className={classes} style={style} ref={ref}>
        <DragArea />
        <FileList />
      </div>
    </UploadProvider>
  );
};

UploadDragger.displayName = "UploadDragger";
export default UploadDragger;
