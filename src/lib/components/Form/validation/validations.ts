import {
  checkNoPropsEmpty,
  checkArrayItemsEmpty,
  checkAtLeastNTruthy,
  checkIBAN,
  checkMax,
  checkMaxLength,
  checkMin,
  checkMinLength,
  checkNullEmpty,
  checkRegex,
  checkTCKN,
  checkUploadedFilesEmpty,
  uploadSync,
} from "./validationFunctions";
import { InputValue } from "../../Form/types";
import { REGEX_EMAIL, REGEX_IP, REGEX_PHONE_1, REGEX_URL } from "@/components/Form/validation/regexes";
import { isNotAvailable } from "../../../../utils/utils";
import { LocaleKey } from "../../../../i18n/types";

export type InputValidation = {
  validate: (value?: InputValue) => boolean;
  errorMessage: LocaleKey;
  errorParams?: Record<string, unknown>;
  // This property identifies the validation whether the connected field(s) is required or not.
  requiredValidation?: boolean;
};

export class Validations {
  static Required: InputValidation = {
    errorMessage: "validation.required",
    validate: checkNullEmpty,
    requiredValidation: true,
  };

  static RequiredUploadedFile: InputValidation = {
    errorMessage: "validation.requiredUploadedFile",
    validate: checkUploadedFilesEmpty,
    requiredValidation: true,
  };

  static RequiredArrayItems: (indices: number[]) => InputValidation = indices => ({
    errorMessage: "validation.required",
    validate: value => checkArrayItemsEmpty(value, indices),
    requiredValidation: true,
  });

  static RequiredAllGroupItems: InputValidation = {
    errorMessage: "validation.requiredAllGroupItems",
    validate: checkNoPropsEmpty,
    requiredValidation: true,
  };

  static UploadItemSyncValidation: InputValidation = {
    errorMessage: "validation.uploadItemSync",
    validate: uploadSync,
  };

  static TCKN: InputValidation = {
    errorMessage: "validation.tckn",
    validate: value => !value || checkTCKN(value),
  };

  static IBAN: InputValidation = {
    errorMessage: "validation.iban",
    validate: value => !value || checkIBAN(value),
  };

  static EMAIL: InputValidation = {
    errorMessage: "validation.email",
    validate: value => !value || checkRegex(value, REGEX_EMAIL),
  };

  static URL: InputValidation = {
    errorMessage: "validation.url",
    validate: value => !value || checkRegex(value, REGEX_URL),
  };

  static IP_ADDRESS: InputValidation = {
    errorMessage: "validation.ipAddress",
    validate: value => !value || checkRegex(value, REGEX_IP),
  };

  static PHONE_1: InputValidation = {
    errorMessage: "validation.phone",
    validate: value => !value || checkRegex(value, REGEX_PHONE_1),
  };

  static MinLength: (min: number) => InputValidation = min => ({
    errorMessage: "validation.minLength",
    errorParams: { min },
    validate: value => isNotAvailable(value) || checkMinLength(value, min),
  });

  static MaxLength: (max: number) => InputValidation = max => ({
    errorMessage: "validation.maxLength",
    errorParams: { max },
    validate: value => isNotAvailable(value) || checkMaxLength(value, max),
  });

  static Min: (min: number) => InputValidation = min => ({
    errorMessage: "validation.min",
    errorParams: { min },
    validate: value => isNotAvailable(value) || checkMin(value, min),
  });

  static Max: (max: number) => InputValidation = max => ({
    errorMessage: "validation.max",
    errorParams: { max },
    validate: value => isNotAvailable(value) || checkMax(value, max),
  });

  static AtLeastN: (n: number) => InputValidation = n => ({
    errorMessage: "validation.atLeastN",
    errorParams: { n },
    validate: value => checkAtLeastNTruthy(value, n),
    requiredValidation: true,
  });
}
