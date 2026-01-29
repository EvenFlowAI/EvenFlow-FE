import React from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { Button } from '@mui/material';
import { useStyles } from '../styles';
import { SystemType } from '../../../../store/reducers/serviceCenters/types';
import {
  getAppointmentAvailabilityCSVTekion,
  getAppointmentAvailabilityCSVXTime,
} from '../../../../store/reducers/appointment/actions';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../hooks/useException/useException';
import { ReactComponent as DownloadAvailability } from '../../../../assets/img/downloadAvailability.svg';
import { TFormTekion, TFormXTime } from '../types';
import { useMessage } from '../../../../hooks/useMessage/useMessage';

interface AvailabilityResultsProps {
  formTekion: TFormTekion;
  formXTime: TFormXTime;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AvailabilityResults = ({
  formTekion,
  formXTime,
  setLoading,
}: AvailabilityResultsProps) => {
  const { availability } = useSelector(({ demandManagement }: RootState) => demandManagement);
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const showMessage = useMessage();
  const showError = useException();

  if (!selectedSC) throw new Error('No service center selected');

  const handleError = (e: string) => {
    showError(e);
    setLoading(false);
  };

  const handleSuccess = () => {
    showMessage('Successfully downloaded CSV file');
  };

  const allTimeSlots = Array.from(
    new Set(availability.flatMap(d => d.openAppointmentTime ?? []))
  ).sort((a, b) => {
    const [ah, am] = a.split(':').map(Number);
    const [bh, bm] = b.split(':').map(Number);
    return ah === bh ? am - bm : ah - bh;
  });

  if (availability.length === 0) return null;

  const handleLoadCSV = () => {
    if (availability.length) {
      if (selectedSC?.system === SystemType.Xtime) {
        dispatch(
          getAppointmentAvailabilityCSVXTime(selectedSC?.id, formXTime, handleError, handleSuccess)
        );
      } else {
        dispatch(
          getAppointmentAvailabilityCSVTekion(
            selectedSC?.id,
            formTekion,
            handleError,
            handleSuccess
          )
        );
      }
    }
  };

  return (
    <div
      style={{
        overflowX: 'auto',
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end',
        gap: '16px',
      }}
    >
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #ccc',
                color: 'rgba(133, 133, 133, 1)',
                minWidth: '94px',
                textAlign: 'left',
                padding: '0 16px',
              }}
            >
              Time
            </th>
            {availability.map(({ openAppointmentDate }) => (
              <th
                key={openAppointmentDate.toString()}
                style={{ border: '1px solid #ccc', color: 'rgba(133, 133, 133, 1)' }}
              >
                <span style={{ textTransform: 'uppercase', display: 'block' }}>
                  {dayjs(openAppointmentDate).format('ddd')}
                </span>
                <span>{dayjs(openAppointmentDate).format('MM/DD')}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allTimeSlots.map((time, idx) => (
            <tr
              key={time}
              style={{
                background: idx % 2 === 0 ? 'rgba(255, 255, 255, 1)' : 'rgba(242, 244, 251, 1)',
              }}
            >
              <td
                style={{
                  border: '1px solid #ccc',
                  textAlign: 'left',
                  padding: '0 16px',
                }}
              >
                {dayjs(time, 'HH:mm').format('HH:mm')}
              </td>
              {availability.map(slot => {
                const isAvailable = slot?.openAppointmentTime.includes(time);
                return (
                  <td
                    key={`${slot.openAppointmentDate}-${time}`}
                    style={{
                      padding: '8px',
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      color: isAvailable ? '#007bff' : '#999',
                      fontWeight: isAvailable ? 'bold' : 'normal',
                    }}
                  >
                    {isAvailable ? (
                      <div
                        style={{
                          color: 'white',
                          backgroundColor: 'rgba(120, 152, 255, 1)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '14px',
                        }}
                      >
                        Available
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="outlined" onClick={handleLoadCSV}>
        <div className={classes.downloadCSVWrapper}>
          <span>Download CSV</span>
          <span className={classes.downloadCSVWrapper}>
            <DownloadAvailability />
          </span>
        </div>
      </Button>
    </div>
  );
};
