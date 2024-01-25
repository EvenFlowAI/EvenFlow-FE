import React, {Dispatch, SetStateAction} from "react";
import {IUnplannedDemandBySlot} from "../../../../store/reducers/demandSegments/types";
import {Table, TableBody, TableHead} from "@mui/material";
import {timeSpanString, time12HourFormat} from "../../../../utils/constants";
import {sortSlots} from "../utils";
import DemandInput from "../../AppointmentAllocation/DemandInput";
import {useStyles} from "./styles";
import {TableRow} from "../../../../components/styled/TableRow";
import {TableCell} from "../../../../components/styled/TableCell";
import dayjs from "dayjs";

type TTableProps = {
    setDemandSlots: Dispatch<SetStateAction<IUnplannedDemandBySlot[]>>;
    slots: IUnplannedDemandBySlot[];
}

const UnplannedDemandSlots: React.FC<React.PropsWithChildren<React.PropsWithChildren<TTableProps>>> = ({ slots, setDemandSlots }) => {
    const classes = useStyles();

    const onChange = (item: IUnplannedDemandBySlot, value: number|string) => {
        setDemandSlots(prev => {
            let data = [...prev];
            const prevItem = data.find(el => el.start === item.start)
            if (prevItem) {
                const updated = {...prevItem, amount: +value};
                data = data.filter(el => el.start !== item.start).concat(updated);
            }
            return sortSlots(data);
        })
    }

    return <Table>
        <TableHead>
            <TableRow className={classes.rowTop}>
                <TableCell className={classes.headCell}>Slot Starts</TableCell>
                <TableCell align="center" className={classes.headCell}>Slot Ends</TableCell>
                <TableCell align="center" className={classes.headCell}>Unplanned Demand</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {slots.map(item => {
                return <TableRow key={dayjs().toISOString() + item.start} className={classes.row}>
                    <TableCell key={item.start} align="center" className={classes.cell}>{dayjs.utc(item.start, timeSpanString).format(time12HourFormat)}</TableCell>
                    <TableCell key={item.end} align="center" className={classes.cell}>{dayjs.utc(item.end, timeSpanString).format(time12HourFormat)}</TableCell>
                    <TableCell className={classes.cell} align="center">
                        <DemandInput item={item} onBlur={onChange}/>
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>
}

export default UnplannedDemandSlots;