import React from "react";
import { useNotificationStyles } from "../../../../hooks/styling/useNotificationStyles";
import { IconButton } from "@mui/material";
import { IAdvisorShort } from "../../../../store/reducers/users/types";
import { ReactComponent as DeleteIcon } from "../../../../assets/img/close.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";

type TProps = {
  item: IAdvisorShort;
  isSaving: boolean;
  deleteEmployee: (id: string) => void;
};

const EmployeeChip: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ item, deleteEmployee, isSaving }) => {
  const { loading } = useSelector((state: RootState) => state.employees);
  const { isLoading } = useSelector((state: RootState) => state.transportation);
  const { classes } = useNotificationStyles();
  return (
    <div className={classes.employeeWrapper} key={item.id}>
      <div>{item.fullName}</div>
      <div>{item.email}</div>
      <IconButton
        onClick={() => deleteEmployee(item.id)}
        disabled={loading || isSaving || isLoading}
        size="large"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default EmployeeChip;
