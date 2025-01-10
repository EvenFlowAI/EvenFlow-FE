import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { NewLostCustomerModal } from "./NewLostCustomerModal/NewLostCustomerModal";
import { useDispatch, useSelector } from "react-redux";
import { loadNewLostCustomers } from "../../../store/reducers/valueSettings/actions";
import { RootState } from "../../../store/rootReducer";
import { NewLostEnum } from "../../../store/reducers/valueSettings/types";
import { StyledTable } from "../../../components/styled/StyledTable";
import { useModal } from "../../../hooks/useModal/useModal";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import { useSelectedPod } from "../../../hooks/useSelectedPod/useSelectedPod";

export const NewLostCustomer = () => {
  const { isOpen, onClose, onOpen } = useModal();
  const [current, setCurrent] = useState<NewLostEnum>(NewLostEnum.New);

  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();
  const newLostData = useSelector(
    (state: RootState) => state.valueSettings.newLostCustomer,
  );
  const { newValue, lostValue } = useMemo(() => {
    return {
      newValue:
        newLostData.find((e) => e.type === NewLostEnum.New) || undefined,
      lostValue:
        newLostData.find((e) => e.type === NewLostEnum.Lost) || undefined,
    };
  }, [newLostData]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadNewLostCustomers(selectedSC.id, selectedPod?.id));
    }
  }, [selectedSC, selectedPod, dispatch]);

  const handleOpen = (t: NewLostEnum) => () => {
    setCurrent(t);
    onOpen();
  };

  return (
    <div>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Customer Type</TableCell>
            <TableCell colSpan={2}>Time Period</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>New Customer</TableCell>
            <TableCell>Considered new up to</TableCell>
            <TableCell width={180}>
              {newValue
                ? `${newValue.periodInMonth} month${newValue.periodInMonth > 1 ? "s" : ""}`
                : "-"}
            </TableCell>
            <TableCell align="right" width={180}>
              <Button onClick={handleOpen(NewLostEnum.New)} color="primary">
                Edit
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Lost Customer</TableCell>
            <TableCell>Considered lost after</TableCell>
            <TableCell>
              {lostValue
                ? `${lostValue.periodInMonth} month${lostValue.periodInMonth > 1 ? "s" : ""}`
                : "-"}
            </TableCell>
            <TableCell align="right">
              <Button onClick={handleOpen(NewLostEnum.Lost)} color="primary">
                Edit
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </StyledTable>
      <NewLostCustomerModal
        isNew={current === NewLostEnum.New}
        payload={current === NewLostEnum.New ? newValue : lostValue}
        open={isOpen}
        onClose={onClose}
      />
    </div>
  );
};
