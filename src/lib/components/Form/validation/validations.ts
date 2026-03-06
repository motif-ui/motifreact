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

export type InputValidation = {
  validate: (value?: InputValue) => boolean;
  errorMessage: string;
  // This property identifies the validation whether the connected field(s) is required or not.
  requiredValidation?: boolean;
};

export class Validations {
  static Required: InputValidation = {
    errorMessage: "Lütfen bu alanı doldurunuz",
    validate: checkNullEmpty,
    requiredValidation: true,
  };

  static RequiredUploadedFile: InputValidation = {
    errorMessage: "Lütfen en az bir dosya yükleyiniz",
    validate: checkUploadedFilesEmpty,
    requiredValidation: true,
  };

  static RequiredArrayItems: (indices: number[]) => InputValidation = indices => ({
    errorMessage: "Lütfen bu alanı doldurunuz",
    validate: value => checkArrayItemsEmpty(value, indices),
    requiredValidation: true,
  });

  static RequiredAllGroupItems: InputValidation = {
    errorMessage: "Lütfen tüm alanları doldurunuz",
    validate: checkNoPropsEmpty,
    requiredValidation: true,
  };

  static UploadItemSyncValidation: InputValidation = {
    errorMessage: "Lütfen bu alandaki hatayı gideriniz",
    validate: uploadSync,
  };

  static TCKN: InputValidation = {
    errorMessage: "Lütfen geçerli bir T.C. kimlik numarası giriniz",
    validate: value => !value || checkTCKN(value),
  };

  static IBAN: InputValidation = {
    errorMessage: "Lütfen geçerli bir IBAN numarası giriniz",
    validate: value => !value || checkIBAN(value),
  };

  static EMAIL: InputValidation = {
    errorMessage: "Lütfen geçerli e-posta adresi giriniz",
    validate: value => !value || checkRegex(value, REGEX_EMAIL),
  };

  static URL: InputValidation = {
    errorMessage: "Lütfen geçerli bir URL giriniz",
    validate: value => !value || checkRegex(value, REGEX_URL),
  };

  static IP_ADDRESS: InputValidation = {
    errorMessage: "Lütfen geçerli bir IP adresi giriniz",
    validate: value => !value || checkRegex(value, REGEX_IP),
  };

  static PHONE_1: InputValidation = {
    errorMessage: "Lütfen geçerli bir telefon numarası giriniz",
    validate: value => !value || checkRegex(value, REGEX_PHONE_1),
  };

  static MinLength: (min: number) => InputValidation = min => ({
    errorMessage: `Bu alan en az ${min} karakter uzunluğunda olmalıdır`,
    validate: value => isNotAvailable(value) || checkMinLength(value, min),
  });

  static MaxLength: (max: number) => InputValidation = max => ({
    errorMessage: `Bu alan en fazla ${max} karakter uzunluğunda olmalıdır`,
    validate: value => isNotAvailable(value) || checkMaxLength(value, max),
  });

  static Min: (min: number) => InputValidation = min => ({
    errorMessage: `Bu alana en az ${min} değeri girmelisiniz`,
    validate: value => isNotAvailable(value) || checkMin(value, min),
  });

  static Max: (max: number) => InputValidation = max => ({
    errorMessage: `Bu alana en fazla ${max} değeri girmelisiniz`,
    validate: value => isNotAvailable(value) || checkMax(value, max),
  });

  static AtLeastN: (n: number) => InputValidation = n => ({
    errorMessage: `En az ${n} değer seçmelisiniz`,
    validate: value => checkAtLeastNTruthy(value, n),
    requiredValidation: true,
  });
}
