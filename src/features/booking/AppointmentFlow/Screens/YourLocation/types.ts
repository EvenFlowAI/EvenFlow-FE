import {
  TActionProps,
  TArgCallback,
  TCallback,
  TView,
} from "../../../../../types/types";
import { Dispatch, SetStateAction } from "react";

export type TParsedAddress = {
  city: string;
  state: string;
  address: string;
  postalCode?: string;
};

export type TYourLocationProps = TActionProps & {
  setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
  onGoToFirstScreen: TArgCallback<TView>;
  isManagingFlow?: boolean;
  restoreAddress?: TCallback;
};
