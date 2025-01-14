import React, { ReactElement } from 'react';
import { AdminHTMLTooltip } from '../../styled/HtmlTooltip';
import { useStyles } from '../styles';

type TProps<Data> = {
  icon: ReactElement;
  tooltipText?: string;
  value: Data[keyof Data] | undefined;
  index: string;
};

export function IconsBlock<U>({ icon, tooltipText, value, index }: TProps<U>) {
  const { classes } = useStyles();
  return tooltipText?.length ? (
    <AdminHTMLTooltip
      placement="top-end"
      title={
        <div dangerouslySetInnerHTML={{ __html: tooltipText }} onClick={e => e.stopPropagation()} />
      }
      enterTouchDelay={0}
      enterDelay={500}
      enterNextDelay={500}
      key={index}
    >
      <span className={classes.iconBlock}>
        <>
          {icon} - {value ?? 0}
        </>
      </span>
    </AdminHTMLTooltip>
  ) : (
    <span className={classes.iconBlock}>
      <>
        {icon} - {value ?? 0}
      </>
    </span>
  );
}
