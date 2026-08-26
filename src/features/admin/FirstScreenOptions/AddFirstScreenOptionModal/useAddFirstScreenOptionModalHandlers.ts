import React, { SyntheticEvent, useCallback } from 'react';
import { ITransportationOptionFull } from '../../../../store/reducers/transportationNeeds/types';
import { TOption } from '../../../../types/types';
import {
  shouldApplyPickupDeliveryDefault,
  shouldClearTransportationOnServiceTypeChange,
} from './helpers';
import { IFirstScreenOption } from '../../../../store/reducers/serviceTypes/types';

type TProps = {
  setFormIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setFirstScreenOptionName: React.Dispatch<React.SetStateAction<string>>;
  setExternalLink: React.Dispatch<React.SetStateAction<string>>;
  setOrderIndex: React.Dispatch<React.SetStateAction<string>>;
  setDefaultTransportation: React.Dispatch<React.SetStateAction<ITransportationOptionFull | null>>;
  setSelectedServiceType: React.Dispatch<React.SetStateAction<TOption | null>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  setTaglineText: React.Dispatch<React.SetStateAction<string>>;
  setTaglineColor: React.Dispatch<React.SetStateAction<string>>;
  defaultTransportation: ITransportationOptionFull | null;
  editingItem: IFirstScreenOption | null;
  pickUpDeliveryOption: ITransportationOptionFull | null;
  showError: (message: string) => void;
};

export const useAddFirstScreenOptionModalHandlers = ({
  setFormIsChecked,
  setFirstScreenOptionName,
  setExternalLink,
  setOrderIndex,
  setDefaultTransportation,
  setSelectedServiceType,
  setDescription,
  setNote,
  setTaglineText,
  setTaglineColor,
  defaultTransportation,
  editingItem,
  pickUpDeliveryOption,
  showError,
}: TProps) => {
  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDescription(e.target.value);
  const onNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value);

  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormIsChecked(false);
      setFirstScreenOptionName(e.target.value);
    },
    [setFirstScreenOptionName, setFormIsChecked]
  );

  const onLinkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormIsChecked(false);
      setExternalLink(e.target.value);
    },
    [setExternalLink, setFormIsChecked]
  );

  const onOrderIndexChange = useCallback(
    (_e: SyntheticEvent, value: string) => {
      setFormIsChecked(false);
      setOrderIndex(value);
    },
    [setFormIsChecked, setOrderIndex]
  );

  const onTransportationChange = useCallback(
    (_e: SyntheticEvent, value: ITransportationOptionFull | null) => {
      setFormIsChecked(false);
      setDefaultTransportation(value);
    },
    [setDefaultTransportation, setFormIsChecked]
  );

  const onServiceTypeChange = useCallback(
    (_e: SyntheticEvent, value: TOption | null) => {
      setFormIsChecked(false);
      setSelectedServiceType(value);

      if (shouldClearTransportationOnServiceTypeChange(value, defaultTransportation)) {
        setDefaultTransportation(null);
      }
      if (shouldApplyPickupDeliveryDefault(value, defaultTransportation, editingItem)) {
        setDefaultTransportation(pickUpDeliveryOption);
      }
    },
    [
      defaultTransportation,
      editingItem,
      pickUpDeliveryOption,
      setDefaultTransportation,
      setFormIsChecked,
      setSelectedServiceType,
    ]
  );

  const onTaglineTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    if (e.target.value.length > 30) {
      showError('Tagline Text must not include more than 30 symbols');
      return;
    }
    setTaglineText(e.target.value);
  };

  const onTaglineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    if (!e.target.value.match(/^[a-zA-Z0-9]*$/)) {
      showError('Tagline Font Color Hex must consist letters and digits only');
      return;
    }
    setTaglineColor(e.target.value.trim());
  };

  return {
    onNameChange,
    onLinkChange,
    onOrderIndexChange,
    onTransportationChange,
    onServiceTypeChange,
    onTaglineTextChange,
    onTaglineColorChange,
    onDescriptionChange,
    onNoteChange,
  };
};
