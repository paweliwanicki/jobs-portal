import { ReactNode } from "react";
import classes from "./InfoBox.module.scss";

type InfoBoxVariant = "success" | "error" | "info";

type InfoBoxProps = {
  children: ReactNode;
  variant: InfoBoxVariant;
  classNames?: string;
};

const InfoBox = ({
  children,
  classNames = "",
  variant = "info",
}: InfoBoxProps) => {
  return (
    <div className={`${classes.infoBox} ${classes[variant]} ${classNames}`}>
      {children}
    </div>
  );
};

export default InfoBox;
