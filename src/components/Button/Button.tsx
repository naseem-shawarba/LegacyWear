import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "default" | "primary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = ({
  variant = "default",
  className,
  ...props
}: ButtonProps) => {
  const classNames = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return <button {...props} className={classNames} />;
};
