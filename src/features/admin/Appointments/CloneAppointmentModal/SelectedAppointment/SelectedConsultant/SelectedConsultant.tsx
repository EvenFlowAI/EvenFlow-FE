import React, { useEffect, useState } from 'react';
import { MenuItem, Select, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { IServiceConsultant } from '../../../../../../api/types';
import { useSelectedAppointmentStyles } from '../../../../../../hooks/styling/useSelectedAppointmentStyles';

const SelectedConsultant = () => {
  const { consultants } = useSelector((state: RootState) => state.appointmentFrame);
  const { currentAppointment } = useSelector((state: RootState) => state.appointments);
  const [advisor, setAdvisor] = useState<IServiceConsultant | null>(null);

  const { t } = useTranslation();
  const { classes } = useSelectedAppointmentStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (currentAppointment?.advisorId) {
      setAdvisor(() => consultants?.find(el => el.id === currentAppointment?.advisorId) ?? null);
    }
  }, [consultants, currentAppointment]);

  return currentAppointment?.advisorId && consultants?.length ? (
    <div className={classes.selectWrapper}>
      <div className={classes.selectWrapper}>
        {t('Advisor')}: {isSm ? <br /> : null}
        <Select
          value={advisor?.id ?? 'Any'}
          className={classes.select}
          variant="standard"
          disableUnderline
          disabled
          onChange={() => {}}
        >
          {consultants
            .map(consultant => (
              <MenuItem value={consultant.id} key={consultant.name}>
                {consultant.name}
              </MenuItem>
            ))
            .concat([
              <MenuItem value="Any" key="any">
                {t('Any Available')}
              </MenuItem>,
            ])}
        </Select>
      </div>
    </div>
  ) : null;
};

export default SelectedConsultant;
