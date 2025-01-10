import { IRecallByVin } from "../../../../types/types";
import React from "react";
import { useStyles } from "../styles";
import { HtmlTooltip } from "../../../../components/styled/HtmlTooltip";
import { ReactComponent as IIcon } from "../../../../assets/img/i_icon.svg";

type TIconProps = {
  item: IRecallByVin;
};

export const Icon: React.FC<TIconProps> = ({ item }) => {
  const { classes } = useStyles();
  return (
    <HtmlTooltip
      enterTouchDelay={0}
      placement="top"
      title={<div>{item.rolloverMessage}</div>}
    >
      <IIcon className={classes.iIcon} />
    </HtmlTooltip>
  );
};
