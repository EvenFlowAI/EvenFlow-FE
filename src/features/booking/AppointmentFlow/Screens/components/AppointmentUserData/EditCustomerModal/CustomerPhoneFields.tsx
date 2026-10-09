import React from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  CommunicationHint,
  PhoneHeader,
  PhoneInput,
  PhoneLabel,
  PhoneRow,
  PhoneTable,
} from './styles';
import { phoneTypes } from './helpers';
import { TPhoneType, TPhoneValues } from './types';

type TProps = {
  hasError: boolean;
  phones: TPhoneValues;
  selectedPhoneType: TPhoneType;
  onPhoneChange: (type: TPhoneType) => React.ChangeEventHandler<HTMLInputElement>;
  onPhoneTypeChange: (type: TPhoneType) => void;
};

export const CustomerPhoneFields: React.FC<TProps> = ({
  hasError,
  phones,
  selectedPhoneType,
  onPhoneChange,
  onPhoneTypeChange,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <PhoneHeader>
        <span>{t('Phone Numbers on File')}</span>
        <span>{t('Appointment Communication')}</span>
      </PhoneHeader>
      <PhoneTable hasError={hasError}>
        {phoneTypes.map(({ type, label, placeholder }) => (
          <PhoneRow key={type} selected={selectedPhoneType === type}>
            <PhoneLabel>{t(label)}</PhoneLabel>
            <PhoneInput
              value={phones[type]}
              onChange={onPhoneChange(type)}
              placeholder={t(placeholder)}
            />
            <FormControlLabel
              value={type}
              control={
                <Radio
                  size="small"
                  checked={selectedPhoneType === type}
                  onChange={() => onPhoneTypeChange(type)}
                  disabled={!phones[type].trim()}
                  inputProps={{ 'aria-label': `${t(label)} ${t('Appointment Communication')}` }}
                />
              }
              label=""
            />
          </PhoneRow>
        ))}
      </PhoneTable>
      <CommunicationHint>
        <span>ⓘ</span> {t('This number will be used for appointment communication')}
      </CommunicationHint>
    </>
  );
};
