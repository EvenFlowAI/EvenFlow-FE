import React, { SyntheticEvent, useEffect, useMemo } from 'react';
import { Autocomplete, Button, FormHelperText } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../../components/modals/BaseModal/types';
import { LoadingButton } from '../../../../../components/buttons/LoadingButton/LoadingButton';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { useAutocompleteStyles } from '../../../../../hooks/styling/useAutocompleteStyles';
import { RootState } from '../../../../../store/rootReducer';
import { IAssignedServiceRequestShort } from '../../../../../store/reducers/serviceRequests/types';
import { IPlayWithServiceBook } from './ServicePulse';
import { useStyles } from './styles';
import { renderChipTagsWithoutOptionObject } from '../../../../../features/admin/Transportations/EditTransportationModal/layouts/ChipTagRender';
import {
  EConsultantRole,
  TServiceConsultant,
} from '../../../../../store/reducers/appointments/types';
import { TTransportationShort } from '../../../../../store/reducers/transportationNeeds/types';

export const FIRST_AVAILABLE_ADVISOR: TServiceConsultant = {
  id: -1,
  dmsId: '',
  fullName: 'First Available',
  role: EConsultantRole.Advisor,
};

type TPlaySettingsModalProps = DialogProps & {
  play: IPlayWithServiceBook | null;
  selectedServiceRequests: IAssignedServiceRequestShort[];
  selectedAdvisor: TServiceConsultant | null;
  selectedTransportation: TTransportationShort | null;
  onServiceRequestsChange: (e: SyntheticEvent, options: IAssignedServiceRequestShort[]) => void;
  onAdvisorChange: (e: SyntheticEvent, option: TServiceConsultant | null) => void;
  onTransportationChange: (e: SyntheticEvent, option: TTransportationShort | null) => void;
  isFormChecked: boolean;
  setIsFormChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlaySettingsModal: React.FC<TPlaySettingsModalProps> = ({
  onClose,
  open,
  play,
  selectedServiceRequests,
  selectedAdvisor,
  selectedTransportation,
  onServiceRequestsChange,
  onAdvisorChange,
  onTransportationChange,
  isFormChecked,
  setIsFormChecked,
  ...props
}) => {
  const { classes: autocompleteClasses } = useAutocompleteStyles();
  const { classes } = useStyles();
  const { scRequestsShort: serviceRequests } = useSelector(
    ({ serviceRequests }: RootState) => serviceRequests
  );
  const { serviceAdvisors } = useSelector((state: RootState) => state.appointments);
  const { optionsShort: transportations } = useSelector(
    ({ transportation }: RootState) => transportation
  );

  useEffect(() => {
    if (open) setIsFormChecked(false);
  }, [open]);

  const advisorOptions = useMemo(
    () => [FIRST_AVAILABLE_ADVISOR, ...serviceAdvisors],
    [serviceAdvisors]
  );

  const servicesError = isFormChecked && !selectedServiceRequests.length;
  const advisorError = isFormChecked && !selectedAdvisor;
  const transportationError = isFormChecked && !selectedTransportation;

  const handleClose = () => {
    onClose?.({}, 'escapeKeyDown');
  };

  const handleSave = () => {
    setIsFormChecked(true);

    if (!selectedServiceRequests.length || !selectedAdvisor || !selectedTransportation) return;
  };

  if (!play) return null;

  return (
    <BaseModal open={open} onClose={onClose} width={600} {...props}>
      <DialogTitle onClose={handleClose}>{`Play Configuration - ${play.name}`}</DialogTitle>
      <DialogContent>
        <div className={classes.modalBodyContainer}>
          <div className={classes.fieldWrapper}>
            <Autocomplete
              multiple
              classes={autocompleteClasses}
              options={serviceRequests}
              value={selectedServiceRequests}
              onChange={onServiceRequestsChange}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              getOptionLabel={option => option.code}
              disableCloseOnSelect
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  flexWrap: 'nowrap',
                },
              }}
              renderTags={(selected, getTagProps) =>
                renderChipTagsWithoutOptionObject(
                  selected.map(item => item.code),
                  getTagProps,
                  450
                )
              }
              renderInput={autocompleteRender({
                label: 'Services',
                placeholder: selectedServiceRequests.length ? '' : 'Select services',
                error: servicesError,
              })}
            />
            {servicesError && (
              <FormHelperText error className={classes.errorText}>
                Services is required.
              </FormHelperText>
            )}
          </div>
          <div className={classes.fieldWrapper}>
            <Autocomplete
              value={selectedAdvisor}
              options={advisorOptions}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              getOptionLabel={o => o.fullName}
              onChange={onAdvisorChange}
              renderInput={autocompleteRender({
                isCustomFontSize: true,
                label: 'Advisor',
                placeholder: 'Select an advisor',
                error: advisorError,
              })}
            />
            {advisorError && (
              <FormHelperText error className={classes.errorText}>
                Advisor is required.
              </FormHelperText>
            )}
          </div>
          <div className={classes.fieldWrapper}>
            <Autocomplete
              value={selectedTransportation}
              options={transportations}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              getOptionLabel={o => o.name}
              onChange={onTransportationChange}
              renderInput={autocompleteRender({
                isCustomFontSize: true,
                label: 'Transportation',
                placeholder: 'Select transportation',
                error: transportationError,
              })}
            />
            {transportationError && (
              <FormHelperText error className={classes.errorText}>
                Transportation is required.
              </FormHelperText>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info">
          Close
        </Button>
        <LoadingButton onClick={handleSave} variant="contained" color="primary">
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};

export default PlaySettingsModal;
