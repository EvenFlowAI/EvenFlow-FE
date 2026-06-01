import React, { ChangeEventHandler, createRef, useCallback } from 'react';
import { Autocomplete, Button } from '@mui/material';
import { CSV_UPLOADED, VIN_CHECK_API } from '../../../../helper';
import { autocompleteRender } from '../../../../../../../utils/autocompleteRenders';
import { IRecallAlert, RecallListType } from '../../../../../../../store/reducers/recall/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { TextField } from '../../../../../../../components/formControls/TextFieldStyled/TextField';
import { ReactComponent as Upload } from '../../../../../../../assets/img/upload.svg';
import { ReactComponent as Reupload } from '../../../../../../../assets/img/Reupload.svg';
import { useException } from '../../../../../../../hooks/useException/useException';
import { useStyles } from '../../../styles';

interface RecallFormI {
  isEditTable: boolean;
  updatedRecallAlert: IRecallAlert;
  handleListMethodChange: (newValue: string) => void;
  handleRecallCampaignChange: (newValue: number) => void;
  onFileChange: (file: File | null) => void;
  file: File | null;
}

const allowedFileTypes = ['text/csv'];

const formatFileSize = (bytes: number): string => {
  const fmt = (n: number) => (n % 1 === 0 ? n.toFixed(0) : n.toFixed(1));
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1000 * 1000) return `${fmt(bytes / 1000)} KB`;
  if (bytes < 1000 * 1000 * 1000) return `${fmt(bytes / (1000 * 1000))} MB`;
  return `${fmt(bytes / (1000 * 1000 * 1000))} GB`;
};

const RecallForm = ({
  isEditTable,
  updatedRecallAlert,
  handleListMethodChange,
  handleRecallCampaignChange,
  onFileChange,
  file,
}: RecallFormI) => {
  const { classes } = useStyles();
  const { allGlobalsRecalls } = useSelector((state: RootState) => state.recallDatabase);
  const showError = useException();
  const ref = createRef<HTMLInputElement>();

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      if (event.target.files) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          console.log(file);
          if (!allowedFileTypes.includes(file.type)) {
            return showError('Please upload only CSV file');
          }
          if (e.target?.result) {
            onFileChange(file);
          }
        };
        if (ref.current) {
          ref.current.files = null;
          ref.current.value = '';
        }
      }
    },
    [ref]
  );

  return (
    <div>
      <div className={classes.recallFormSection}>
        <div style={{ marginBottom: '16px' }} className={classes.recallFormRow}>
          <Autocomplete
            disabled={!isEditTable}
            className={classes.recallFormField}
            value={
              updatedRecallAlert.listType === RecallListType.VIN_CHECK_API
                ? VIN_CHECK_API
                : updatedRecallAlert.listType === RecallListType.UPLOAD_CSV
                  ? CSV_UPLOADED
                  : ''
            }
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
          {updatedRecallAlert.listType === RecallListType.VIN_CHECK_API ? (
            <Button
              disabled={!isEditTable}
              className={classes.checkVinsButton}
              variant="outlined"
              onClick={() => {}}
            >
              Check Vins
            </Button>
          ) : updatedRecallAlert.listType === RecallListType.UPLOAD_CSV ? (
            <>
              <label htmlFor="uploadCSV" className={classes.uploadLabel}>
                <Button
                  disabled={!isEditTable}
                  className={classes.uploadButton}
                  variant="text"
                  onClick={() => ref.current?.click()}
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
                  ref={ref}
                />
              </label>
            </>
          ) : null}
        </div>
        {updatedRecallAlert.listType === RecallListType.UPLOAD_CSV && file ? (
          <span>
            {file.name} ({formatFileSize(file.size)})
          </span>
        ) : null}
      </div>
      <div className={classes.recallFormRow}>
        <Autocomplete
          disabled={!isEditTable}
          className={classes.recallFormField}
          value={
            allGlobalsRecalls.find(c => c.id === updatedRecallAlert.recallCampaignId)
              ?.nhtsaCampaign || ''
          }
          options={allGlobalsRecalls.map(c => c.nhtsaCampaign)}
          isOptionEqualToValue={(o, v) => String(o) === String(v)}
          getOptionLabel={o => o}
          onChange={(e, v) =>
            handleRecallCampaignChange(allGlobalsRecalls.find(c => c.nhtsaCampaign === v)?.id || 0)
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
              allGlobalsRecalls.find(c => c.id === updatedRecallAlert.recallCampaignId)
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
