// CSS module mock: returns the class name for any key, like next/jest's default, but rejects keys with spaces.
// Real modules only hold single class names, so a combined key such as "countdown paused" must not turn into classes in tests.
module.exports = new Proxy(
  {},
  { get: (_, key) => (key === "__esModule" ? false : typeof key === "string" && !key.includes(" ") ? key : undefined) },
);
