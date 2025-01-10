import React, { ReactComponentElement } from "react";
import { useDetailsItemStyles } from "./styles";

export const DetailsItem: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<{
      title: string;
      text: string | string[];
      icon?: ReactComponentElement<any>;
    }>
  >
> = ({ title, text, icon }) => {
  const { classes } = useDetailsItemStyles();
  return text?.length ? (
    <div className={classes.wrapper}>
      {icon ? (
        <div className={classes.icon} key="icon">
          {icon}
        </div>
      ) : null}
      <div className={classes.details} key="details">
        <div className={classes.title} key="title">
          {title}
        </div>
        <div className={classes.text} key="text">
          {typeof text === "string"
            ? text
            : text.map((item) => <div key={item}>{item}</div>)}
        </div>
      </div>
    </div>
  ) : null;
};
