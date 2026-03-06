import "@testing-library/jest-dom";
import {
  checkArrayItemsEmpty,
  checkIBAN,
  checkMax,
  checkMaxLength,
  checkMin,
  checkMinLength,
  checkNoPropsEmpty,
  checkNullEmpty,
  checkRegex,
  checkTCKN,
} from "./validationFunctions";
import {
  DATE_PATTERN_DD_MM_YYYY,
  DATE_PATTERN_DD_MM_YYYY_HH_MM,
  DATE_PATTERN_DD_MM_YYYY_HH_MM_SS,
  REGEX_EMAIL,
  REGEX_IP,
  REGEX_PHONE_1,
  REGEX_URL,
} from "@/components/Form/validation/regexes";

describe("Validations", () => {
  it("should be validated with empty/null validation", () => {
    expect(checkNullEmpty("Text")).toBe(true);
    expect(checkNullEmpty("")).toBe(false);
    expect(checkNullEmpty(undefined)).toBe(false);
    expect(checkNullEmpty(null)).toBe(false);
  });

  it("should be validated with empty/null items validation in an object value", () => {
    expect(checkNoPropsEmpty({ item1: "item 1", item2: "item 2", item3: "item 3" })).toBe(true);
    expect(checkNoPropsEmpty({ item1: "item 1", item2: "item 2", item3: "" })).toBe(false);
    expect(checkNoPropsEmpty({ item1: "", item2: "item 2", item3: "" })).toBe(false);
    expect(checkNoPropsEmpty({ item1: "", item2: "", item3: "" })).toBe(false);
    expect(checkNoPropsEmpty({})).toBe(false);
  });

  it("should be validated with empty/null items validation in an array value", () => {
    expect(checkArrayItemsEmpty(["item 1", "item 2", "item 3"], [0, 1, 2])).toBe(true);
    expect(checkArrayItemsEmpty([1, 2, 3], [0, 1, 2])).toBe(true);
    expect(checkArrayItemsEmpty(undefined, [0, 1, 2])).toBe(false);
    expect(checkArrayItemsEmpty([], [0, 1, 2])).toBe(false);
    expect(checkArrayItemsEmpty(["", "", ""], [0, 1, 2])).toBe(false);
    expect(checkArrayItemsEmpty(["item 1", "item 2", ""], [0, 1, 2])).toBe(false);
    expect(checkArrayItemsEmpty(["", "item 2", ""], [1])).toBe(true);
    expect(checkArrayItemsEmpty(["Item 1", "item 2", "Item 3"], [1])).toBe(true);
    expect(checkArrayItemsEmpty(["Item 1", "", "Item 3"], [1])).toBe(false);
  });

  it("should be validated with only TCKN validation", () => {
    expect(checkTCKN("35661734612")).toBe(true);
    expect(checkTCKN("356617346")).toBe(false);
    expect(checkTCKN("11111111111")).toBe(false);
  });

  it("should be validated with only IBAN validation", () => {
    expect(checkIBAN("TR690006223136424982828952")).toBe(true);
    expect(checkIBAN("TR690006223136424982828")).toBe(false);
  });

  it("should be validated with only e-mail validation", () => {
    const checkEmail = (value: string) => checkRegex(value, REGEX_EMAIL);
    expect(checkEmail("test@test.com")).toBe(true);
    expect(checkEmail("test.test@test.com")).toBe(true);
    expect(checkEmail("test.123@test.com")).toBe(true);
    expect(checkEmail("test_123@test.com")).toBe(true);
    expect(checkEmail("test")).toBe(false);
    expect(checkEmail("test@test")).toBe(false);
    expect(checkEmail("test:@test")).toBe(false);
    expect(checkEmail("test;@test")).toBe(false);
    expect(checkEmail("test.@test.com")).toBe(false);
    expect(checkEmail("test*@test.com")).toBe(false);
    expect(checkEmail("test^123@test.com")).toBe(false);
    expect(checkEmail("test,123@test.com")).toBe(false);
    expect(checkEmail("test/123@test.com")).toBe(false);
    expect(checkEmail("test\\123@test.com")).toBe(false);
    expect(checkEmail("test&123@test.com")).toBe(false);
    expect(checkEmail("test+123@test.com")).toBe(false);
    expect(checkEmail("test%123@test.com")).toBe(false);
  });

  it("should be validated with only url validation", () => {
    const checkURL = (value: string) => checkRegex(value, REGEX_URL);
    expect(checkURL("https://motif-ui.com")).toBe(true);
    expect(checkURL("motif-ui.com")).toBe(true);
    expect(checkURL("motif")).toBe(false);
  });

  it("should be validated with only min length value validation", () => {
    expect(checkMinLength("Happy", 5)).toBe(true);
    expect(checkMinLength("Happy", 6)).toBe(false);
  });

  it("should be validated with only max length value validation", () => {
    expect(checkMaxLength("Happy", 5)).toBe(true);
    expect(checkMaxLength("Happy", 4)).toBe(false);
  });

  it("should be validated with only min value validation", () => {
    expect(checkMin("5", 5)).toBe(true);
    expect(checkMin("6", 7)).toBe(false);
    expect(checkMin("Name", 4)).toBe(false);
  });

  it("should be validated with only max value validation", () => {
    expect(checkMax("5", 5)).toBe(true);
    expect(checkMax("6", 4)).toBe(false);
    expect(checkMax("Name", 4)).toBe(false);
  });

  it("should be validated with only ip address validation", () => {
    const checkIP = (value: string) => checkRegex(value, REGEX_IP);
    expect(checkIP("127.0.0.1")).toBe(true);
    expect(checkIP("127.0.0")).toBe(false);
    expect(checkIP("127")).toBe(false);
  });

  it("should be validated with only phone number validation", () => {
    const checkPhoneNumber = (value: string) => checkRegex(value, REGEX_PHONE_1);

    expect(checkPhoneNumber("+90 555 444 33 22")).toBe(true);
    expect(checkPhoneNumber("+90 555 444 33 22 11")).toBe(false);
    expect(checkPhoneNumber("+90 555 444 33")).toBe(true);
  });

  it("should be validated with only date(DD/MM/YYYY) validation", () => {
    const checkDate = (value: string) => checkRegex(value, DATE_PATTERN_DD_MM_YYYY);
    expect(checkDate("08/01/2024")).toBe(true);
    expect(checkDate("08/01/2024 15:03")).toBe(false);
    expect(checkDate("08/01/24")).toBe(false);
  });

  it("should be validated with only date(DD/MM/YYYY HH:MM) validation", () => {
    const checkDate = (value: string) => checkRegex(value, DATE_PATTERN_DD_MM_YYYY_HH_MM);
    expect(checkDate("08/01/2024 15:03")).toBe(true);
    expect(checkDate("08/01/2024")).toBe(false);
    expect(checkDate("08/01/24 15:03")).toBe(false);
  });

  it("should be validated with only date(DD/MM/YYYY HH:MM:SS) validation", () => {
    const checkDate = (value: string) => checkRegex(value, DATE_PATTERN_DD_MM_YYYY_HH_MM_SS);
    expect(checkDate("08/01/2024 15:03:03")).toBe(true);
    expect(checkDate("08/01/2024 15:03")).toBe(false);
    expect(checkDate("08/01/2024")).toBe(false);
    expect(checkDate("08/01/24 15:03")).toBe(false);
  });
});
