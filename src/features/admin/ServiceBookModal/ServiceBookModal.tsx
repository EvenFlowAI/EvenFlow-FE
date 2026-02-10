import React, { useEffect, useMemo, useState } from 'react';
import { DialogProps } from '../../../components/modals/BaseModal/types';
import { EAppointmentType, EJobType, IPodForm } from '../../../store/reducers/pods/types';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../components/modals/BaseModal/BaseModal';
import { Button, Grid } from '@mui/material';
import { SC_UNDEFINED } from '../../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import {
  createPod,
  loadPodById,
  setPodById,
  updatePod,
} from '../../../store/reducers/pods/actions';
import { getOptions } from '../../../utils/utils';
import { initialForm, ServiceBookState, TForm, TOption } from './types';
import { LoadingButton } from '../../../components/buttons/LoadingButton/LoadingButton';
import { useMessage } from '../../../hooks/useMessage/useMessage';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import AppointmentAutocompleteGroup from './forms/AppointmentAutocompleteGroup';
import VehicleAutocompleteGroup from './forms/VehicleAutocompleteGroup';
import SettingAutocompleteGroup from './forms/SettingAutocompleteGroup';
import {
  getFilteredMakes,
  getModelsFromMakes,
  getSelectedModels,
  mapAppointmentTypeOption,
  mapJobTypeOption,
  mapSelectedItems,
  validateMileage,
  validateName,
  validateTechnicians,
  validateZones,
} from './helper';
import { useLoadSCData } from './useLoadSCData';

export const ServiceBookModal: React.FC<
  DialogProps & { editingItemId: number | undefined; isActive: boolean }
