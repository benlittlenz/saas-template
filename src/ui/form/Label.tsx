import cx from "classnames";

export const Label = (props: JSX.IntrinsicElements["label"]) => {
  return (
    <label
      {...props}
      className={cx("block text-sm font-medium text-gray-700", props.className)}
    >
      {props.children}
    </label>
  );
};
