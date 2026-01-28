import React, { useState } from 'react';
import { useStyles } from './styles';
import { defaultFormTekion, defaultFormXTime, TFormTekion, TFormXTime } from './types';
import AvailabilityQueryXTime from './query/AvailabilityQueryXTime';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { SystemType } from '../../../store/reducers/serviceCenters/types';
import AvailabilityQueryTekion from './query/AvailabilityQueryTekion';
import { Button } from '@mui/material';
import { validateTekion, validateXTime } from './query/helper';

const DmsAvailability = () => {
  const { classes } = useStyles();
  const [formXTime, setFormXTime] = useState<TFormXTime>(defaultFormXTime);
  const [formTekion, setFormTekion] = useState<TFormTekion>(defaultFormTekion);
  const [formIsCheckedTekion, setIsCheckedTekion] = useState<boolean>(false);
  const [formIsCheckedXTime, setIsCheckedXTime] = useState<boolean>(false);
  const { selectedSC } = useSCs();

  const handleLoad = () => {
    if (selectedSC?.system === SystemType.Xtime) {
      setIsCheckedXTime(true);

      if (validateXTime(formXTime)) {
        console.log('send to the backend');
      } else {
        console.log('have errors');
      }

      console.log(formXTime);
    } else {
      setIsCheckedTekion(true);

      if (validateTekion(formTekion)) {
        console.log('send to the backend');
      } else {
        console.log('have errors');
      }

      console.log(formTekion);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.queryWrapper}>
        <div className={classes.query}>
          <p className={classes.headerText}>Availability query</p>
          {selectedSC?.system != SystemType.Xtime ? (
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
          <Button variant="contained" onClick={handleLoad}>
            Get Availability
          </Button>
        </div>
        <div className={classes.lineWrapper}>
          <hr className={classes.line} />
        </div>
      </div>
      <div className={classes.results}></div>
    </div>
  );
};

export default DmsAvailability;
