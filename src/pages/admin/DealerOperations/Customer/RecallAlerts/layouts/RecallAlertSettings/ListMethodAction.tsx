import React, { ChangeEventHandler } from 'react';
import { Button, Tooltip } from '@mui/material';
import { IRecallAlert, RecallListType } from '../../../../../../../store/reducers/recall/types';
import { ReactComponent as Upload } from '../../../../../../../assets/img/upload.svg';
import { ReactComponent as Reupload } from '../../../../../../../assets/img/Reupload.svg';
import { useStyles } from '../../../styles';
import { isRecallLocked } from './recallForm.utils';
import { RecallEventStatus } from '../../../types';

interface IListMethodActionProps {
  listType: RecallListType;
  isEditTable: boolean;
  hasSelectedModels: boolean;
  hasAvailableCredits: boolean;
  classes: ReturnType<typeof useStyles>['classes'];
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: ChangeEventHandler<HTMLInputElement>;
  callRecallTrigger: () => void;
  campaignRecallGroupBatchId?: number;
  updatedRecallAlert: IRecallAlert;
}

const ListMethodAction: React.FC<IListMethodActionProps> = ({
  listType,
  isEditTable,
  hasSelectedModels,
  hasAvailableCredits,
  classes,
  updatedRecallAlert,
  file,
  inputRef,
  handleFileChange,
  callRecallTrigger,
  campaignRecallGroupBatchId,
}) => {
  const isDisableUpload =
    !isEditTable ||
    updatedRecallAlert?.status === RecallEventStatus.Running ||
    updatedRecallAlert?.status === RecallEventStatus.CheckRequested ||
    updatedRecallAlert?.status === RecallEventStatus.ResultsAvailable;

  if (listType === RecallListType.VIN_CHECK_API) {
    const isCheckVinsDisabled =
      !isEditTable ||
      !hasSelectedModels ||
      !hasAvailableCredits ||
      !campaignRecallGroupBatchId ||
      isRecallLocked(updatedRecallAlert.status);

    const button = (
      <Button
        disabled={isCheckVinsDisabled}
        className={classes.checkVinsButton}
        variant="outlined"
        onClick={callRecallTrigger}
      >
        Check Vins
      </Button>
    );

    if (!hasAvailableCredits) {
      return (
        <Tooltip placement="top" title="No available recall credits">
          <span>{button}</span>
        </Tooltip>
      );
    }

    return button;
  }

  if (listType === RecallListType.UPLOAD_CSV) {
    return (
      <label htmlFor="uploadCSV" className={classes.uploadLabel}>
        <Button
          disabled={isDisableUpload}
          className={classes.uploadButton}
          variant="text"
          onClick={() => {
            if (isDisableUpload) {
              return;
            }
            inputRef.current?.click();
          }}
        >
          {file || updatedRecallAlert?.vinsFileLink ? (
            <div className={classes.uploadButtonContent}>
              <Reupload className={isDisableUpload ? classes.uploadIconDisabled : ''} />
              <span>Reupload csv file</span>
            </div>
          ) : (
            <div className={classes.uploadButtonContent}>
              <Upload className={isDisableUpload ? classes.uploadIconDisabled : ''} />
              <span>Upload csv file</span>
            </div>
          )}
        </Button>
        <input
          disabled={isDisableUpload}
          onChange={handleFileChange}
          className={classes.hiddenInput}
          type="file"
          id="uploadCSV"
          ref={inputRef}
        />
      </label>
    );
  }

  return null;
};

export default ListMethodAction;
