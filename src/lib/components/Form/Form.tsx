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
    dontClearOnSubmit,
    title,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Form", props);

  return (
    <FormProvider formOrientation={formOrientation} size={size} labelOrientation={labelOrientation}>
      <FormComponent
        ref={ref}
        onSubmit={onSubmit}
        submitButtonLabel={submitButtonLabel}
        buttonPosition={buttonPosition}
        clearButtonLabel={clearButtonLabel}
        enableClearButton={enableClearButton}
        dontClearOnSubmit={dontClearOnSubmit}
        title={title}
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
