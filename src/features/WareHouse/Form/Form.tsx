import FormFieldContent from "./FormField";
import React, { createContext, useContext } from "react";
import {
  useForm,
  type DeepKeys,
  type ReactFormApi,
  type FormApi,
} from "@tanstack/react-form";
import clsx from "clsx";

// Create a form context to provide the form instance to child components
type FormContextType<T extends Record<string, unknown>> = FormApi<
  T,
  undefined
> &
  ReactFormApi<T, undefined>;

export const FormContext = createContext<FormContextType<any> | null>(null);

type FormProps<T extends Record<string, unknown>> = {
  defaultData: T;
  minWidth?: string;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
};

export default function Form<T extends Record<string, unknown>>({
  defaultData,
  minWidth = "600px",
  onSubmit,
  children,
}: FormProps<T>) {
  const form = useForm<T>({
    defaultValues: defaultData,
    onSubmit: (values) => {
      onSubmit(values.value);
    },
  });

  return (
    <FormContext.Provider value={form}>
      <form
        onSubmit={form.handleSubmit}
        className={clsx(
          "flex h-fit flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]",
          minWidth ? `min-w-[${minWidth}]` : "min-w-[600px]",
        )}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

type FieldProps<T> = {
  name: DeepKeys<T>;
  children?: React.ReactNode;
};

export function FormField<T>({ name, children }: FieldProps<T>) {
  const form = useContext(FormContext);

  if (!form) {
    throw new Error("FormField must be used within a Form component");
  }

  return (
    <form.Field
      name={name.toString()}
      children={(field) => (
        <FormFieldContent field={field}>{children}</FormFieldContent>
      )}
    />
  );
}

export function FormInputField<T>({ name, children }: FieldProps<T>) {
  const form = useContext(FormContext);

  if (!form) {
    throw new Error("FormField must be used within a Form component");
  }

  return (
    <form.Field
      name={name.toString()}
      children={(field) => (
        <FormFieldContent field={field}>
          <input type="text" title={name.toString()} id={name.toString()} />
        </FormFieldContent>
      )}
    />
  );
}

// Custom title component
type FormTitleProps = {
  title: string;
};

export function FormTitle({ title }: FormTitleProps) {
  return (
    <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
      {title}
    </h1>
  );
}

// Custom submit button component
export function FormSubmitButton({ children }: { children: React.ReactNode }) {
  const form = useContext(FormContext);

  if (!form) {
    throw new Error("FormSubmitButton must be used within a Form component");
  }

  return (
    <button type="submit" disabled={form.state.isSubmitting}>
      {children}
    </button>
  );
}

Form.FormField = FormField;
Form.FormTitle = FormTitle;
Form.FormSubmitButton = FormSubmitButton;
Form.FormInputField = FormInputField;
