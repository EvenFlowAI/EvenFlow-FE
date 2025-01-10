import React from "react";
import { useStyles } from "./styles";

type TPriceItemProps = {
  value: number;
};

const PriceItem: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TPriceItemProps>>
> = ({ value }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={classes.price}>${Number(value).toFixed(2)}</div>
    </div>
  );
};

export default PriceItem;
