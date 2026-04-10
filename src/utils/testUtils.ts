type JestToErrorArg = Parameters<jest.Matchers<unknown, () => unknown>["toThrow"]>[0];
/**
 *
 * @author https://github.com/Kashuab
 * @tutorial https://github.com/jestjs/jest/issues/5785#issuecomment-769475904
 *
 * Helps prevent error logs blowing up as a result of expecting an error to be thrown,
 * when using a library (such as enzyme)
 *
 * @param func Function that you would normally pass to `expect(func).toThrow()`
 * @param error The error to check whether it is thrown`
 */
export const expectToThrow = (func: () => unknown, error?: JestToErrorArg): void => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => {});

  expect(func).toThrow(error);

  spy.mockRestore();
};

/**
 * Mocks XMLHttpRequest for testing purposes. This function allows you to specify the status codes that the mocked
 * XHR will return. It simulates the behavior of XMLHttpRequest, including handling load and error events.
 *
 * @param statusCodes An array of status codes to return for each XMLHttpRequest. The first call will return the first
 *                    status code, the second call will return the second status code, and so on. If no status codes are provided,
 *                    the default status code is always 200.
 * @return A jest spy on the XMLHttpRequest constructor that returns a mocked XMLHttpRequest object.
 */
export const mockXHRs = (...statusCodes: number[]) => {
  const mockProgressEventLoad = new ProgressEvent("load", { loaded: 100 });
  const mockProgressEventError = new ProgressEvent("error");
  let requestCount = 0;

  const mockXHR: unknown = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    upload: {
      addEventListener: jest.fn(),
    },
    send: jest.fn(function (this: XMLHttpRequest) {
      const status = statusCodes.length ? statusCodes[requestCount++] : 200; // Default to 200 if no status codes are provided
      Object.defineProperty(this, "status", { value: status, writable: true });

      setTimeout(() => {
        // This timeout simulates the asynchronous nature of XMLHttpRequest
        status === 200 ? this.onload!(mockProgressEventLoad) : this.onerror!(mockProgressEventError);
      }, 0);
    }),
    addEventListener: jest.fn(function (this: XMLHttpRequest, event: string, callback: () => void) {
      if (event === "load") {
        this.onload = callback;
      } else if (event === "error") {
        this.onerror = callback;
      } else if (event === "abort") {
        this.onabort = callback;
      }
    }),
  };

  return jest.spyOn(window, "XMLHttpRequest").mockImplementation(() => mockXHR as XMLHttpRequest);
};