> = ({ editingItemId, isActive, ...props }) => {
  const { makes, engineTypes } = useSelector(({ vehicleDetails }: RootState) => vehicleDetails);
  const { options: transportations } = useSelector(
    ({ transportation }: RootState) => transportation
  );
  const { zones: serviceValetZones } = useSelector(({ serviceValet }: RootState) => serviceValet);
  const { zones } = useSelector(({ mobileService }: RootState) => mobileService);
  const { podsLoading, podById } = useSelector(({ pods }: RootState) => pods);

  const [form, setForm] = useState<TForm>(initialForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

  const [state, setState] = useState<ServiceBookState>({
    selectedMakes: [],
    modelsOptions: [],
    selectedModels: [],
    mobileZones: [],
    mileageFrom: '',
    mileageTo: '',
    selectedServiceValetZones: [],
    selectedEngineTypes: [],
    jobType: null,
    appointmentType: null,
    transportationOptions: [],
  });

  const { selectedSC } = useSCs();
  const showError = useException();
  const showMessage = useMessage();
  const dispatch = useDispatch();

  const jobTypeOptions: TOption[] = useMemo(
    () => getOptions(Object.keys(EJobType).filter(key => Number.isNaN(+key))),
    []
  );
  const appointmentTypeOptions: TOption[] = useMemo(
    () => getOptions(Object.keys(EAppointmentType).filter(key => Number.isNaN(+key))),
    []
  );

  useEffect(() => {
    if (props.open) {
      if (editingItemId) {
        dispatch(loadPodById(editingItemId));
      } else {
        setForm(initialForm);
      }
    }
  }, [editingItemId, props.open]);

  useEffect(() => {
    if (!props.open) return;

    setForm({ ...initialForm, ...podById });

    setState(prev => ({
      ...prev,
      jobType: mapJobTypeOption(jobTypeOptions, podById?.jobType),
      appointmentType: mapAppointmentTypeOption(appointmentTypeOptions, podById?.appointmentType),
      mobileZones: mapSelectedItems(zones, podById?.mobileZones),
      selectedServiceValetZones: mapSelectedItems(serviceValetZones, podById?.serviceValetZones),
      selectedEngineTypes: mapSelectedItems(engineTypes, podById?.engineTypes),
      transportationOptions: mapSelectedItems(transportations, podById?.transportationOptions),
      mileageFrom: podById?.mileageFrom?.toString() ?? '',
      mileageTo: podById?.mileageTo?.toString() ?? '',
    }));
  }, [
    props.open,
    podById,
    jobTypeOptions,
    appointmentTypeOptions,
    zones,
    serviceValetZones,
    engineTypes,
    transportations,
  ]);

  useEffect(() => {
    if (!props.open) return;

    const filteredMakes = getFilteredMakes(makes, podById?.vehicleMakes);
    const modelsOptions = getModelsFromMakes(makes, podById?.vehicleMakes);
    const selectedModels = getSelectedModels(modelsOptions, podById?.vehicleModels);

    setState(prev => ({
      ...prev,
      modelsOptions,
      selectedMakes: filteredMakes,
      selectedModels,
    }));
  }, [makes, props.open, podById]);

  useLoadSCData(props.open, selectedSC);

  const checkIsValid = (): boolean => {
    setFormIsChecked(true);

    const results = [
      validateName(form, showError),
      validateTechnicians(form, showError),
      validateMileage(state, showError),
      validateZones(state, form, showError),
    ];

    return results.every(Boolean);
  };

  const handleSave = async () => {
    if (!selectedSC) {
      showError(SC_UNDEFINED);
    } else {
      if (checkIsValid()) {
        setLoading(true);
        try {
          const data: IPodForm = {
            advisors: form.advisors.map(el => el.id),
            description: form.description,
            name: form.name?.trim(),
            serviceCenterId: selectedSC.id,
            serviceRequests: form.serviceRequests.map(sr => sr.id),
            technicians: form.technicians.map(t => t.id),
            vehicleMakes: state.selectedMakes.map(item => item.id),
            vehicleModels: state.selectedModels.map(item => item.id),
            mobileZones: state.mobileZones.map(zone => zone.id),
            serviceValetZones: state.selectedServiceValetZones.map(zone => zone.id),
            engineTypes: state.selectedEngineTypes.map(type => type.id),
            isVisitCenter: form.isVisitCenter,
          };
          if (state.jobType) data.jobType = state.jobType.value;
          if (state.appointmentType) data.appointmentType = state.appointmentType.value;
          if (state.transportationOptions?.length)
            data.transportationOptionIds = state.transportationOptions.map(el => el.id);
          if (state.mileageFrom) {
            data.mileageFrom = +state.mileageFrom;
          }
          if (state.mileageTo) {
            data.mileageTo = +state.mileageTo;
          }
          if (editingItemId && podById) {
            await dispatch(updatePod(data, podById.id, isActive));
          } else {
            await dispatch(createPod(data, isActive));
          }
          setLoading(false);
          setFormIsChecked(false);
          showMessage(`Service Book ${podById ? 'updated' : 'created'}`);
          props.onClose();
        } catch (e) {
          setLoading(false);
          showError(e);
        }
      }
    }
  };

  const onCancel = () => {
    setFormIsChecked(false);
    dispatch(setPodById(null));
    props.onClose();
  };

  return (
    <BaseModal {...props} maxWidth="md" onClose={onCancel}>
      <DialogTitle onClose={onCancel}>
        {editingItemId ? 'Configure Service Book' : 'Add Service Book'}
      </DialogTitle>
      <DialogContent>
        {podsLoading ? (
          <Loading />
        ) : (
          <Grid container spacing={3}>
            <AppointmentAutocompleteGroup
              setFormIsChecked={setFormIsChecked}
              formIsChecked={formIsChecked}
              setForm={setForm}
              form={form}
              loading={loading}
              state={state}
              setState={setState}
            />
            <VehicleAutocompleteGroup
              setFormIsChecked={setFormIsChecked}
              formIsChecked={formIsChecked}
              loading={loading}
              state={state}
              setState={setState}
            />
            <SettingAutocompleteGroup
              form={form}
              setForm={setForm}
              setFormIsChecked={setFormIsChecked}
              formIsChecked={formIsChecked}
              loading={loading}
              state={state}
              setState={setState}
            />
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="info" disabled={podsLoading}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSave}
          loading={loading || podsLoading}
          variant="contained"
          color="primary"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};
