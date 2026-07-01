import React from 'react';
import { ReactComponent as CheckIcon } from '../../../../../../assets/img/checkboxSmall.svg';
import { ReactComponent as RedCross } from '../../../../../../assets/img/redCross.svg';

const ConfirmationBadge = ({ isConfirmed }: { isConfirmed: boolean }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {isConfirmed ? (
        <>
          <CheckIcon />
          <span style={{ color: '#7898FF' }}>Yes</span>
        </>
      ) : (
        <>
          <RedCross />
          <span style={{ color: '#C71062' }}>No</span>
        </>
      )}
    </div>
  );
};

export default ConfirmationBadge;
