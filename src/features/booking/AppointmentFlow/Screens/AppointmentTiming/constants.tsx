import { ReactComponent as SelectDateIcon } from '../../../../../assets/img/selectDateIcon.svg';
import { ReactComponent as FirstAvailableIcon } from '../../../../../assets/img/firstAvailableIcon.svg';
import { ReactComponent as OffersIcon } from '../../../../../assets/img/offersIcon.svg';
import { EAppointmentTimingType } from '../../../../../store/reducers/appointment/types';
import React from 'react';
import { TCard } from './types';

export const timingTypes = ['Special Offers', 'Preferred Date', 'First Available Date'];

export const cardsConfig: TCard[] = [
  {
    description: 'See appointments with special offer and shorter wait times',
    icon: <OffersIcon />,
    name: EAppointmentTimingType.SpecialOffers,
  },
  {
    description: 'Choose a preferred date',
    icon: <SelectDateIcon />,
    name: EAppointmentTimingType.PreferredDate,
  },
  {
    description: 'Choose first available date',
    icon: <FirstAvailableIcon />,
    name: EAppointmentTimingType.FirstAvailable,
  },
];
