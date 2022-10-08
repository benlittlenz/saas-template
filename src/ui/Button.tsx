import Link, { LinkProps } from "next/link";
import React from "react";
import cx from "classnames";

const sizes = {
  base: "py-2 px-4 text-sm",
  medium: "py-2 px-6 text-md",
  large: "py-3 px-8 text-lg",
};

const variants = {
  primary:
    "border border-transparent text-white bg-neutral-700 hover:bg-neutral-600 focus:outline-none",
  outline:
    "text-neutral-700 bg-transparent border border-neutral-700 hover:border-neutral-600 focus:outline-none",
  danger:
    "text-red-600 bg-transparent border border-red-200 rounded-md hover:bg-red-600 hover:text-white focus:outline-none",
};

const disabledVariants = {
  primary: "border border-transparent bg-zinc-500 bg-opacity-50 text-white",
  outline:
    "border border-zinc-200 bg-transparent text-neutral-900 bg-white opacity-30",
  danger: "text-red-700 bg-transparent opacity-30",
};

export interface ButtonBaseProps {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  type?: "submit" | "button" | "reset";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  tooltipContent?: string;
}

export type ButtonProps = ButtonBaseProps &
  (
    | (Omit<JSX.IntrinsicElements["a"], "href" | "onClick"> & LinkProps)
    | (Omit<JSX.IntrinsicElements["button"], "onClick"> & { href?: never })
  );

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    size = "base",
    variant = "primary",
    type = "button",
    startIcon,
    endIcon,
    isLoading = false,
    tooltipContent,
    ...rest
  } = props;

  const disabled = props.disabled || isLoading;
  const isLink = props.href !== undefined;
  const elementType = isLink ? "a" : "button";
  const element = React.createElement(
    elementType,
    {
      ...rest,
      disabled,
      ref,
      className: cx(
        "flex items-center justify-center",
        sizes[size],
        disabled ? disabledVariants[variant] : variants[variant],
        isLoading
          ? "cursor-wait"
          : disabled
          ? "cursor-not-allowed"
          : "cursor-pointer",
        props.className,
      ),
      onClick: disabled
        ? (e: React.MouseEvent<HTMLElement, MouseEvent>) => e.preventDefault()
        : props.onClick,
    },
    <>
      {startIcon && !isLoading && startIcon}
      {props.children}
      {isLoading && (
        <div className="ml-4">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="sr-only">Loading</span>
        </div>
      )}
      {endIcon && !isLoading && endIcon}
    </>,
  );

  return props.href ? (
    <Link passHref href={props.href}>
      {element}
    </Link>
  ) : (
    <ButtonWrapper tooltipContent={tooltipContent}>{element}</ButtonWrapper>
  );
});

const ButtonWrapper = ({
  children,
  tooltipContent,
}: {
  tooltipContent?: string;
  children: React.ReactNode;
}) => {
  if (!tooltipContent) {
    return <>{children}</>;
  }

  //return <Tooltip content={tooltip}>{children}</Tooltip>;
  return <>{children}</>;
};
