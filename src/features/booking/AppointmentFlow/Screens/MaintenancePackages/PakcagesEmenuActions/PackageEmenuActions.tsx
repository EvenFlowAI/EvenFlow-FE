import React from "react";
import { Button } from "@mui/material";
import { Loading } from "../../../../../../components/wrappers/Loading/Loading";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setPackageEMenuType } from "../../../../../../store/reducers/appointmentFrameReducer/actions";
import { RootState } from "../../../../../../store/rootReducer";
import { ButtonsRow } from "./styles";

type TProps = {
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
};

const PackageEMenuActions: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ isLoading, onBack, onNext }) => {
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onSelectFactory = () => {
    if (scProfile?.maintenancePackageOptionTypes.length) {
      dispatch(
        setPackageEMenuType(scProfile?.maintenancePackageOptionTypes[0]),
      );
    }
    onNext();
  };
  const onSelectDealer = () => {
    if (scProfile?.maintenancePackageOptionTypes[1]) {
      dispatch(
        setPackageEMenuType(scProfile?.maintenancePackageOptionTypes[1]),
      );
    }
    onNext();
  };

  return (
    <ButtonsRow>
      {!isLoading ? (
        <>
          <Button
            onClick={onBack}
            color={"primary"}
            variant="outlined"
            style={{ backgroundColor: "#F7F8FB" }}
          >
            {t("Back")}
          </Button>
          <Button
            disabled={isLoading}
            onClick={onSelectFactory}
            color={"primary"}
            variant="outlined"
          >
            {t("Select Factory")}
          </Button>
          <Button
            disabled={isLoading}
            onClick={onSelectDealer}
            color={"primary"}
            variant="contained"
          >
            {t("Select Dealer")}
          </Button>
        </>
      ) : (
        <Loading />
      )}
    </ButtonsRow>
  );
};

export default PackageEMenuActions;
