import { useEffect } from "react";
import type { Decorator } from "@storybook/nextjs";
import { http, HttpResponse } from "msw";
import { RequestSettings } from "@/components/Upload/types.ts";

const SERVER_VALIDATION_URL = "/mock/uploadServerFail";
export const serverValidationRequest: RequestSettings = { url: SERVER_VALIDATION_URL, method: "POST" };

export const serverValidationMswParameters = {
  msw: {
    handlers: [
      http.post(SERVER_VALIDATION_URL, async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return HttpResponse.json({ status: "fail", message: "Uploaded file is rejected by the server." }, { status: 500 });
      }),
    ],
  },
  docs: {
    source: {
      transform: (code: string) => `
/* Server response structure
   
   http.post("${SERVER_VALIDATION_URL}", async () => HttpResponse.json({ 
       status: "fail", 
       message: "Uploaded file is rejected by the server." 
     }, { 
       status: 500 
     }
   )); 
*/

${code}`,
    },
  },
};

const FAKE_PROGRESS_STEPS = [30, 80, 100];
type XHRWithFakeProgressUrl = XMLHttpRequest & { _fakeProgressUrl?: string };

/**
 * MSW intercepts the request via a Service Worker, and browsers don't emit real `xhr.upload` progress events for
 * Service-Worker-intercepted requests, so the progress bar would stay at 0%. This patches XHR just for stories using
 * it to simulate progress for a realistic-looking demo.
 */
export const WithFakeUploadProgress: Decorator = Story => {
  useEffect(() => {
    const originalOpen = Reflect.get(XMLHttpRequest.prototype, "open");
    const originalSend = Reflect.get(XMLHttpRequest.prototype, "send");

    XMLHttpRequest.prototype.open = new Proxy(originalOpen, {
      apply: (target, thisArg: XHRWithFakeProgressUrl, args: Parameters<typeof XMLHttpRequest.prototype.open>) => {
        thisArg._fakeProgressUrl = args[1].toString();
        return Reflect.apply(target, thisArg, args);
      },
    });

    XMLHttpRequest.prototype.send = new Proxy(originalSend, {
      apply: (target, thisArg: XHRWithFakeProgressUrl, args: Parameters<typeof XMLHttpRequest.prototype.send>) => {
        if (thisArg._fakeProgressUrl === SERVER_VALIDATION_URL) {
          FAKE_PROGRESS_STEPS.forEach((loaded, index) =>
            setTimeout(
              () => thisArg.upload.dispatchEvent(new ProgressEvent("progress", { lengthComputable: true, loaded, total: 100 })),
              (index + 1) * 400,
            ),
          );
        }
        return Reflect.apply(target, thisArg, args);
      },
    });

    return () => {
      XMLHttpRequest.prototype.open = originalOpen;
      XMLHttpRequest.prototype.send = originalSend;
    };
  }, []);

  return <Story />;
};
