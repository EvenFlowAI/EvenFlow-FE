import React, { ChangeEventHandler, useCallback } from 'react';
import { Autocomplete } from '@mui/material';
import { CSV_UPLOADED, VIN_CHECK_API } from '../../../../helper';
import { autocompleteRender } from '../../../../../../../utils/autocompleteRenders';
import { IRecallAlert } from '../../../../../../../store/reducers/recall/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { TextField } from '../../../../../../../components/formControls/TextFieldStyled/TextField';
import { useException } from '../../../../../../../hooks/useException/useException';
import { useStyles } from '../../../styles';
import { checkVins, getRecallEvents } from '../../../../../../../store/reducers/recall/actions';
import { useSCs } from '../../../../../../../hooks/useSCs/useSCs';
import ListMethodAction from './ListMethodAction';
import RecallFileInfo from './RecallFileInfo';
import { getListMethodValue, isRecallLocked } from './recallForm.utils';
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
  const isDisabled = !isEditTable || isRecallLocked(updatedRecallAlert.status);
  const selectedRecall = allGlobalRecalls.find(c => c.id === updatedRecallAlert.recallCampaignId);
  const recallCampaignOptions = allGlobalRecalls.map(c => c.nhtsaCampaign);
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
            disabled={isDisabled}
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
        <RecallFileInfo
          listType={updatedRecallAlert.listType}
          file={file}
          vinsFileLink={updatedRecallAlert.vinsFileLink}
        />
      </div>
      <div className={classes.recallFormRow}>
        <Autocomplete
          disabled={isDisabled}
          className={classes.recallFormField}
          value={selectedRecall?.nhtsaCampaign || ''}
          options={recallCampaignOptions}
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
            value={selectedRecall?.recallComponent || '-'}
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
