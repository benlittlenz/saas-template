import cx from "classnames";
import React from "react";
import { useFormContext, UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";

interface InputProps
  extends Omit<JSX.IntrinsicElements["input"], "name">,
    FieldWrapperPassThroughProps {
  type?: "text" | "email" | "password";
  name: string;
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const {
      type = "text",
      name,
      label,
      className,
      registration,
      error,
      ...rest
    } = props;
    return (
      <FieldWrapper name={name} label={label} error={error}>
        <input
          {...props}
          ref={ref}
          className={cx(
            "block h-9 w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm hover:border-gray-400 focus:border-neutral-300 focus:outline-none sm:text-sm",
            props.className,
          )}
          {...registration}
          {...rest}
        />
      </FieldWrapper>
    );
  },
);
