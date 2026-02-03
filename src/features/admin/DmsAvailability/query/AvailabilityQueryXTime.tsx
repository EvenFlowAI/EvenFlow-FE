import React, { useEffect, useState } from 'react';
import { TFormXTime } from '../types';
import { loadSCRequestsShort } from '../../../../store/reducers/serviceRequests/actions';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { Autocomplete } from '@mui/material';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { loadTransportationOptions } from '../../../../store/reducers/transportationNeeds/actions';
import { loadMakes } from '../../../../store/reducers/packages/actions';
import CustomDateRangePicker from '../../../../components/pickers/CustomDateRangePicker/CustomDateRangePicker';
import { ETransportationType } from '../../../../store/reducers/transportationNeeds/types';
import AddressFields from './AddressFields';
import { yearOptions } from '../../ScreenSettings/EditCustomerConsentModal/constants';
import { loadServiceConsultants } from '../../../../store/reducers/appointments/actions';

interface AvailabilityQueryProps {
  form: TFormXTime;
  setForm: React.Dispatch<React.SetStateAction<TFormXTime>>;
  formIsCheckedXTime: boolean;
  setIsCheckedXTime: React.Dispatch<React.SetStateAction<boolean>>;
}

const AvailabilityQueryXTime = ({
  form,
  setForm,
  formIsCheckedXTime,
  setIsCheckedXTime,
}: AvailabilityQueryProps) => {
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { scRequestsShort: serviceRequests } = useSelector(
    ({ serviceRequests }: RootState) => serviceRequests
  );
  const { serviceAdvisors } = useSelector(({ appointments }: RootState) => appointments);
  const { options: transportations } = useSelector(
    ({ transportation }: RootState) => transportation
  );
  const { makes } = useSelector((state: RootState) => state.packages);
  const [models, setModels] = useState<string[]>([]);
  const [showAddressFields, setShowAddressFields] = useState<boolean>(false);

  if (!selectedSC) throw new Error('No selected SC');

  useEffect(() => {
    dispatch(loadSCRequestsShort(selectedSC.id));
    dispatch(loadServiceConsultants(selectedSC.id));
    dispatch(loadTransportationOptions(selectedSC.id));
    dispatch(loadMakes(selectedSC.id));
  }, []);

  useEffect(() => {
    if (form.make) {
      setModels(
        makes.find(make => make.name === form.make?.name)?.models.map(model => model.name) ?? []
      );
    } else {
      setForm(prev => ({ ...prev, model: null }));
    }
  }, [form.make]);

  const onServiceRequestChange = (newValue: string | null) => {
    setIsCheckedXTime(false);
    const selectedOpCode = serviceRequests.find(opCode => opCode.code === newValue);
    setForm(prev => ({
      ...prev,
      opCode: {
        name: newValue,
        id: selectedOpCode?.id || null,
      },
    }));
  };

  const onAdvisorChange = (newValue: string | null) => {
    setIsCheckedXTime(false);
    const selectedAdvisor = serviceAdvisors.find(advisor => advisor.fullName === newValue);
    setForm(prev => ({
      ...prev,
      advisor: {
        name: newValue,
        id: selectedAdvisor?.id || null,
      },
    }));
  };

  const onTransportationChange = (newValue: string | null) => {
    setIsCheckedXTime(false);
    const selectedTransportation = transportations.find(
      transportation => transportation.description === newValue
    );
    setForm(prev => ({
      ...prev,
      transportation: {
        name: newValue || '',
        type: selectedTransportation?.type || null,
        id: selectedTransportation?.id || null,
      },
      pickUpAddress: null,
      dropOffAddress: null,
    }));
    if (selectedTransportation?.type === ETransportationType.PickUpDelivery) {
      setShowAddressFields(true);
    } else {
      setShowAddressFields(false);
    }
  };

  const onMakeChange = (newValue: string | null) => {
    setIsCheckedXTime(false);
    const selectedMake = makes.find(make => make.name === newValue);

    setForm(prev => ({
      ...prev,
      make: {
        name: newValue,
        id: selectedMake?.id || null,
      },
    }));
  };

  const onModelChange = (newValue: string | null) => {
    setIsCheckedXTime(false);
    const foundMake = makes.find(make => make.name === form.make?.name);
    if (foundMake) {
      const selectedModel = foundMake.models.find(model => model.name === newValue);

      setForm(prev => ({
        ...prev,
        model: {
          name: newValue,
          id: selectedModel?.id || null,
        },
      }));
    }
  };

  const onYearChange = (newValue: string | null) => {
    setIsCheckedXTime(false);
    setForm(prev => ({ ...prev, year: newValue }));
  };

  return (
    <>
      <CustomDateRangePicker
        value={form.date}
        setValue={date => setForm(prev => ({ ...prev, date }))}
        format="MMM D, YYYY"
      />
      <div>
        <Autocomplete
          options={serviceRequests?.map(el => el.code) ?? []}
          style={{ width: '329px' }}
          getOptionLabel={option => option}
          value={form.opCode?.name}
          isOptionEqualToValue={(o, v) => o === v}
          onChange={(e, newValue) => onServiceRequestChange(newValue)}
          renderInput={autocompleteRender({
            label: 'Op code  *',
            placeholder: 'Op code',
            error: formIsCheckedXTime && !form.opCode?.name?.length,
          })}
        />
      </div>
      <div>
        <Autocomplete
          options={serviceAdvisors?.map(el => el.fullName) ?? []}
          style={{ width: '329px' }}
          getOptionLabel={i => i}
          value={form.advisor?.name}
          isOptionEqualToValue={(o, s) => o === s}
          onChange={(e, newValue) => onAdvisorChange(newValue)}
          renderInput={autocompleteRender({
            label: 'Advisor',
            placeholder: 'Advisor',
          })}
        />
      </div>
      <div>
        <Autocomplete
          options={transportations?.map(el => el.description) ?? []}
          style={{ width: '329px' }}
          getOptionLabel={i => i}
          value={form.transportation?.name}
          isOptionEqualToValue={(o, s) => o === s}
          onChange={(e, newValue) => onTransportationChange(newValue)}
          renderInput={autocompleteRender({
            label: 'Transportation',
            placeholder: 'Transportation',
          })}
        />
      </div>
      {showAddressFields && (
        <AddressFields
          formXTime={form}
          setFormXTime={setForm}
          isFormChecked={formIsCheckedXTime}
          setIsFormChecked={setIsCheckedXTime}
        />
      )}
      <div>
        <Autocomplete
          options={makes?.map(el => el.name) ?? []}
          style={{ width: '329px' }}
          getOptionLabel={i => i}
          value={form.make?.name}
          isOptionEqualToValue={(o, s) => o === s}
          onChange={(e, newValue) => onMakeChange(newValue)}
          renderInput={autocompleteRender({
            label: 'Make *',
            placeholder: 'Make',
            error: formIsCheckedXTime && !form.make?.name?.length,
          })}
        />
      </div>
      <div>
        <Autocomplete
          options={models ?? []}
          disabled={!form.make}
          style={{ width: '329px' }}
          getOptionLabel={i => i}
          value={form.model?.name}
          isOptionEqualToValue={(o, s) => o === s}
          onChange={(e, newValue) => onModelChange(newValue)}
          renderInput={autocompleteRender({
            label: 'Model *',
            placeholder: 'Model',
            error: formIsCheckedXTime && !form.model?.name?.length,
          })}
        />
      </div>
      <div>
        <Autocomplete
          style={{ marginBottom: 10 }}
          options={yearOptions}
          isOptionEqualToValue={(option, value) => option === value}
          value={form.year}
          onChange={(e, newValue) => onYearChange(newValue)}
          renderInput={autocompleteRender({
            label: 'Year *',
            placeholder: 'Year',
            error: formIsCheckedXTime && !form.year?.length,
          })}
        />
      </div>
    </>
  );
};

export default AvailabilityQueryXTime;
