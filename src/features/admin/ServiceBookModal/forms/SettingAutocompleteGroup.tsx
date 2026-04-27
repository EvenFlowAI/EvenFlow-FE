import React from 'react';
import { Autocomplete, Grid } from '@mui/material';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../utils/autocompleteRenders';
import { getTransportationOptionString } from '../../../../utils/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IEngineType } from '../../../../store/reducers/vehicleDetails/types';
import { ITransportationOptionFull } from '../../../../store/reducers/transportationNeeds/types';
import { TZone } from '../../../../store/reducers/mobileService/types';
import { ServiceBookState } from '../types';
import { hasMobileZones, hasServiceValetZones } from '../helper';

interface SettingAutocompleteGroupProps {
  setFormIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  formIsChecked: boolean;
  loading: boolean;
  state: ServiceBookState;
  setState: React.Dispatch<React.SetStateAction<ServiceBookState>>;
}

const SettingAutocompleteGroup = ({
  setFormIsChecked,
  formIsChecked,
  loading,
  state,
  setState,
}: SettingAutocompleteGroupProps) => {
  const { podsLoading } = useSelector(({ pods }: RootState) => pods);
  const { engineTypes } = useSelector(({ vehicleDetails }: RootState) => vehicleDetails);
  const { options: transportations, isLoading: isTransportationLoading } = useSelector(
    ({ transportation }: RootState) => transportation
  );
  const { zones: serviceValetZones } = useSelector(({ serviceValet }: RootState) => serviceValet);
  const { zones } = useSelector(({ mobileService }: RootState) => mobileService);

  const handleEngineTypesChange = (e: React.SyntheticEvent, val: IEngineType[]) => {
    setFormIsChecked(false);
    setState(prev => ({ ...prev, selectedEngineTypes: val }));
  };

  const handleTransportationsChange = (
    e: React.SyntheticEvent,
    val: ITransportationOptionFull[]
  ) => {
    setFormIsChecked(false);
    setState(prev => ({ ...prev, transportationOptions: val }));
  };

  const handleServiceValetZoneChange = (e: React.SyntheticEvent, val: TZone[]) => {
    setFormIsChecked(false);
    setState(prev => ({ ...prev, selectedServiceValetZones: val }));
  };

  const handleZoneChange = (e: React.SyntheticEvent, val: TZone[]) => {
    setFormIsChecked(false);
    setState(prev => ({ ...prev, mobileZones: val }));
  };

  const isErrorForZones = (): boolean => {
    return formIsChecked && hasMobileZones(state) && hasServiceValetZones(state);
  };

  return (
    <>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          disabled={podsLoading || loading}
          options={engineTypes}
          multiple
          fullWidth
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          isOptionEqualToValue={(o, v) => o.id === v.id}
          onChange={handleEngineTypesChange}
          getOptionLabel={i => i.name}
          renderOption={autocompleteOptionsRender(e => e.name)}
          loading={false}
          value={state.selectedEngineTypes}
          renderInput={autocompleteRender({
            label: 'Engine Types',
            fullWidth: true,
            placeholder: 'Select Engine Types',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          disabled={podsLoading || loading}
          options={transportations}
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          onChange={handleTransportationsChange}
          getOptionLabel={i => getTransportationOptionString(i.type.toString())}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={autocompleteOptionsRender(e => getTransportationOptionString(e.type))}
          loading={isTransportationLoading}
          value={state.transportationOptions}
          renderInput={autocompleteRender({
            label: 'Transportation Options',
            fullWidth: true,
            placeholder: 'Select Transportation Options',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          disabled={podsLoading || loading}
          options={serviceValetZones}
          multiple
          fullWidth
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          isOptionEqualToValue={(o, v) => o.id === v.id}
          onChange={handleServiceValetZoneChange}
          getOptionLabel={i => i.name}
          renderOption={autocompleteOptionsRender(e => e.name)}
          loading={false}
          value={state.selectedServiceValetZones}
          renderInput={autocompleteRender({
            label: 'Service Valet Zones',
            fullWidth: true,
            placeholder: 'Select Service Valet Zones',
            error:
              formIsChecked &&
              !!state.mobileZones.length &&
              !!state.selectedServiceValetZones.length,
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          disabled={podsLoading || loading}
          options={zones}
          multiple
          fullWidth
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          isOptionEqualToValue={(o, v) => o.id === v.id}
          onChange={handleZoneChange}
          getOptionLabel={i => i.name}
          renderOption={autocompleteOptionsRender(e => e.name)}
          loading={false}
          value={state.mobileZones}
          renderInput={autocompleteRender({
            label: 'Mobile Zones',
            fullWidth: true,
            placeholder: 'Select Mobile Zones',
            error: isErrorForZones(),
          })}
        />
      </Grid>
    </>
  );
};

export default SettingAutocompleteGroup;
