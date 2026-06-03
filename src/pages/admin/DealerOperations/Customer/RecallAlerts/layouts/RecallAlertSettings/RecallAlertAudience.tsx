import React from 'react';
import { VIN_CHECK_API } from '../../../../helper';
import { IRecallAlert, RecallListType } from '../../../../../../../store/reducers/recall/types';
import RecallForm from './RecallForm';
import { useStyles } from '../../../styles';

interface RecallAlertAudienceI {
  isEditTable: boolean;
  updatedRecallAlert: IRecallAlert | null;
  setUpdatedRecallAlert: React.Dispatch<React.SetStateAction<IRecallAlert | null>>;
  onFileChange: (file: File | null) => void;
  file: File | null;
}

const RecallAlertAudience = ({
  isEditTable,
  updatedRecallAlert,
  setUpdatedRecallAlert,
  onFileChange,
  file,
}: RecallAlertAudienceI) => {
  const { classes } = useStyles();

  const handleListMethodChange = (newValue: string) => {
    if (newValue === VIN_CHECK_API) {
      onFileChange(null);
    }
    setUpdatedRecallAlert(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        listType:
          newValue === VIN_CHECK_API ? RecallListType.VIN_CHECK_API : RecallListType.UPLOAD_CSV,
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
    <div style={{ marginRight: '25px' }}>
      <span className={classes.audienceTitle}>Audience</span>

      <RecallForm
        updatedRecallAlert={updatedRecallAlert}
        handleListMethodChange={handleListMethodChange}
        handleRecallCampaignChange={handleRecallCampaignChange}
        isEditTable={isEditTable}
        onFileChange={onFileChange}
        file={file}
      />
    </div>
  );
};

export default RecallAlertAudience;
