import React, { useEffect, useState } from 'react';
import { TFormTekion } from '../types';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { loadSCAdvisors } from '../../../../store/reducers/employees/actions';
import { loadTransportationOptions } from '../../../../store/reducers/transportationNeeds/actions';
import CustomDateRangePicker from '../../../../components/pickers/CustomDateRangePicker/CustomDateRangePicker';
import { Autocomplete } from '@mui/material';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import AddressFields from './AddressFields';
import { ETransportationType } from '../../../../store/reducers/transportationNeeds/types';
import { loadPodsShort } from '../../../../store/reducers/pods/actions';

interface AvailabilityQueryTekionProps {
  form: TFormTekion;
  setForm: React.Dispatch<React.SetStateAction<TFormTekion>>;
  formIsCheckedTekion: boolean;
  setIsCheckedTekion: React.Dispatch<React.SetStateAction<boolean>>;
}

const AvailabilityQueryTekion = ({
  form,
  setForm,
  formIsCheckedTekion,
  setIsCheckedTekion,
}: AvailabilityQueryTekionProps) => {
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { advisorsList } = useSelector(({ scEmployees }: RootState) => scEmployees);
  const { shortPodsList } = useSelector(({ pods }: RootState) => pods);

  const { options: transportations } = useSelector(
    ({ transportation }: RootState) => transportation
  );
  const [showAddressFields, setShowAddressFields] = useState<boolean>(false);

  if (!selectedSC) throw new Error('No selected SC');

  useEffect(() => {
    dispatch(loadSCAdvisors(selectedSC.id));
    dispatch(loadTransportationOptions(selectedSC.id));
    dispatch(loadPodsShort(selectedSC.id));
  }, []);

  const onAdvisorChange = (newValue: string | null) => {
    setIsCheckedTekion(false);
    setForm(prev => ({ ...prev, advisor: newValue }));
  };

  const onPodChange = (newValue: string | null) => {
    setIsCheckedTekion(false);
    setForm(prev => ({ ...prev, pod: newValue }));
  };

  const onTransportationChange = (newValue: string | null) => {
    setIsCheckedTekion(false);
    const selectedTransportation = transportations.find(
      transportation => transportation.description === newValue
    );
    setForm(prev => ({
      ...prev,
      transportation: {
        name: newValue || '',
        type: selectedTransportation?.type || null,
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

  return (
    <>
      <CustomDateRangePicker
        value={form.date}
        setValue={date => setForm(prev => ({ ...prev, date }))}
        format="MMM D, YYYY"
      />
      <div>
        <Autocomplete
          options={shortPodsList?.map(el => el.name) ?? []}
          style={{ width: '329px' }}
          getOptionLabel={i => i}
          value={form.pod}
          isOptionEqualToValue={(o, s) => o === s}
          onChange={(e, newValue) => onPodChange(newValue)}
          renderInput={autocompleteRender({
            label: 'Service Book *',
            placeholder: 'Service Book',
            error: formIsCheckedTekion && !form.pod?.length,
          })}
        />
      </div>
      <div>
        <Autocomplete
          options={advisorsList?.map(el => el.fullName) ?? []}
          style={{ width: '329px' }}
          getOptionLabel={i => i}
          value={form.advisor}
          isOptionEqualToValue={(o, s) => o === s}
          onChange={(e, newValue) => onAdvisorChange(newValue)}
          renderInput={autocompleteRender({
            label: 'Advisor *',
            placeholder: 'Advisor',
            error: formIsCheckedTekion && !form.advisor?.length,
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
            label: 'Transportation *',
            placeholder: 'Transportation',
            error: formIsCheckedTekion && !form.transportation?.name?.length,
          })}
        />
      </div>
      {showAddressFields && (
        <AddressFields
          formTekion={form}
          setFormTekion={setForm}
          isFormChecked={formIsCheckedTekion}
          setIsFormChecked={setIsCheckedTekion}
        />
      )}
    </>
  );
};

export default AvailabilityQueryTekion;
