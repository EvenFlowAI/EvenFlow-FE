import React from 'react';
import { Autocomplete, Grid } from '@mui/material';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../utils/autocompleteRenders';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IPodShort } from '../../../../store/reducers/pods/types';
import { IAdvisorShort } from '../../../../store/reducers/users/types';
import { TTransportationShort } from '../../../../store/reducers/transportationNeeds/types';
import { TGeographicZoneShort } from '../../../../types/types';
import { TForm } from './types';
import { IAssignedServiceRequestShort } from '../../../../store/reducers/serviceRequests/types';

interface AutocompletesConsentProps {
  form: TForm;
  formIsChecked: boolean;
  setFormIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
}

const AutocompletesConsent = ({
  form,
  formIsChecked,
  setFormIsChecked,
  setForm,
}: AutocompletesConsentProps) => {
  const { shortPodsList } = useSelector(({ pods }: RootState) => pods);
  const { advisorsList } = useSelector(({ scEmployees }: RootState) => scEmployees);
  const { optionsShort: transportationsShort } = useSelector(
    ({ transportation }: RootState) => transportation
  );
  const { svZonesShort } = useSelector(({ serviceValet }: RootState) => serviceValet);
  const { mobileZonesShort } = useSelector(({ mobileService }: RootState) => mobileService);
  const { scRequestsShort: serviceRequests } = useSelector(
    ({ serviceRequests }: RootState) => serviceRequests
  );

  const onServiceBooksChange = (e: React.SyntheticEvent, value: IPodShort[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, serviceBooks: value }));
  };

  const onAdvisorsChange = (e: React.SyntheticEvent, value: IAdvisorShort[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, advisors: value }));
  };

  const onTransportationsChange = (e: React.SyntheticEvent, value: TTransportationShort[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, transportationOptions: value }));
  };

  const onSvZonesChange = (e: React.SyntheticEvent, value: TGeographicZoneShort[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, serviceValetZones: value }));
  };

  const onMobileZonesChange = (e: React.SyntheticEvent, value: TGeographicZoneShort[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, mobileServiceZones: value }));
  };

  const onWaitListChange = (e: React.SyntheticEvent, value: string | null) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, isWaitlistEnabled: value === 'Yes' }));
  };

  const onServiceRequestsChange = (
    e: React.SyntheticEvent,
    value: IAssignedServiceRequestShort[]
  ) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, serviceRequests: value }));
  };

  return (
    <>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          options={serviceRequests}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          value={form.serviceRequests}
          getOptionLabel={i => i.code}
          onChange={onServiceRequestsChange}
          renderOption={autocompleteOptionsRender(e => e.code)}
          renderInput={autocompleteRender({
            label: 'Op Codes',
            placeholder: 'Op Codes',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          options={shortPodsList}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          value={form.serviceBooks}
          onChange={onServiceBooksChange}
          renderOption={autocompleteOptionsRender(e => e.name)}
          getOptionLabel={i => i.name}
          renderInput={autocompleteRender({
            label: 'Service Books Assignment',
            placeholder: 'Service Books Assignment',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          options={advisorsList}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          value={form.advisors}
          renderOption={autocompleteOptionsRender(i => `${i.firstName} ${i.lastName}`)}
          getOptionLabel={i => `${i.firstName} ${i.lastName}`}
          onChange={onAdvisorsChange}
          renderInput={autocompleteRender({
            label: 'Advisors Selection',
            placeholder: 'Advisors Selection',
            error: formIsChecked && !!form.advisors.length && !!form.mobileServiceZones.length,
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          options={transportationsShort}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          value={form.transportationOptions}
          renderOption={autocompleteOptionsRender(i => i.name)}
          getOptionLabel={i => i.name}
          onChange={onTransportationsChange}
          renderInput={autocompleteRender({
            label: 'Transportation Options',
            placeholder: 'Transportation Options',
            error:
              formIsChecked &&
              !!form.transportationOptions.length &&
              !!form.mobileServiceZones.length,
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          options={svZonesShort}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={autocompleteOptionsRender(i => i.name)}
          getOptionLabel={i => i.name}
          value={form.serviceValetZones}
          onChange={onSvZonesChange}
          renderInput={autocompleteRender({
            label: 'Service Valet Zones',
            placeholder: 'Select Service Valet Zones',
            error:
              formIsChecked && !!form.mobileServiceZones.length && !!form.serviceValetZones.length,
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          options={mobileZonesShort}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={autocompleteOptionsRender(i => i.name)}
          value={form.mobileServiceZones}
          getOptionLabel={i => i.name}
          onChange={onMobileZonesChange}
          renderInput={autocompleteRender({
            label: 'Mobile Service Zones',
            placeholder: 'Select Mobile Service Zones',
            error:
              formIsChecked && !!form.mobileServiceZones.length && !!form.serviceValetZones.length,
          })}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          options={['Yes', 'No']}
          isOptionEqualToValue={(o, v) => o === v}
          getOptionLabel={i => i}
          value={form.isWaitlistEnabled ? 'Yes' : 'No'}
          onChange={onWaitListChange}
          renderInput={autocompleteRender({
            label: 'Waitlist Appointment',
            placeholder: 'Waitlist Appointment',
            error:
              formIsChecked &&
              form.isWaitlistEnabled &&
              (!!form.serviceValetZones.length || !!form.mobileServiceZones.length),
          })}
        />
      </Grid>
    </>
  );
};

export default AutocompletesConsent;
