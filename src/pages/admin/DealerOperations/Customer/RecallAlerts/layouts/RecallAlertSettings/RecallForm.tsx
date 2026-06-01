import React from 'react';
import { Autocomplete, Button } from '@mui/material';
import { CSV_UPLOADED, VIN_CHECK_API } from '../../../../helper';
import { autocompleteRender } from '../../../../../../../utils/autocompleteRenders';
import { IRecallAlert } from '../../../../../../../store/reducers/recall/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { TextField } from '../../../../../../../components/formControls/TextFieldStyled/TextField';

interface RecallFormI {
  isEditTable: boolean;
  updatedRecallAlert: IRecallAlert;
  handleListMethodChange: (newValue: string) => void;
  handleRecallCampaignChange: (newValue: number) => void;
}

const RecallForm = ({
  isEditTable,
  updatedRecallAlert,
  handleListMethodChange,
  handleRecallCampaignChange,
}: RecallFormI) => {
  const { allGlobalsRecalls } = useSelector((state: RootState) => state.recallDatabase);

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '16px' }}>
        <Autocomplete
          disabled={!isEditTable}
          style={{ width: '300px' }}
          value={
            updatedRecallAlert.listType === 0
              ? VIN_CHECK_API
              : updatedRecallAlert.listType === 1
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
        {updatedRecallAlert.listType === 0 ? (
          <Button
            disabled={!isEditTable}
            style={{ height: '42px' }}
            variant="outlined"
            onClick={() => {}}
          >
            Check Vins
          </Button>
        ) : updatedRecallAlert.listType === 1 ? (
          <Button
            disabled={!isEditTable}
            style={{ height: '42px' }}
            variant="outlined"
            onClick={() => {}}
          >
            CSV
          </Button>
        ) : null}
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
        <Autocomplete
          disabled={!isEditTable}
          style={{ width: '300px' }}
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

        <div style={{ width: '300px' }}>
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
