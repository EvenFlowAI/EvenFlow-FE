import React, { useEffect, useState } from 'react';
import { useStyles } from './styles';
import { defaultFormTekion, defaultFormXTime, TFormTekion, TFormXTime } from './types';
import AvailabilityQueryXTime from './query/AvailabilityQueryXTime';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { SystemType } from '../../../store/reducers/serviceCenters/types';
import AvailabilityQueryTekion from './query/AvailabilityQueryTekion';
import { Button } from '@mui/material';
import { validateTekion, validateXTime } from './query/helper';
import {
  getAppointmentAvailabilityTekion,
  getAppointmentAvailabilityXTime,
} from '../../../store/reducers/appointment/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useException } from '../../../hooks/useException/useException';
import { AvailabilityResults } from './results/AvailabilityResults';
import { getAvailability } from '../../../store/reducers/demandManagement/actions';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { RootState } from '../../../store/rootReducer';

const DmsAvailability = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { availability } = useSelector(({ demandManagement }: RootState) => demandManagement);
  const [formXTime, setFormXTime] = useState<TFormXTime>(defaultFormXTime);
  const [formTekion, setFormTekion] = useState<TFormTekion>(defaultFormTekion);
  const [formIsCheckedTekion, setIsCheckedTekion] = useState<boolean>(false);
  const [formIsCheckedXTime, setIsCheckedXTime] = useState<boolean>(false);
  const { selectedSC } = useSCs();
  const showError = useException();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      dispatch(getAvailability([]));
    };
  }, []);

  if (!selectedSC) throw new Error('No service center selected');

  const handleError = (e: string) => {
    showError(e);
    setLoading(false);
  };

  const handleSuccess = (message?: string) => {
    setLoading(false);
    if (message) showError(message);
  };

  const handleLoad = () => {
    setLoading(true);
    if (selectedSC?.system === SystemType.Xtime) {
      setIsCheckedXTime(true);

      if (validateXTime(formXTime)) {
        setLoading(true);
        dispatch(
          getAppointmentAvailabilityXTime(selectedSC?.id, formXTime, handleError, handleSuccess)
        );
      }
    } else {
      setIsCheckedTekion(true);

      if (validateTekion(formTekion)) {
        setLoading(true);
        dispatch(
          getAppointmentAvailabilityTekion(selectedSC?.id, formTekion, handleError, handleSuccess)
        );
      }
    }
    dispatch(getAvailability([]));
  };

  const isDisabledButton = () => {
    if (selectedSC?.system === SystemType.Xtime) {
      return !validateXTime(formXTime);
    } else {
      return !validateTekion(formTekion);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.queryWrapper}>
        <div className={classes.query}>
          <p className={classes.headerText}>Availability query</p>
          {selectedSC?.system === SystemType.Xtime ? (
            <AvailabilityQueryXTime
              form={formXTime}
              setForm={setFormXTime}
              formIsCheckedXTime={formIsCheckedXTime}
              setIsCheckedXTime={setIsCheckedXTime}
            />
          ) : (
            <AvailabilityQueryTekion
              form={formTekion}
              setForm={setFormTekion}
              formIsCheckedTekion={formIsCheckedTekion}
              setIsCheckedTekion={setIsCheckedTekion}
            />
          )}
          <Button disabled={isDisabledButton()} variant="contained" onClick={handleLoad}>
            Get Availability
          </Button>
        </div>
        <div className={classes.lineWrapper}>
          <hr className={classes.line} />
        </div>
      </div>
      <div className={classes.results}>
        <p className={classes.headerText}>Appointment availability results</p>
        {!loading && availability.length > 0 && (
          <AvailabilityResults
            formTekion={formTekion}
            formXTime={formXTime}
            setLoading={setLoading}
          />
        )}
        {loading && (
          <div className={classes.loadingWrapper}>
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default DmsAvailability;
