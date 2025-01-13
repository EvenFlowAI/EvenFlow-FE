import React from 'react';
import { useStyles } from './styles';

export const Label: React.FC<{ text: string }> = ({ text }) => {
  const { classes } = useStyles();
  return <div className={classes.text}>{text}</div>;
};
