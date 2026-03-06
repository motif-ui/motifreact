import { InputValue } from "../types";
import { FileType } from "@/components/Upload/types";
import { STATUS } from "@/components/Upload/constants";

/**
 * Check Null and Empty
 *
 * @param value
 */
export const checkNullEmpty = (value: InputValue | null | undefined) => {
  return !(
    typeof value === "undefined" ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && !value.length) ||
    value === false ||
    (typeof value === "object" && !(value instanceof Date) && Object.values(value).every(el => !el))
  );
};

/**
 * Checks if any file is uploaded
 *
 * @param value
 */
export const checkUploadedFilesEmpty = (value: InputValue | null | undefined) =>
  !value ? false : (value as FileType[]).some(f => f.status === STATUS.SUCCESS);

/**
 * Checks values of given indices in the value array are not empty
 *
 * @param value
 * @param itemIndices
 */
export const checkArrayItemsEmpty = (value: InputValue | null | undefined, itemIndices: number[]) => {
  if (!checkNullEmpty(value)) {
    return false;
  }
  return itemIndices.every(i => checkNullEmpty((value as [])[i]));
};

/**
 * Check if all props of given object are not empty
 *
 * @param value
 */
export const checkNoPropsEmpty = (value: InputValue | null | undefined) => {
  if (!checkNullEmpty(value)) {
    return false;
  }
  return Object.values(value as object).every(el => !!el);
};

/**
 * Check Minimum Length of String
 *
 * @param value
 * @param min
 */
export const checkMinLength = (value: InputValue | undefined, min: number) => {
  return typeof value !== "undefined" && (value as string).length >= min;
};

/**
 * Check Maximum Length of String
 *
 * @param value
 * @param max
 */
export const checkMaxLength = (value: InputValue | undefined, max: number) => {
  return typeof value !== "undefined" && (value as string).length <= max;
};

/**
 * Check Minimum Value
 *
 * @param value
 * @param min
 */
export const checkMin = (value: InputValue | undefined, min: number) => {
  return typeof value !== "undefined" && parseInt(value as string) >= min;
};

/**
 * Check Maximum Value
 *
 * @param value
 * @param max
 */
export const checkMax = (value: InputValue | undefined, max: number) => {
  return typeof value !== "undefined" && parseInt(value as string) <= max;
};

/**
 * Checks at least n number items to be truthy
 *
 * @param value value to check
 * @param n minimum number of items to be truthy to pass the validation
 */
export const checkAtLeastNTruthy = (value: InputValue | undefined, n: number) => {
  return typeof value !== "undefined" && Object.values(value as object).filter(Boolean).length >= n;
};

/**
 * Checks given value with given regex pattern
 *
 * @param value value to check
 * @param pattern regex pattern to test
 */
export const checkRegex = (value: InputValue | undefined, pattern: string | RegExp) => {
  const regExp = new RegExp(pattern);
  return typeof value !== "undefined" && regExp.test((value as string).trim());
};

/**
 * Checks given Upload value contains a successful upload
 *
 * @param value value to check
 */
export const uploadSync = (value: InputValue | undefined) => {
  const inputVal = value as FileType[] | undefined;
  return !inputVal?.length || inputVal.some(f => f.status === STATUS.SUCCESS);
};

/**
 * Check Turkish Identity Number
 *
 * @param value
 */
export const checkTCKN = (value: InputValue | undefined) => {
  if (typeof value === "undefined") return false;

  const sanitizedValue = (value as string).replaceAll(" ", "");

  if (!/^[1-9]\d{10}$/.test(sanitizedValue)) return false;

  const digits = sanitizedValue.split("").map(Number);
  const [d10, d11] = digits.slice(-2);
  const sumOf10 = digits.slice(0, 10).reduce((acc, d) => acc + d, 0);

  const { evens, odds } = digits.slice(0, 9).reduce(
    ({ evens, odds }, d, index) => {
      return (index + 1) % 2 === 0 ? { evens: evens + d, odds } : { evens, odds: odds + d };
    },
    { evens: 0, odds: 0 },
  );

  return sumOf10 % 10 === d11 && (odds * 7 + evens * 9) % 10 === d10 && (odds * 8) % 10 === d11;
};

/**
 * IBAN Code Length Type
 */
type IBAN_CODE_LENGTH_TYPE = {
  [key: string]: number;
};

/**
 * Check IBAN
 *
 * @param value
 */
export const checkIBAN = (value: InputValue | undefined) => {
  if (typeof value === "undefined") return false;

  const CODE_LENGTHS = {
    AD: 24,
    AE: 23,
    AL: 28,
    AT: 20,
    AZ: 28,
    BA: 20,
    BE: 16,
    BG: 22,
    BH: 22,
    BI: 28,
    BR: 29,
    BY: 28,
    CH: 21,
    CR: 22,
    CY: 28,
    CZ: 24,
    DE: 22,
    DK: 18,
    DO: 28,
    EE: 20,
    EG: 29,
    ES: 24,
    LC: 32,
    FI: 18,
    FO: 18,
    FR: 27,
    GB: 22,
    GE: 22,
    GI: 23,
    GL: 18,
    GR: 27,
    GT: 28,
    HR: 21,
    HU: 28,
    IE: 22,
    IL: 23,
    IQ: 23,
    IS: 26,
    IT: 27,
    JO: 30,
    KW: 30,
    KZ: 20,
    LB: 28,
    LI: 21,
    LT: 20,
    LU: 20,
    LV: 21,
    LY: 25,
    MC: 27,
    MD: 24,
    ME: 22,
    MK: 19,
    MR: 27,
    MT: 31,
    MU: 30,
    NL: 18,
    NO: 15,
    PK: 24,
    PL: 28,
    PS: 29,
    PT: 25,
    QA: 29,
    RO: 24,
    RS: 22,
    SA: 24,
    SC: 31,
    SD: 18,
    SE: 24,
    SI: 19,
    SK: 24,
    SM: 27,
    ST: 25,
    SV: 28,
    TL: 23,
    TN: 24,
    TR: 26,
    UA: 29,
    VA: 22,
    VG: 24,
    XK: 20,
  };

  const iban = (value as string)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .trim();
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);

  if (!code?.[3] || !code[1] || iban.length !== (CODE_LENGTHS as IBAN_CODE_LENGTH_TYPE)[code[1]]) {
    return false;
  }

  const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter: string) => {
    return (letter.charCodeAt(0) - 55).toString();
  });
  return mod97(digits) === 1;
};

/**
 * IBAN Check Helper Method
 *
 * https://www.iban.com
 * https://www.tbb.org.tr/Content/Upload/Dokuman/705/IBAN_kontrol_basamaklari.doc&usg=AOvVaw2u5REn2NKfjyBH2cDvMv5d&opi=89978449
 *
 * @param digital
 */
const mod97 = (digital: string) => {
  let checksum = parseInt(digital.slice(0, 2));
  for (let offset = 2; offset < digital.length; offset += 7) {
    const fragment = checksum + digital.substring(offset, offset + 7);
    checksum = parseInt(fragment, 10) % 97;
  }
  return checksum;
};
