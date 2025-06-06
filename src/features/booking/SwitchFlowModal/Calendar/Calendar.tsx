import React, { Dispatch, SetStateAction } from 'react';
import dayjs from 'dayjs';
import { TCallback, TParsableDate } from '../../../../types/types';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { CustomActionBar } from './CustomActionBar/CustomActionBar';

type TProps = {
  time: TParsableDate;
  setTime: Dispatch<SetStateAction<TParsableDate>>;
  isCalendarOpen: boolean;
  setCalendarOpen: Dispatch<SetStateAction<boolean>>;
  onNext: TCallback;
};

const Calendar: React.FC<TProps> = ({ time, setTime, isCalendarOpen, setCalendarOpen, onNext }) => {
  const onTimeChange = (value: TParsableDate) => {
    setTime(value);
  };

  return (
    <MobileDatePicker
      value={time}
      onChange={onTimeChange}
      disablePast
      onAccept={() => {}}
      open={isCalendarOpen}
      onClose={() => setCalendarOpen(false)}
      format="MMMM, DD"
      dayOfWeekFormatter={(day, date) => dayjs(date as TParsableDate).format('ddd')}
      slots={{
        actionBar: props => <CustomActionBar {...props} onNext={onNext} />,
      }}
      slotProps={{
        textField: {
          variant: 'standard',
          InputProps: {
            style: { display: 'none' },
          },
        },
        toolbar: {
          toolbarFormat: 'ddd, MMM DD',
        },
        layout: {
          sx: {
            [`.${pickersLayoutClasses.toolbar}`]: {
              backgroundColor: 'black',
              color: 'white',
            },
            [`.${pickersLayoutClasses.toolbar} > span`]: {
              color: '#FFFFFF8A',
              display: 'none',
            },
          },
        },
      }}
    />
  );
};

export default Calendar;
