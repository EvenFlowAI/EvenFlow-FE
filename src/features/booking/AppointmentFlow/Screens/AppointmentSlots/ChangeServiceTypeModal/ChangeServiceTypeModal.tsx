import React, { Dispatch, SetStateAction } from "react";
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from "../../../../../../components/modals/BaseModal/BaseModal";
import { DialogProps } from "../../../../../../components/modals/BaseModal/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store/rootReducer";
import { BfButtonsWrapper } from "../../../../../../components/styled/BfButtonsWrapper";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import ServiceOption from "../AppointmentFilters/ServiceOption/ServiceOption";
import { useStyles } from "./styles";
import { TCallback } from "../../../../../../types/types";
import { IFirstScreenOption } from "../../../../../../store/reducers/serviceTypes/types";

type TProps = DialogProps & {
  options: React.JSX.Element[];
  onChangeServiceOption: TCallback;
  setSelectedOption: Dispatch<SetStateAction<IFirstScreenOption | null>>;
  onSwitchFlowOpen: TCallback;
};

const ChangeServiceTypeModal: React.FC<TProps> = ({
  setSelectedOption,
  onSwitchFlowOpen,
  open,
  onClose,
  options,
  onChangeServiceOption,
}) => {
  const { serviceTypeOption } = useSelector(
    (state: RootState) => state.appointmentFrame,
  );
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <BaseModal open={open} onClose={onClose} width={550}>
      <DialogTitle onClose={onClose}></DialogTitle>
      <DialogContent>
        <div className={classes.textWrapper}>
          We're sorry. {serviceTypeOption?.name} is not available based on your
          selections. Please change your Service Option selection.
        </div>
        <div className={classes.selectWrapper}>
          <div className={classes.label}>Service Option</div>
          <ServiceOption
            hideLabel
            options={options}
            isVisible
            onChangeServiceOption={onChangeServiceOption}
            setSelectedOption={setSelectedOption}
            onSwitchFlowOpen={onSwitchFlowOpen}
          />
        </div>
      </DialogContent>
      <BfButtonsWrapper>
        <Button variant="contained" onClick={onClose}>
          {t("Close")}
        </Button>
      </BfButtonsWrapper>
    </BaseModal>
  );
};

export default ChangeServiceTypeModal;
