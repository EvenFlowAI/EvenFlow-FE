import React, {useEffect} from "react";
import {Button, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {CustomerLifetimes} from "../../../Modals/CustomerLifetimes/CustomerLifetimes";
import {useModal, useSCs, useSelectedPod} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadCustomerLifetimes} from "../../../../store/reducers/valueSettings/actions";
import {RootState} from "../../../../store/rootReducer";
import {AppointmentTable} from "../UI";
import {Caption} from "../../../UI/Caption";

export const CustomerLifetimeRules = () => {
    const {isOpen, onOpen, onClose} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const data = useSelector((state: RootState) => state.valueSettings.customerLifetimes);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadCustomerLifetimes(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedPod, selectedSC]);

    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    <TableCell>Customer Lifetime Value</TableCell>
                    <TableCell colSpan={3}>Value Definition</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Low Value</TableCell>
                    <TableCell>Less than</TableCell>
                    <TableCell colSpan={2} className="primary">{data ? `$${data.from}`: '-'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Medium Value</TableCell>
                    <TableCell>Medium Value</TableCell>
                    <TableCell className="primary">{data ? `$${data.from} - $${data.to}` : '-'}</TableCell>
                    <TableCell align="right">
                        <Button
                            onClick={onOpen}
                            color="primary"
                        >
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>High Value</TableCell>
                    <TableCell>More than</TableCell>
                    <TableCell colSpan={2} className="primary">{data ? `$${data.to}` : "-"}</TableCell>
                </TableRow>
            </TableBody>
        </AppointmentTable>
        <Caption title={"You can only edit Medium value and have Low and High automatically adjust"} />
        <CustomerLifetimes payload={data} open={isOpen} onClose={onClose} />
    </div>
}