import React, {useEffect} from "react";
import {AppointmentTable} from "../UI";
import {Button, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {useModal, useSCs, useSelectedPod} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {loadEndOfWarranty} from "../../../../store/reducers/valueSettings/actions";
import {EndOfWarrantyDialog} from "../../../Modals/EndOfWarranty/EndOfWarrantyDialog";

export const EndOfWarranty = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const endOfWarranty = useSelector((state: RootState) => state.valueSettings.endOfWarranty);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadEndOfWarranty(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedPod, selectedSC]);

    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>Customer type</TableCell>
                    <TableCell colSpan={2}>Time period</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>End of Warranty</TableCell>
                    <TableCell>Considered near the End of Warranty within</TableCell>
                    <TableCell className="primary">
                        {endOfWarranty
                            ? `${endOfWarranty.periodInMonth} month${endOfWarranty.periodInMonth > 1 ? "s" : ""}`
                            : "-"
                        }
                    </TableCell>
                    <TableCell align="right">
                        <Button
                            color="primary"
                            onClick={onOpen}
                        >
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </AppointmentTable>
        <EndOfWarrantyDialog open={isOpen} onClose={onClose} payload={endOfWarranty} />
    </div>;
}