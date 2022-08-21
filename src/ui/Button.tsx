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
    "border border-transparent text-white bg-zinc-500 hover:bg-zinc-400 focus:outline-none",
  outline:
    "text-neutral-700 bg-transparent border border-zinc-500 hover:border-zinc-400 focus:outline-none",
  danger:
    "text-neutral-700 bg-transparent hover:bg-red-100 hover:text-red-700 focus:outline-none",
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
      ),
      onClick: disabled
        ? (e: React.MouseEvent<HTMLElement, MouseEvent>) => e.preventDefault()
        : props.onClick,
    },
    <>
      {startIcon && !isLoading && startIcon}
      {props.children}
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
