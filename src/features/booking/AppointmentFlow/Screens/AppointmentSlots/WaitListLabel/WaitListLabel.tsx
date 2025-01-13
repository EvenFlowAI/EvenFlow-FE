import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import React from 'react';

export const WaitListLabel = () => {
  const { appointment, waitListSettings } = useSelector((state: RootState) => state.appointment);
  const { t } = useTranslation();
  return appointment?.isOverbookingApplied && waitListSettings?.isEnabled ? (
    <div
      style={{
        color: waitListSettings?.textHex ? `#${waitListSettings?.textHex}` : '#CE690B',
        fontWeight: 400,
        fontSize: 16,
      }}
    >
      {waitListSettings?.text ?? t('Waitlist Only')}
    </div>
  ) : null;
};
