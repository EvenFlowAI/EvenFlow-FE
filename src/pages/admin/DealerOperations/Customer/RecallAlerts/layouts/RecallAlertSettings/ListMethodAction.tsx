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

const isUploadDisabled = (isEditTable: boolean, status?: RecallEventStatus): boolean =>
  !isEditTable ||
  status === RecallEventStatus.Running ||
  status === RecallEventStatus.CheckRequested ||
  status === RecallEventStatus.ResultsAvailable;

const shouldRenderVinCheckAction = (
  listType: RecallListType,
  updatedRecallAlert: IRecallAlert
): boolean =>
  listType === RecallListType.VIN_CHECK_API &&
  Boolean(updatedRecallAlert?.recallCampaignId) &&
  Boolean(updatedRecallAlert?.globalModelIds?.length);

const renderVinCheckAction = ({
  isEditTable,
  hasSelectedModels,
  hasAvailableCredits,
  campaignRecallGroupBatchId,
  updatedRecallAlert,
  classes,
  callRecallTrigger,
}: Pick<
  IListMethodActionProps,
  | 'isEditTable'
  | 'hasSelectedModels'
  | 'hasAvailableCredits'
  | 'campaignRecallGroupBatchId'
  | 'updatedRecallAlert'
  | 'classes'
  | 'callRecallTrigger'
>) => {
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
};

const renderCsvUploadAction = ({
  classes,
  file,
  updatedRecallAlert,
  inputRef,
  handleFileChange,
  isDisableUpload,
}: Pick<
  IListMethodActionProps,
  'classes' | 'file' | 'updatedRecallAlert' | 'inputRef' | 'handleFileChange'
> & {
  isDisableUpload: boolean;
}) => {
  const isReupload = Boolean(file || updatedRecallAlert?.vinsFileLink);
  const iconClassName = isDisableUpload ? classes.uploadIconDisabled : '';

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
        {isReupload ? (
          <div className={classes.uploadButtonContent}>
            <Reupload className={iconClassName} />
            <span>Reupload csv file</span>
          </div>
        ) : (
          <div className={classes.uploadButtonContent}>
            <Upload className={iconClassName} />
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
};

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
  const isDisableUpload = isUploadDisabled(isEditTable, updatedRecallAlert?.status);

  if (shouldRenderVinCheckAction(listType, updatedRecallAlert)) {
    return renderVinCheckAction({
      isEditTable,
      hasSelectedModels,
      hasAvailableCredits,
      campaignRecallGroupBatchId,
      updatedRecallAlert,
      classes,
      callRecallTrigger,
    });
  }

  if (listType === RecallListType.CSV_UPLOADED) {
    return renderCsvUploadAction({
      classes,
      file,
      updatedRecallAlert,
      inputRef,
      handleFileChange,
      isDisableUpload,
    });
  }

  return null;
};

export default ListMethodAction;
