import { Dispatch, SetStateAction } from 'react';
import { TCallback } from '../../../types/types';

export type TChangesState = {
  scNotificationsSaved: boolean;
  podNotificationsSaved: boolean;
  recallNotificationsSaved: boolean;
  transportationNotificationsSaved: boolean;
};

export type TNotificatonsProps = {
  setChangesState: Dispatch<SetStateAction<TChangesState>>;
  changesState?: TChangesState;
  onClose: TCallback;
};
