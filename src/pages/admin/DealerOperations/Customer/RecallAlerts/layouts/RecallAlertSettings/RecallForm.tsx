import React, { ChangeEventHandler, useCallback } from 'react';
import { Autocomplete, Button, Tooltip } from '@mui/material';
import { CSV_UPLOADED, VIN_CHECK_API } from '../../../../helper';
import { autocompleteRender } from '../../../../../../../utils/autocompleteRenders';
import { IRecallAlert, RecallListType } from '../../../../../../../store/reducers/recall/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { TextField } from '../../../../../../../components/formControls/TextFieldStyled/TextField';
import { ReactComponent as Upload } from '../../../../../../../assets/img/upload.svg';
import { ReactComponent as Reupload } from '../../../../../../../assets/img/Reupload.svg';
import { useException } from '../../../../../../../hooks/useException/useException';
import { useStyles } from '../../../styles';
import { checkVins, getRecallEvents } from '../../../../../../../store/reducers/recall/actions';
import { useSCs } from '../../../../../../../hooks/useSCs/useSCs';
import { RecallEventStatus } from '../../../types';

interface RecallFormI {
  isEditTable: boolean;
  updatedRecallAlert: IRecallAlert;
  handleListMethodChange: (newValue: string) => void;
  handleRecallCampaignChange: (newValue: number | null) => void;
  onFileChange: (file: File | null) => void;
  file: File | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const allowedFileTypes = ['text/csv'];

const formatFileSize = (bytes: number): string => {
  const fmt = (n: number) => (n % 1 === 0 ? n.toFixed(0) : n.toFixed(1));
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1000 * 1000) return `${fmt(bytes / 1000)} KB`;
  if (bytes < 1000 * 1000 * 1000) return `${fmt(bytes / (1000 * 1000))} MB`;
  return `${fmt(bytes / (1000 * 1000 * 1000))} GB`;
};

const getListMethodValue = (listType: RecallListType): string => {
  if (listType === RecallListType.VIN_CHECK_API) {
    return VIN_CHECK_API;
  }

  if (listType === RecallListType.UPLOAD_CSV) {
    return CSV_UPLOADED;
  }

  return '';
};

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
  if (listType === RecallListType.VIN_CHECK_API) {
    const isCheckVinsDisabled =
      !isEditTable ||
      !hasSelectedModels ||
      !hasAvailableCredits ||
      !campaignRecallGroupBatchId ||
      updatedRecallAlert.status === RecallEventStatus.Running ||
      updatedRecallAlert.status === RecallEventStatus.CheckRequested;

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
          disabled={!isEditTable}
          className={classes.uploadButton}
          variant="text"
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <div className={classes.uploadButtonContent}>
              <Reupload className={!isEditTable ? classes.uploadIconDisabled : ''} />
              <span>Reupload csv file</span>
            </div>
          ) : (
            <div className={classes.uploadButtonContent}>
              <Upload className={!isEditTable ? classes.uploadIconDisabled : ''} />
              <span>Upload csv file</span>
            </div>
          )}
        </Button>
        <input
          disabled={!isEditTable}
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

const RecallForm = ({
  isEditTable,
  updatedRecallAlert,
  handleListMethodChange,
  handleRecallCampaignChange,
  onFileChange,
  file,
  setIsLoading,
}: RecallFormI) => {
  const { classes } = useStyles();
  const { credits } = useSelector((state: RootState) => state.dealerOperations);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { allGlobalRecalls } = useSelector((state: RootState) => state.recallDatabase);
  const showError = useException();
  const ref = React.useRef<HTMLInputElement>(null);
  const hasSelectedModels = (updatedRecallAlert.globalModelIds?.length ?? 0) > 0;
  const hasAvailableCredits = (credits?.availableCredits ?? 0) > 0;

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      if (event.target.files) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          if (!allowedFileTypes.includes(file.type)) {
            return showError('Please upload only CSV file');
          }
          if (e.target?.result) {
            onFileChange(file);
          }
        };
        if (ref.current) {
          ref.current.value = '';
        }
      }
    },
    [ref]
  );

  const callRecallTrigger = () => {
    if (!selectedSC) return;
    setIsLoading(true);
    dispatch(
      checkVins(
        updatedRecallAlert?.campaignRecallGroupBatchId,
        () => {
          dispatch(
            getRecallEvents(
              selectedSC?.id,
              'workflow',
              () => {},
              () => {
                setIsLoading(false);
              }
            )
          );
        },
        (e: string) => {
          showError(e);
          setIsLoading(false);
        }
      )
    );
  };

  return (
    <div>
      <div className={classes.recallFormSection}>
        <div style={{ marginBottom: file ? '4px' : '16px' }} className={classes.recallFormRow}>
          <Autocomplete
            disabled={
              !isEditTable ||
              updatedRecallAlert.status === RecallEventStatus.Running ||
              updatedRecallAlert.status === RecallEventStatus.CheckRequested
            }
            className={classes.recallFormField}
            value={getListMethodValue(updatedRecallAlert.listType)}
            disableClearable
            options={[VIN_CHECK_API, CSV_UPLOADED]}
            isOptionEqualToValue={(o, v) => String(o) === String(v)}
            getOptionLabel={o => o}
            onChange={(e, v) => handleListMethodChange(v)}
            renderInput={autocompleteRender({
              isCustomFontSize: true,
              label: 'Generate List Method',
              placeholder: 'Select method',
            })}
          />
          <ListMethodAction
            listType={updatedRecallAlert.listType}
            updatedRecallAlert={updatedRecallAlert}
            isEditTable={isEditTable}
            hasSelectedModels={hasSelectedModels}
            hasAvailableCredits={hasAvailableCredits}
            classes={classes}
            file={file}
            inputRef={ref}
            handleFileChange={handleFileChange}
            callRecallTrigger={callRecallTrigger}
            campaignRecallGroupBatchId={updatedRecallAlert?.campaignRecallGroupBatchId}
          />
        </div>
        {updatedRecallAlert.listType === RecallListType.UPLOAD_CSV && file ? (
          <span>
            {file.name} ({formatFileSize(file.size)})
          </span>
        ) : null}
      </div>
      <div className={classes.recallFormRow}>
        <Autocomplete
          disabled={
            !isEditTable ||
            updatedRecallAlert.status === RecallEventStatus.Running ||
            updatedRecallAlert.status === RecallEventStatus.CheckRequested
          }
          className={classes.recallFormField}
          value={
            allGlobalRecalls.find(c => c.id === updatedRecallAlert.recallCampaignId)
              ?.nhtsaCampaign || ''
          }
          options={allGlobalRecalls.map(c => c.nhtsaCampaign)}
          isOptionEqualToValue={(o, v) => String(o) === String(v)}
          getOptionLabel={o => o}
          onChange={(e, v) =>
            handleRecallCampaignChange(
              allGlobalRecalls.find(c => c.nhtsaCampaign === v)?.id || null
            )
          }
          renderInput={autocompleteRender({
            isCustomFontSize: true,
            label: 'Recall Campaign',
            placeholder: 'Select campaign',
          })}
        />

        <div className={classes.recallFormField}>
          <TextField
            id="lastName"
            fullWidth
            value={
              allGlobalRecalls.find(c => c.id === updatedRecallAlert.recallCampaignId)
                ?.recallComponent || '-'
            }
            onChange={() => {}}
            disabled
            placeholder="-"
            name="recallComponent"
            label="Recall Component"
          />
        </div>
      </div>
    </div>
  );
};

export default RecallForm;
