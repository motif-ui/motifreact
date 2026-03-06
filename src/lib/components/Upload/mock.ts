import { RequestSettings } from "@/components/Upload/types";

const filePng2mb = new File(["testpng"], "test.png", { type: "image/png" });
const fileJpeg1kb = new File(["testjpeg"], "test.jpeg", { type: "image/jpeg" });
const filePdf1kb = new File(["testpdf"], "test.pdf", { type: "application/pdf" });
const fileTxt1kb = new File(["testtxt"], "test.txt", { type: "text/plain" });
const fileGif1mb = new File(["testgif"], "test.gif", { type: "image/gif" });
Object.defineProperty(filePng2mb, "size", { value: 2000000 });
Object.defineProperty(fileJpeg1kb, "size", { value: 1000 });
Object.defineProperty(filePdf1kb, "size", { value: 1000 });
Object.defineProperty(fileTxt1kb, "size", { value: 1000 });
Object.defineProperty(fileGif1mb, "size", { value: 1000000 });

export class MOCK {
  static url = "https://httpbin.org/post";
  static uploadRequest: RequestSettings = { url: MOCK.url, method: "POST", headers: [{ key: "mtf", value: "ui" }] };
  static deleteRequest: RequestSettings = { url: MOCK.url, method: "POST", headers: [{ key: "mtf", value: "ui" }] };
  static filePng2mb = filePng2mb;
  static fileJpeg1kb = fileJpeg1kb;
  static filePdf1kb = filePdf1kb;
  static fileTxt1kb = fileTxt1kb;
  static fileGif1mb = fileGif1mb;
}
