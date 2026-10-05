import React from 'react';
import { Autocomplete, Box, Button, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { NHTSA_LINK } from '../../../../utils/constants';
import { formatYears } from '../../../../components/modals/admin/ViewGlobalRecall/helper';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { IRecall } from '../../../../store/reducers/recall/types';
import { getRecallMakes, getRecallModelsWithYears } from '../utils';
import { useEditRecallStyles } from './styles';
import { TForm } from './types';

type TProps = {
  recall: IRecall;
  form: TForm;
  formIsChecked: boolean;
  allAssignedList: IAssignedServiceRequest[];
  onFormChange: React.ChangeEventHandler<HTMLInputElement>;
  onSRChange: (e: React.SyntheticEvent, value: IAssignedServiceRequest | null) => void;
};

const InfoItem: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => {
  const { classes } = useEditRecallStyles();
  return (
    <Box>
      <Typography className={classes.label}>{label}</Typography>
      {children}
    </Box>
  );
};

export const EditRecallContent: React.FC<React.PropsWithChildren<TProps>> = ({
  recall,
  form,
  formIsChecked,
  allAssignedList,
  onFormChange,
  onSRChange,
}) => {
  const { classes } = useEditRecallStyles();
  const makes = getRecallMakes(recall);
  const models = getRecallModelsWithYears(recall);

  const openNhtsaLink = () => {
    if (!recall.recallCampaignNumber) return;
    window.open(NHTSA_LINK + recall.recallCampaignNumber, '_blank');
  };

  return (
    <>
      <div className={classes.topRow}>
        <div style={{ width: '553px', marginRight: '12px' }}>
          <TextField
            className={classes.componentField}
            fullWidth
            label="Recall Component"
            id="recallComponent"
            name="recallComponent"
            placeholder="Type Recall Component"
            error={formIsChecked && !form.recallComponent}
            onChange={onFormChange}
            value={form.recallComponent}
          />
        </div>
        <div>
          <Autocomplete
            className={classes.opCodeField}
            options={allAssignedList}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            getOptionLabel={o => o.serviceRequest.code}
            getOptionKey={o => o.serviceRequest.code + o.id}
            value={form.serviceRequest}
            onChange={onSRChange}
            renderInput={autocompleteRender({
              label: 'Op Code Assignment',
              error: formIsChecked && !form.serviceRequest,
              placeholder: 'Select Op Code',
            })}
          />
        </div>
      </div>
      <div className={classes.body}>
        <div className={classes.infoPanel}>
          <InfoItem label="NHTSA Campaign">
            <Typography className={classes.value}>{recall.recallCampaignNumber || '-'}</Typography>
          </InfoItem>
          <InfoItem label="OEM Program">
            <Typography className={classes.value}>{recall.oemProgram || '-'}</Typography>
          </InfoItem>
          <InfoItem label="Makes">
            <Typography className={classes.value}>
              {makes.length ? makes.join(', ') : '-'}
            </Typography>
          </InfoItem>
          <InfoItem label="Models">
            {models.length ? (
              <div className={classes.modelsWrapper}>
                {models.map(model => (
                  <div key={model.key} className={classes.modelItem}>
                    <Typography>{model.name}</Typography>
                    {model.years.length ? (
                      <Typography>{formatYears(model.years)}</Typography>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <Typography className={classes.value}>-</Typography>
            )}
          </InfoItem>
          <InfoItem label="Reported Date">
            <Typography className={classes.value}>
              {recall.reportedDate ? dayjs(recall.reportedDate).format('MMMM D, YYYY') : '-'}
            </Typography>
          </InfoItem>
          <InfoItem label="Impacted Vehicles">
            <Typography className={classes.value}>
              {recall.impactedVehicles?.toLocaleString() ?? '-'}
            </Typography>
          </InfoItem>
          <InfoItem label="Do Not Drive">
            <Typography className={classes.value}>{recall.doNotDrive ? 'Yes' : 'No'}</Typography>
          </InfoItem>
          <InfoItem label="Fire Risk">
            <Typography className={classes.value}>{recall.fireRisk ? 'Yes' : 'No'}</Typography>
          </InfoItem>
          <InfoItem label="Recall Link">
            {recall.recallCampaignNumber ? (
              <Button
                variant="text"
                color="primary"
                className={classes.link}
                onClick={openNhtsaLink}
              >
                NHTSA link
              </Button>
            ) : (
              <Typography className={classes.value}>-</Typography>
            )}
          </InfoItem>
        </div>
        <div className={classes.details}>
          <Divider className={classes.divider} />
          <Typography className={classes.bigLabel}>Summary</Typography>
          <Typography className={classes.text}>{recall.recallSummary || '-'}</Typography>
          <Divider className={classes.divider} />
          <Typography className={classes.bigLabel}>Safety Risk</Typography>
          <Typography className={classes.text}>{recall.safetyRisk || '-'}</Typography>
          <Divider className={classes.divider} />
          <Typography className={classes.bigLabel}>Remedy</Typography>
          <Typography className={classes.text}>{recall.remedy || '-'}</Typography>
        </div>
      </div>
    </>
  );
};
