import { FormProvider } from "./context/FormContext";
import { FormProps, FormRefType, NameInputValue } from "./types";
import FormComponent from "./components/FormComponent";
import FormField from "./FormFields/FormField";
import FormFieldGroup from "./FormFields/FormFieldGroup";
import { PropsWithRefAndChildren } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { useMotifContext } from "src/lib/motif/context/MotifProvider";

const FormTemp = <T extends NameInputValue>(props: PropsWithRefAndChildren<FormProps<T>, FormRefType>) => {
  const { t } = useMotifContext();
  const {
    children,
    onSubmit,
    size = "md",
    formOrientation = "vertical",
    labelOrientation = "vertical",
    submitButtonLabel = t("g.submit"),
    buttonPosition = "right",
    enableClearButton,
    clearButtonLabel = t("g.clear"),
    resetIfValidatedOnSubmit,
    title,
    validateOnChange,
    alternateButtons,
    preview,
    externalErrors,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Form", props);

  return (
    <FormProvider
      formOrientation={formOrientation}
      size={size}
      labelOrientation={labelOrientation}
      validateOnChange={validateOnChange}
      preview={preview}
      externalErrors={externalErrors}
    >
      <FormComponent
        ref={ref}
        onSubmit={onSubmit}
        submitButtonLabel={submitButtonLabel}
        buttonPosition={buttonPosition}
        clearButtonLabel={clearButtonLabel}
        enableClearButton={enableClearButton}
        resetIfValidatedOnSubmit={resetIfValidatedOnSubmit}
        title={title}
        alternateButtons={alternateButtons}
        style={style}
        className={className}
      >
        {children}
      </FormComponent>
    </FormProvider>
  );
};

const Form = Object.assign(FormTemp, {
  displayName: "Form",
  Field: FormField,
  FieldGroup: FormFieldGroup,
});
export default Form;
