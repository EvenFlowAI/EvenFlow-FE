import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import {
  ECustomerPresence,
  ECustomerSegment,
  EDayOfWeek,
} from '../../../../../store/reducers/offers/types';
import { TOfferForm } from '../../types';
import { TParsableDate } from '../../../../../types/types';
import { TEnumMap } from '../../../../../store/reducers/types';
import { IAssignedServiceRequestShort } from '../../../../../store/reducers/serviceRequests/types';
import { ICategory } from '../../../../../store/reducers/categories/types';

export type TOfferFormProps = {
  form: TOfferForm;
  onSelect: (e: SelectChangeEvent<ECustomerPresence>) => void;
  onValueChange: (name: keyof TOfferForm, value: unknown) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRadio: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  onChangeDateTime: (name: keyof TOfferForm) => (date: TParsableDate) => void;
  onDOWSelect: (e: React.SyntheticEvent, value: TEnumMap<EDayOfWeek>[]) => void;
  onSegmentSelect: (e: React.SyntheticEvent, value: TEnumMap<ECustomerSegment>[]) => void;
  onSRChange: (e: React.SyntheticEvent, value: IAssignedServiceRequestShort[]) => void;
  onCategoryChange: (e: React.SyntheticEvent, value: ICategory[]) => void;
  formIsChecked: boolean;
};
