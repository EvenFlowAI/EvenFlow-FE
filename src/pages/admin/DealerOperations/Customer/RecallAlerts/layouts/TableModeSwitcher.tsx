import React from 'react';
import { ReactComponent as Workflow } from '../../../../../../assets/img/workflow.svg';
import { ReactComponent as WorkflowBlue } from '../../../../../../assets/img/workflow-blue.svg';
import { ReactComponent as Stats } from '../../../../../../assets/img/stats.svg';
import { ReactComponent as StatsWhite } from '../../../../../../assets/img/stats-white.svg';
import { useStyles } from '../../../styles';
import clsx from 'clsx';

interface TableModeSwitcherProps {
  setTableMode: (tableMode: 'workflow' | 'stats') => void;
  tableMode: 'workflow' | 'stats';
}

const TableModeSwitcher = ({ setTableMode, tableMode }: TableModeSwitcherProps) => {
  const { classes } = useStyles();

  const handleSetTableMode = (tableMode: 'workflow' | 'stats') => {
    setTableMode(tableMode);
  };

  return (
    <div className={classes.tableSwitcher}>
      <button
        type="button"
        aria-pressed={tableMode === 'workflow'}
        className={clsx(
          classes.tableMode,
          tableMode === 'workflow' ? classes.active : classes.inactive,
          classes.leftRounded
        )}
        onClick={() => handleSetTableMode('workflow')}
      >
        {tableMode === 'workflow' ? <Workflow /> : <WorkflowBlue />} <span>Workflow</span>
      </button>

      <button
        type="button"
        aria-pressed={tableMode === 'stats'}
        className={clsx(
          classes.tableMode,
          tableMode === 'stats' ? classes.active : classes.inactive,
          classes.rightRounded
        )}
        onClick={() => handleSetTableMode('stats')}
      >
        {tableMode === 'stats' ? <StatsWhite /> : <Stats />} <span>Stats</span>
      </button>
    </div>
  );
};

export default TableModeSwitcher;
