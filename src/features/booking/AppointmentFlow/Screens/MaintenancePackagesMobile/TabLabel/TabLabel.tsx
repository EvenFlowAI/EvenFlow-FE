import React from 'react';
import { usePackageMobileStyles } from '../../../../../../hooks/styling/usePackageMobileStyles';

type TTabLabelProps = {
  text: string;
};

export const TabLabel: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TTabLabelProps>>
> = ({ text }) => {
  const { classes } = usePackageMobileStyles();
  return <div className={classes.iconWrapper}>{text}</div>;
};
