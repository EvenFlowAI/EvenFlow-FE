import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useStyles } from '../../../styles';

const RecallCredits = () => {
  const { credits } = useSelector((state: RootState) => state.dealerOperations);
  const { classes } = useStyles();

  return (
    <div style={{ marginBottom: '12px' }}>
      <span>
        Available Recall Credits{' '}
        <span className={classes.availableCreditCounter}>{credits?.availableCredits}</span>
      </span>
    </div>
  );
};

export default RecallCredits;
