import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store/rootReducer";
import { TAssignedRequest } from "../../../../../../store/reducers/packages/types";
import { MaintenanceOptions } from "../../../constants";
import { useStyles } from "./styles";

type TAssignedOpsCodesProps = {
  codes: TAssignedRequest[];
};

const AssignedOpsCodes: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAssignedOpsCodesProps>>
> = ({ codes }) => {
  const { currentPackage } = useSelector((state: RootState) => state.packages);
  const { classes } = useStyles();

  const getOptionName = (option: string) => {
    const optionType = Number(option);
    const optionInPackage = currentPackage?.options.find(
      (opt) => opt.type === optionType,
    );
    return optionInPackage
      ? optionInPackage.name
      : Object.values(MaintenanceOptions)[optionType];
  };

  return (
    <>
      {Object.keys(MaintenanceOptions).map((option) => {
        const item = codes.find((item) => +item.type === +option);
        return item ? (
          <div className={classes.wrapper} key={`${item.code} + ${item.type}`}>
            Option {getOptionName(option)} - {item.code}
          </div>
        ) : null;
      })}
    </>
  );
};

export default AssignedOpsCodes;
