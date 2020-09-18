import React, {useEffect, useMemo, useState} from "react";
import {AppointmentTable} from "../UI";
import {Button, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {NewCustomerValue} from "../../../Modals/NewLostCusotomer/NewCustomerValue";
import {useModal, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadNewLostCustomers} from "../../../../store/reducers/valueSettings/actions";
import {RootState} from "../../../../store/rootReducer";
import {NewLostEnum} from "../../../../store/reducers/valueSettings/types";

export const NewLostCustomer = () => {
    const {
        isOpen,
        onClose,
        onOpen
    } = useModal();
    const [current, setCurrent] = useState<NewLostEnum>(NewLostEnum.New);

    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const newLostData = useSelector((state: RootState) => state.valueSettings.newLostCustomer);
    const {newValue, lostValue} = useMemo(() => {
        return {
            newValue: newLostData.find(e => e.type === NewLostEnum.New) || undefined,
            lostValue: newLostData.find(e => e.type === NewLostEnum.Lost) || undefined
        }
    }, [newLostData]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadNewLostCustomers(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

    const handleOpen = (t: NewLostEnum) => () => {
        setCurrent(t);
        onOpen();
    }

    return <div>
        <AppointmentTable>
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
                    <TableCell className="primary">
                        {newValue
                            ? `${newValue.periodInMonth} month${newValue.periodInMonth > 1 ? "s" : ""}`
                            : "-"
                        }
                    </TableCell>
                    <TableCell align="right">
                        <Button onClick={handleOpen(NewLostEnum.New)} color="primary">Edit</Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Lost Customer</TableCell>
                    <TableCell>Considered lost after</TableCell>
                    <TableCell className="primary">
                        {lostValue
                            ? `${lostValue.periodInMonth} month${lostValue.periodInMonth > 1 ? "s" : ""}`
                            : "-"
                        }
                    </TableCell>
                    <TableCell align="right">
                        <Button onClick={handleOpen(NewLostEnum.Lost)} color="primary">Edit</Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </AppointmentTable>
        <NewCustomerValue
            isNew={current === NewLostEnum.New}
            payload={current === NewLostEnum.New ? newValue : lostValue}
            open={isOpen}
            onClose={onClose}
        />
    </div>;
}