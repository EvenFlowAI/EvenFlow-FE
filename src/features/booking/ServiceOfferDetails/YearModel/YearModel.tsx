import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { StepWrapper } from '../../../../components/styled/StepWrapper';
import { ActionButtons } from '../../ActionButtons/ActionButtons';
import {
  loadSeriesModels,
  setValueServicePartial,
} from '../../../../store/reducers/appointmentFrameReducer/actions';
import { RootState } from '../../../../store/rootReducer';
import { TModel, TSeries } from '../../../../store/reducers/appointmentFrameReducer/types';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import { useOfferInputStyles } from '../../../../hooks/styling/useOfferInputStyles';
import { ScreenWrapper } from '../../../../components/styled/ScreenWrapper';
import { SelectsTitle } from '../../../../components/styled/SelectsTitle';
import { SelectWrapper } from '../../../../components/styled/SelectWrapper';
import { TActionProps } from '../../../../types/types';
import { useException } from '../../../../hooks/useException/useException';

export const YearModel: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TActionProps>>
> = ({ onNext, onBack }) => {
  const { valueService, selectedVehicle, seriesModels } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const [currentModels, setCurrentModels] = useState<TModel[]>([]);
  const [currentSeries, setCurrentSeries] = useState<TSeries[]>([]);
  const dispatch = useDispatch();
  const { classes } = useOfferInputStyles();
  const yearOptions = useMemo(() => seriesModels.map(item => item.year.toString()), [seriesModels]);
  const isError = useMemo(
    () => Boolean(selectedVehicle && selectedVehicle?.make === 'Other'),
    [selectedVehicle]
  );
  const showError = useException();

  useEffect(() => {
    scProfile && dispatch(loadSeriesModels(scProfile.id));
  }, [dispatch, scProfile]);

  useEffect(() => {
    if (valueService) {
      if (valueService.year) {
        setCurrentSeries(valueService.year.series);
      }
      if (valueService.series) {
        setCurrentModels(valueService.series.models);
      }
    } else {
      if (selectedVehicle && !isError) {
        if (selectedVehicle?.year) {
          const year = seriesModels.find(item => item.year === selectedVehicle?.year);
          if (year) {
            dispatch(setValueServicePartial({ year: year }));
            if (selectedVehicle?.model) {
              const series = year.series?.find(item => item.name === selectedVehicle?.model);
              series && dispatch(setValueServicePartial({ series }));
              if (selectedVehicle?.modelDetails && series) {
                const model = series.models.find(el => el.name === selectedVehicle.modelDetails);
                model && dispatch(setValueServicePartial({ model }));
              }
            }
          }
        }
      }
    }
  }, [valueService, selectedVehicle, seriesModels, isError]);

  useEffect(() => {
    if (isError) {
      showError('Sorry, but only BMW models are eligible for Value Service');
    }
  }, [isError, showError]);

  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  const onYearChange = (e: React.ChangeEvent<{}>, option: string | null) => {
    const year = seriesModels.find(item => item.year.toString() === option);
    dispatch(
      setValueServicePartial({
        year: year,
        series: undefined,
        model: null,
        selectedService: null,
      })
    );
    if (year) {
      setCurrentSeries(year.series);
    }
  };

  const onSeriesChange = (e: React.ChangeEvent<{}>, option: TSeries | null) => {
    const series = option ? option : undefined;
    dispatch(setValueServicePartial({ series, model: null, selectedService: null }));
    setCurrentModels(option?.models ?? []);
  };

  const onModelChange = (e: React.ChangeEvent<{}>, option: TModel | null) => {
    dispatch(setValueServicePartial({ model: option, selectedService: null }));
  };

  return (
    <StepWrapper>
      <ScreenWrapper>
        <SelectsTitle>SELECT YOUR VEHICLE</SelectsTitle>
        <SelectWrapper>
          {seriesModels?.length > 0 ? (
            <Autocomplete
              key={valueService?.year?.year || seriesModels[0].year}
              options={yearOptions}
              onChange={onYearChange}
              fullWidth
              disabled={isError}
              className={classes.input}
              isOptionEqualToValue={(o, v) => o === v}
              disableClearable
              renderInput={autocompleteRender({
                label: 'Year',
                placeholder: 'Select Year',
                required: true,
              })}
              value={valueService?.year?.year.toString() ?? ''}
            />
          ) : (
            <Loading />
          )}
          {valueService?.year && currentSeries?.length ? (
            <Autocomplete
              key={valueService?.series?.name || 'series'}
              options={currentSeries}
              onChange={onSeriesChange}
              disabled={isError}
              fullWidth
              getOptionLabel={option => option.name}
              isOptionEqualToValue={option => option.id === valueService?.series?.id}
              disableClearable
              autoComplete={true}
              className={classes.input}
              renderInput={autocompleteRender({
                label: 'Series',
                placeholder: 'Select Series',
                required: true,
              })}
              value={valueService.series}
            />
          ) : null}
          {valueService?.year && valueService?.series ? (
            <Autocomplete
              key={valueService?.model?.name || 'model'}
              options={currentModels}
              onChange={onModelChange}
              disabled={isError}
              fullWidth
              disableClearable
              getOptionLabel={option => option.name}
              isOptionEqualToValue={option => option.name === valueService?.model?.name}
              autoComplete={true}
              className={classes.input}
              renderInput={autocompleteRender({
                label: 'Model',
                placeholder: 'Select Chip',
                required: true,
              })}
              value={valueService.model || undefined}
            />
          ) : null}
        </SelectWrapper>
        <ActionButtons
          onBack={handleBack}
          onNext={handleNext}
          nextLabel="View Price"
          nextDisabled={
            !valueService?.year || !valueService?.series || !valueService?.model || isError
          }
        />
      </ScreenWrapper>
    </StepWrapper>
  );
};
