import React from 'react';
import { Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateVehicle } from '../../../../../../store/reducers/appointmentFrameReducer/actions';
import { RootState } from '../../../../../../store/rootReducer';
import { getYearOptions } from '../../../../../../utils/utils';
import { useTranslation } from 'react-i18next';
import { useStyles } from '../styles';
import { TFormProps, TKey } from '../types';
import { MenuProps } from '../constants';

export const FormWithSelectors: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TFormProps>>
> = ({
  orderMapStyles,
  isExistingVehicle,
  requiredFields,
  loadedOptions,
  setLoadedOptions,
  selectedEngine,
  setSelectedEngine,
  errors,
  setErrors,
}) => {
  const { selectedVehicle, makes, appointmentByKey } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { mileage, engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
  const { currentConfig } = useSelector((state: RootState) => state.bookingFlowConfig);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const modelIsInTheList = loadedOptions.model?.find(
    el => el.toLowerCase() === selectedVehicle?.model?.toLowerCase()
  );
  const makeIsInTheList = loadedOptions.make?.find(
    el => el.toLowerCase() === selectedVehicle?.make?.toLowerCase()
  );
  const modelOptions =
    !modelIsInTheList && !isExistingVehicle && selectedVehicle?.model
      ? loadedOptions.model
          ?.map(item => (
            <MenuItem value={item.toLowerCase()} key={item}>
              {item}
            </MenuItem>
          ))
          .concat(
            <MenuItem
              disabled
              value={selectedVehicle?.model?.toLowerCase() ?? ''}
              key={selectedVehicle?.model}
            >
              {selectedVehicle?.model}
            </MenuItem>
          )
      : loadedOptions.model?.map(item => (
          <MenuItem value={item.toLowerCase()} key={item}>
            {item}
          </MenuItem>
        ));

  const handleSelectChange = (name: TKey, skip?: boolean) => (e: SelectChangeEvent<unknown>) => {
    if (e.target.value && !skip) {
      if (['year', 'model', 'make', 'mileage'].includes(name)) {
        dispatch(updateVehicle({ [name]: e.target.value }));
      }
      setErrors(e => e.filter(err => err !== name));
      if (name === 'make') {
        if (e.target.value === t('Other')) {
          setLoadedOptions(prevOptions => ({ ...prevOptions, model: [t('Other')] }));
          if (selectedVehicle?.model) dispatch(updateVehicle({ model: '' }));
        } else {
          const currentMake = makes.find(item => item.name === e.target.value);
          if (currentMake)
            setLoadedOptions(prevOptions => ({ ...prevOptions, model: currentMake.models }));
          if (e.target.value !== selectedVehicle?.make) dispatch(updateVehicle({ model: '' }));
        }
      }
    }
  };

  const handleEngineTypeChange = (e: SelectChangeEvent<{}>) => {
    const selected = engineTypes.find(el => el.id === e.target?.value);
    if (selected) {
      setSelectedEngine(selected);
      dispatch(updateVehicle({ engineTypeId: selected?.id ?? null }));
      setErrors(e => e.filter(err => err !== 'engineTypeId'));
    }
  };

  return (
    <>
      <Grid item xs={12} sm={6} key="year" style={orderMapStyles.year}>
        <div className={classes.label}>
          {t('Year')}
          {requiredFields.includes('year') ? '*' : ''}
        </div>
        <Select
          value={selectedVehicle?.year ? selectedVehicle.year.toString() : ''}
          className={classes.select}
          variant="standard"
          disableUnderline
          fullWidth
          displayEmpty
          MenuProps={MenuProps}
          style={{ color: selectedVehicle?.year ? 'inherit' : '#858585' }}
          error={errors.includes('year')}
          required={requiredFields.includes('year')}
          disabled={isExistingVehicle}
          onChange={handleSelectChange('year', false)}
        >
          <MenuItem disabled value="">
            {errors.includes('year')
              ? `${t('Year')} ${t('required')}`
              : `${t('Select')} ${t('Year')}`}
          </MenuItem>
          {getYearOptions().map(item => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item xs={12} sm={6} key="mileage" style={orderMapStyles.mileage}>
        <div className={classes.label}>
          {t('Estimated mileage')}
          {requiredFields.includes('mileage') ? '*' : ''}
        </div>
        <Select
          value={selectedVehicle?.mileage ? selectedVehicle.mileage.toString() : ''}
          className={classes.select}
          variant="standard"
          disableUnderline
          fullWidth
          displayEmpty
          MenuProps={MenuProps}
          style={{ color: selectedVehicle?.mileage ? 'inherit' : '#858585' }}
          error={errors.includes('mileage')}
          required={requiredFields.includes('mileage')}
          onChange={handleSelectChange('mileage', false)}
        >
          <MenuItem disabled value="">
            {errors.includes('mileage')
              ? `${t('Estimated mileage')} ${t('required')}`
              : `${t('Select')} ${t('Estimated mileage')}`}
          </MenuItem>
          {mileage
            .map(el => el.value)
            .map(item => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
        </Select>
      </Grid>

      <Grid item xs={12} sm={6} key="make" style={orderMapStyles.make}>
        <div className={classes.label}>
          {t('Make')}
          {requiredFields.includes('make') ? '*' : ''}
        </div>
        <Select
          value={selectedVehicle?.make ? selectedVehicle.make?.toLowerCase() : ''}
          className={classes.select}
          variant="standard"
          disableUnderline
          fullWidth
          displayEmpty
          MenuProps={MenuProps}
          style={{ color: selectedVehicle?.make ? 'inherit' : '#858585' }}
          error={errors.includes('make')}
          required={requiredFields.includes('make')}
          placeholder={
            errors.includes('make')
              ? `${t('Make')} ${t('required')}`
              : `${t('Select')} ${t('Make')}`
          }
          disabled={Boolean(selectedVehicle?.make)}
          onChange={handleSelectChange('make', false)}
        >
          <MenuItem disabled value="">
            {errors.includes('make')
              ? `${t('Make')} ${t('required')}`
              : `${t('Select')} ${t('Make')}`}
          </MenuItem>
          {makeIsInTheList || !isExistingVehicle ? (
            loadedOptions.make?.map(item => (
              <MenuItem value={item.toLowerCase()} key={item}>
                {item}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value={selectedVehicle?.make?.toLowerCase() ?? ''}>
              {selectedVehicle?.make}
            </MenuItem>
          )}
        </Select>
      </Grid>

      {currentConfig?.engineType ? (
        <Grid item xs={12} sm={6} key="Engine Type" style={orderMapStyles.engineType}>
          <div className={classes.label}>{scProfile?.engineTypeFieldName ?? t('Engine Type')}*</div>
          <Select
            value={selectedEngine?.id ?? ''}
            className={classes.select}
            variant="standard"
            disableUnderline
            fullWidth
            error={errors.includes('engineTypeId')}
            displayEmpty
            MenuProps={MenuProps}
            style={{ color: selectedVehicle?.engineTypeId ? 'inherit' : '#858585' }}
            disabled={Boolean(selectedEngine) && Boolean(appointmentByKey?.vehicle?.engineTypeId)}
            onChange={handleEngineTypeChange}
          >
            <MenuItem disabled value="">
              {errors.includes('engineTypeId')
                ? `${scProfile?.engineTypeFieldName ?? t('Engine Type')} ${t('required')}`
                : `${t('Select')} ${scProfile?.engineTypeFieldName ?? t('Engine Type')}`}
            </MenuItem>
            {engineTypes.map(item => (
              <MenuItem value={item.id} key={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      ) : null}

      <Grid item xs={12} sm={6} key="model" order={orderMapStyles.model.order}>
        <div className={classes.label}>
          {t('Model')}
          {requiredFields.includes('model') ? '*' : ''}
        </div>
        <Select
          value={selectedVehicle?.model ? selectedVehicle.model.toLowerCase() : ''}
          className={classes.select}
          variant="standard"
          disableUnderline
          fullWidth
          error={errors.includes('model')}
          displayEmpty
          MenuProps={MenuProps}
          style={{ color: selectedVehicle?.model ? 'inherit' : '#858585' }}
          disabled={Boolean(selectedVehicle?.model)}
          onChange={handleSelectChange('model', false)}
        >
          <MenuItem disabled value="">
            {errors.includes('model')
              ? `${t('Model')} ${t('required')}`
              : `${t('Select')} ${t('Model')}`}
          </MenuItem>
          {modelIsInTheList || !isExistingVehicle ? (
            modelOptions
          ) : (
            <MenuItem disabled value={selectedVehicle?.model?.toLowerCase() ?? ''}>
              {selectedVehicle?.model}
            </MenuItem>
          )}
        </Select>
      </Grid>
    </>
  );
};
