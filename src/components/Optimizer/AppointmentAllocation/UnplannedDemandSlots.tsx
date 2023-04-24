import React, {Dispatch, SetStateAction} from "react";
import {IUnplannedDemandBySlot} from "../../../store/reducers/demandSegments/types";
import {makeStyles} from "@material-ui/core/styles";
import {Table, TableBody, TableHead} from "@material-ui/core";
import {TableCell, TableRow} from "./UI";

type TTableProps = {
    setDemandSlots: Dispatch<SetStateAction<IUnplannedDemandBySlot[]>>;
    slots: IUnplannedDemandBySlot[];
}

const useStyles = makeStyles({

})

const UnplannedDemandSlots: React.FC<TTableProps> = ({ slots, setDemandSlots }) => {
    const classes = useStyles();

    return <Table>
        <TableHead>
            <TableRow>
                <TableCell align="center">Slot Starts</TableCell>
                <TableCell align="center">Slot Ends</TableCell>
                <TableCell align="center">Unplanned Demand</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {slots.map(item => {

            })}
        </TableBody>
    </Table>
}

export default UnplannedDemandSlots;