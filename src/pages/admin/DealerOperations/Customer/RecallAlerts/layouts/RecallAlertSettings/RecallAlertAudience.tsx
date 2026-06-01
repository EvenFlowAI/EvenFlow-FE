import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { VIN_CHECK_API } from '../../../../helper';
import { IRecallAlert } from '../../../../../../../store/reducers/recall/types';
import RecallForm from './RecallForm';

interface RecallAlertAudienceI {
  isEditTable: boolean;
  updatedRecallAlert: IRecallAlert | null;
  setUpdatedRecallAlert: React.Dispatch<React.SetStateAction<IRecallAlert | null>>;
}

const RecallAlertAudience = ({
  isEditTable,
  updatedRecallAlert,
  setUpdatedRecallAlert,
}: RecallAlertAudienceI) => {
  const { selectedRecallAlert } = useSelector((state: RootState) => state.recalls);

  useEffect(() => {
    setUpdatedRecallAlert(selectedRecallAlert);
  }, [selectedRecallAlert]);

  const handleListMethodChange = (newValue: string) => {
    setUpdatedRecallAlert(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        listType: newValue === VIN_CHECK_API ? 0 : 1,
      };
    });
  };

  const handleRecallCampaignChange = (newValue: number) => {
    setUpdatedRecallAlert(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        recallCampaignId: newValue,
      };
    });
  };

  if (!updatedRecallAlert) return <></>;
  return (
    <div>
      <span
        style={{
          display: 'block',
          textTransform: 'uppercase',
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '24px',
        }}
      >
        Audience
      </span>

      <RecallForm
        updatedRecallAlert={updatedRecallAlert}
        handleListMethodChange={handleListMethodChange}
        handleRecallCampaignChange={handleRecallCampaignChange}
        isEditTable={isEditTable}
      />
    </div>
  );
};

export default RecallAlertAudience;
