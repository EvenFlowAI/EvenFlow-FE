import React, { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro';
import { Popover, IconButton } from '@mui/material';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { ReactComponent as Calendar } from '../../../assets/img/calendar.svg';
import dayjs from 'dayjs';

interface CustomDateRangePickerProps {
  value: [dayjs.Dayjs | null, dayjs.Dayjs | null];
  setValue: (newValue: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => void;
  format?: string;
}

const CustomDateRangePicker = ({ value, setValue, format }: CustomDateRangePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget as HTMLButtonElement);
  const handleClose = () => setAnchorEl(null);
  const [errorText, setErrorText] = useState('');

  const validateRange = (newValue: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    if (newValue[0] && newValue[1]) {
      const diff = dayjs(newValue[1]).diff(dayjs(newValue[0]), 'day');
      if (diff > 6 || diff < 0) {
        setErrorText('Please select a date range between 1 and 7 days');
        return;
      }
    }
    setErrorText('');
    setValue(newValue);
  };

  return (
    <div style={{ width: '329px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <p
        style={{
          fontSize: '12px',
          color: 'rgba(0, 0, 0, 0.87)',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: 600,
        }}
      >
        Date Range *
      </p>
      <div>
        <SingleInputDateRangeField
          value={value}
          onChange={newValue => {
            if (newValue[0] && newValue[1]) {
              const diff = dayjs(newValue[1]).diff(dayjs(newValue[0]), 'day');
              if (diff > 6 || diff < 0) {
                setErrorText('Please select a date range between 1 and 7 days');
                return;
              }
            }
            setErrorText('');
            setValue(newValue);
          }}
          format={format}
          slotProps={{
            textField: {
              variant: 'outlined',
              error: Boolean(errorText),
              helperText: errorText,
              sx: {
                width: 328,
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-root': {
                  height: 44,
                  borderRadius: 0,
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                },
                '& .MuiInputBase-input': {
                  padding: '6px 8px',
                },
              },
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleOpen} size="small" sx={{ mr: -1 }}>
                      <Calendar />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
        />
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <DateRangeCalendar value={value} onChange={validateRange} />
        </Popover>
      </div>
    </div>
  );
};

export default CustomDateRangePicker;
