import React, { useEffect, useMemo, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useDispatch, useSelector } from 'react-redux';
import { useException } from '../../../../hooks/useException/useException';
import { RootState } from '../../../../store/rootReducer';
import { useSelectedPod } from '../../../../hooks/useSelectedPod/useSelectedPod';
import { TForm } from './types';
import { initialForm } from './constants';
import {
  createCustomerConsent,
  getCurrentConsent,
  loadConsentById,
  updateCustomerConsent,
} from '../../../../store/reducers/screenSettings/actions';
import { Button, Grid } from '@mui/material';
import { useActionButtonsStyles } from '../../../../hooks/styling/useActionButtonsStyles';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';
import { SectionTitle } from './styles';
import { ICustomerConsentById } from '../../../../store/reducers/screenSettings/types';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import NameAndTitle from './NameAndTitle';
import AutocompletesConsent from './AutocompletesConsent';
import ConsentSelectors from './ConsentSelectors';
import BottomSelectors from './BottomSelectors';
import { buildCustomerConsent, hasEndTimeError, hasStartTimeError } from './helper';

const EditCustomerConsentModal: React.FC<DialogProps & { consentId: number | undefined }> = ({
  open,
  onClose,
  consentId,
}) => {
  const { advisorsList } = useSelector(({ scEmployees }: RootState) => scEmployees);
  const { scRequestsShort: serviceRequests } = useSelector(
    ({ serviceRequests }: RootState) => serviceRequests
  );
  const { makes } = useSelector(({ vehicleDetails }: RootState) => vehicleDetails);
  const { mobileZonesShort } = useSelector(({ mobileService }: RootState) => mobileService);
  const { svZonesShort } = useSelector(({ serviceValet }: RootState) => serviceValet);
  const { optionsShort: transportationsShort } = useSelector(
    ({ transportation }: RootState) => transportation
  );
  const { shortPodsList } = useSelector(({ pods }: RootState) => pods);
  const { slotRange } = useSelector(({ slotScoring }: RootState) => slotScoring);
  const { currentConsent, isConsentLoading, isLoading } = useSelector(
    ({ screenSettingsBooking }: RootState) => screenSettingsBooking
  );
  const [form, setForm] = useState<TForm>(initialForm);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();
  const dispatch = useDispatch();
  const showError = useException();
  const { classes } = useActionButtonsStyles();

  const startTimeError = useMemo(
    () => hasStartTimeError(form, slotRange, formIsChecked),
    [formIsChecked, slotRange, form]
  );

  const endTimeError = useMemo(
    () => hasEndTimeError(form, slotRange, formIsChecked),
    [formIsChecked, slotRange, form]
  );

  useEffect(() => {
    if (consentId && open) dispatch(loadConsentById(consentId));
  }, [consentId, open]);

  useEffect(() => {
    if (open) {
      if (currentConsent) {
        setForm(() => {
          const {
            name,
            title,
            message,
            isWaitlistEnabled,
            modelYearFrom,
            modelYearTo,
            appointmentTimeFrom,
            appointmentTimeTo,
            daysOfWeek,
          } = currentConsent;
          const selectedModels = makes
            .map(el => el.models)
            .flat(1)
            .filter(el => currentConsent.modelIds?.includes(el.id));

          // Get all models with the same names as the selected models
          const allModelsWithSameNames = makes
            .map(el => el.models)
            .flat(1)
            .filter(model =>
              selectedModels.some(
                selectedModel => selectedModel.name.toLowerCase() === model.name.toLowerCase()
              )
            );

          return {
            name,
            title,
            message,
            isWaitlistEnabled,
            modelYearFrom,
            modelYearTo,
            appointmentTimeFrom,
            appointmentTimeTo,
            daysOfWeek: daysOfWeek ?? [],
            makes: makes.filter(el => currentConsent.makeIds?.includes(el.id)),
            models: allModelsWithSameNames,
            customerType: currentConsent.customerType ?? null,
            serviceRequests: serviceRequests.filter(el =>
              currentConsent.serviceRequestIds?.includes(el.id)
            ),
            advisors: advisorsList.filter(el => currentConsent.advisorIds?.includes(el.id)),
            transportationOptions: transportationsShort.filter(el =>
              currentConsent.transportationOptionIds?.includes(el.id)
            ),
            mobileServiceZones: mobileZonesShort.filter(el =>
              currentConsent.mobileServiceZoneIds?.includes(el.id)
            ),
            serviceValetZones: svZonesShort.filter(el =>
              currentConsent.serviceValetZoneIds?.includes(el.id)
            ),
            serviceBooks: shortPodsList.filter(el =>
              currentConsent.serviceBookIds?.includes(el.id)
            ),
          };
        });
      }
    }
  }, [
    open,
    currentConsent,
    makes,
    serviceRequests,
    advisorsList,
    transportationsShort,
    mobileZonesShort,
    svZonesShort,
    shortPodsList,
  ]);

  const onCancel = () => {
    dispatch(getCurrentConsent(null));
    setForm(initialForm);
    setFormIsChecked(false);
    onClose();
  };

  const validationRules = [
    {
      condition: (form: TForm) =>
        form.modelYearFrom && form.modelYearTo && form.modelYearFrom > form.modelYearTo,
      message: '"Year To" should be more than "Year From"',
    },
    {
      condition: (form: TForm) => form.modelYearFrom && !form.modelYearTo,
      message: '"Year To" must not be empty. Either select "Year To" or remove "Year From" value',
    },
    {
      condition: (form: TForm) => form.modelYearTo && !form.modelYearFrom,
      message: '"Year From" must not be empty. Either select "Year From" or remove "Year To" value',
    },
    {
      condition: (form: TForm) => form.serviceValetZones.length && form.mobileServiceZones.length,
      message: '"Service Valet Zones" cannot be configured with "Mobile Service Zones"',
    },
    {
      condition: () => startTimeError || endTimeError,
      message:
        '"Appointment Time To" must be later than "Appointment Time From" and both must be inside of the Hours Of Operations',
    },
    {
      condition: (form: TForm) => form.mobileServiceZones.length && form.advisors.length,
      message: '"Service Advisors" cannot be configured with "Mobile Service Zones"',
    },
    {
      condition: (form: TForm) =>
        form.mobileServiceZones.length && form.transportationOptions.length,
      message: '"Transportation Options" cannot be configured with "Mobile Service Zones"',
    },
  ];

  const checkIsValid = () => {
    let isValid = Boolean(form.message.length && form.name.length && form.title.length);

    for (const rule of validationRules) {
      if (rule.condition(form)) {
        isValid = false;
        showError(rule.message);
        break;
      }
    }

    return isValid;
  };

  const onSave = () => {
    setFormIsChecked(true);
    if (checkIsValid() && selectedSC) {
      // Get all model IDs that share names with the selected models
      const allModelIds = makes
        .map(el => el.models)
        .flat(1)
        .filter(model =>
          form.models.some(
            selectedModel => selectedModel.name.toLowerCase() === model.name.toLowerCase()
          )
        )
        .map(({ id }) => id);

      const data = buildCustomerConsent({ form, selectedSC, selectedPod, allModelIds });
      if (currentConsent) {
        const updateData: ICustomerConsentById = { ...data, id: currentConsent.id };
        dispatch(updateCustomerConsent(updateData, showError, onCancel));
      } else {
        dispatch(createCustomerConsent(data, showError, onCancel));
      }
    }
  };

  return (
    <BaseModal open={open} width={940} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>{consentId ? 'Edit' : 'Add'} Customer Consent</DialogTitle>
      <DialogContent>
        {isConsentLoading || isLoading ? (
          <Loading />
        ) : (
          <>
            <Grid container spacing={3} style={{ marginBottom: 36 }}>
              <Grid item xs={12}>
                <SectionTitle>Consent</SectionTitle>
              </Grid>
              <NameAndTitle
                form={form}
                setForm={setForm}
                formIsChecked={formIsChecked}
                setFormIsChecked={setFormIsChecked}
              />
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: 36 }}>
              <Grid item xs={12}>
                <SectionTitle>Appointment Request</SectionTitle>
              </Grid>
              <AutocompletesConsent
                form={form}
                setForm={setForm}
                formIsChecked={formIsChecked}
                setFormIsChecked={setFormIsChecked}
              />
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: 36 }}>
              <Grid item xs={12}>
                <SectionTitle>Customer & Vehicle</SectionTitle>
              </Grid>
              <ConsentSelectors
                form={form}
                setForm={setForm}
                formIsChecked={formIsChecked}
                setFormIsChecked={setFormIsChecked}
              />
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: 36 }}>
              <Grid item xs={12}>
                <SectionTitle>Time Factor</SectionTitle>
              </Grid>
              <BottomSelectors
                form={form}
                setForm={setForm}
                formIsChecked={formIsChecked}
                setFormIsChecked={setFormIsChecked}
              />
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <div className={classes.wrapper}>
          <div className={classes.buttonsWrapper}>
            <Button onClick={onCancel} variant="text" style={{ marginRight: 20 }} color="info">
              Close
            </Button>
            <LoadingButton
              loading={isConsentLoading || isLoading}
              onClick={onSave}
              disabled={!form.message.length || !form.name.length || !form.title.length}
              className={classes.saveButton}
            >
              Save
            </LoadingButton>
          </div>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default EditCustomerConsentModal;
