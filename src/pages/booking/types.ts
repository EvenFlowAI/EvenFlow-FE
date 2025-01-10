import { TArgCallback, TCallback, TScreen, TView } from "../../types/types";
import { EServiceCategoryPage, ILoadedVehicle } from "../../api/types";
import { Dispatch, SetStateAction } from "react";

export type TFlowProps = {
  onUpdateAppointment: (car: ILoadedVehicle) => Promise<void>;
  onSelectAppointment: (car: ILoadedVehicle) => Promise<void>;
  handleSetScreen: TArgCallback<TScreen>;
  handleLogin: TCallback;
  onGoToFirstScreen: TArgCallback<TView>;
  loadingCar: boolean;
  currentScreen: TScreen;
  setCurrentScreen: Dispatch<SetStateAction<TScreen>>;
  serviceCategoryPage: EServiceCategoryPage;
  setServiceCategoryPage: Dispatch<SetStateAction<EServiceCategoryPage>>;
  needToShowServiceTypes: boolean;
  setNeedToShowServiceTypes: Dispatch<SetStateAction<boolean>>;
};
