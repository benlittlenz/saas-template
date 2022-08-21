import cx from "classnames";
import React, { useId } from "react";
import { FieldError, useFormContext } from "react-hook-form";

type FieldWrapperProps = {
  label?: string;
  name: string;
  className?: string;
  children: React.ReactElement;
  error?: FieldError | undefined;
  description?: string;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  "className" | "children"
>;

export const FieldWrapper = (props: FieldWrapperProps) => {
  const id = useId();
  const { name, label, className, error, children } = props;

  return (
    <div>
      <label
        htmlFor={id}
        {...props}
        className={cx("block text-sm font-medium text-gray-700", className)}
      >
        {label}
        <div className="mt-1">{React.cloneElement(children, { id })}</div>
      </label>
      <FieldErrors fieldName={name} />
    </div>
  );
};

const FieldErrors = ({ fieldName }: { fieldName: string }) => {
  const methods = useFormContext() as ReturnType<typeof useFormContext> | null;

  /* If there's no methods it means we're using these components outside a React Hook Form context */
  if (!methods) return null;

  const { formState } = methods;

  const fieldErrors = formState.errors[fieldName];

  if (fieldErrors && !fieldErrors.message) {
    return (
      <div className="text-gray mt-2 flex items-center text-sm text-gray-700">
        <ul className="ml-2">
          {Object.keys(fieldErrors).map((key: string) => {
            return (
              <li key={key} className="text-blue-700">
                {`${fieldName}_hint_${key}`}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  if (fieldErrors?.message) {
    return (
      <div role="alert" className="text-sm font-semibold text-red-500">
        <>{fieldErrors.message}</>
      </div>
    );
  }
  return null;
};
