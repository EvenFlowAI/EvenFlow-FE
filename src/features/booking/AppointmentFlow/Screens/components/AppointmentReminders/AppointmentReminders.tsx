import React, { useEffect, useMemo } from 'react';
import { Checkbox } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { setReminders } from '../../../../../../store/reducers/appointmentFrameReducer/actions';
import { EContactMethodTypes } from '../../../../../../store/reducers/appointment/types';
import { useTranslation } from 'react-i18next';
import { StyledLabel } from './styles';
import { ReactComponent as CheckboxIcon } from '../../../../../../assets/img/checkbox_outlined.svg';
import { ReactComponent as CheckboxEmptyIcon } from '../../../../../../assets/img/checkbox_empty1.svg';
import { Info } from '../../../Create/AppointmentConfirmation/styles';

export const AppointmentReminders: React.FC<{ isEmailRequired: boolean }> = ({
  isEmailRequired,
}) => {
  const { reminders, customer } = useSelector((state: RootState) => state.appointmentFrame);
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const emailReminder = useMemo(() => {
    const reminder = reminders.find(el => el.toString() === EContactMethodTypes.Email.toString());
    return typeof reminder !== 'undefined';
  }, [reminders]);

  const textChecked = useMemo(
    () => scProfile?.isSendReminders && reminders.includes(EContactMethodTypes.Sms),
    [scProfile, reminders]
  );
  const emailChecked = useMemo(
    () => scProfile?.isSendReminders && reminders.includes(EContactMethodTypes.Email),
    [scProfile, reminders]
  );

  useEffect(() => {
    if (!isEmailRequired && emailReminder && !customer?.email) {
      dispatch(
        setReminders(reminders.filter(el => el.toString() !== EContactMethodTypes.Email.toString()))
      );
    }
  }, [isEmailRequired, emailReminder, customer]);

  const handleChange = (t: EContactMethodTypes) => () => {
    if (reminders.includes(t)) {
      dispatch(setReminders(reminders.filter(r => r !== t)));
    } else {
      dispatch(setReminders([...reminders, t]));
    }
  };

  return (
    <div>
      <StyledLabel
        label={t('Text consent')}
        disabled={!scProfile?.isSendReminders}
        control={
          <Checkbox
            icon={<CheckboxEmptyIcon />}
            checkedIcon={<CheckboxIcon />}
            checked={textChecked}
            onChange={handleChange(EContactMethodTypes.Sms)}
            color="primary"
          />
        }
      />
      <Info>
        {t('By checking the box, you agree to receive')} <strong>{t('text messages')}</strong>{' '}
        {t('to confirm, cancel and reschedule your upcoming service appointment from', {
          serviceCenterName: scProfile?.name ?? '',
        })}{' '}
        {t(
          'and your information will not be shared with a 3rd party for any other purpose, and our Privacy Policy & Terms of Service. Message frequency may vary. Message and data rates apply. Reply STOP to unsubscribe. Text HELP for support.'
        )}
      </Info>
      <StyledLabel
        label={t('Email consent')}
        control={
          <Checkbox
            disabled={!scProfile?.isSendReminders || (!isEmailRequired && !customer?.email)}
            checked={emailChecked}
            icon={<CheckboxEmptyIcon />}
            checkedIcon={<CheckboxIcon />}
            onChange={handleChange(EContactMethodTypes.Email)}
            color="primary"
          />
        }
      />
      <Info>
        {t('By checking the box, you agree to receive')} <strong>{t('emails')}</strong>{' '}
        {t('to confirm, cancel and reschedule your upcoming service appointment from', {
          serviceCenterName: scProfile?.name ?? '',
        })}{' '}
        {t(
          'and your information will not be shared with a 3rd party for any other purpose, and our Privacy Policy & Terms of Service.'
        )}
      </Info>
    </div>
  );
};
