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
    withEmptyRow?: boolean;
}

const UnplannedDemandSlots: React.FC<React.PropsWithChildren<React.PropsWithChildren<TTableProps>>> = ({
                                                                                                           withEmptyRow,
                                                                                                           slots,
                                                                                                           setDemandSlots
}) => {
    const { classes  } = useStyles();

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
                <TableCell
                    width={190}
                    className={classes.headCell}
                    style={{textAlign: 'left'}}>
                    Slot Starts
                </TableCell>
                <TableCell
                    width={190}
                    style={{textAlign: 'left'}}
                    className={classes.headCell}>
                    Slot Ends
                </TableCell>
                <TableCell
                    width={210}
                    className={classes.headCell}>
                    Unplanned Demand
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {slots.map((item, index) => {
                return <TableRow key={dayjs().toISOString() + index} className={classes.row}>
                    <TableCell
                        key={item.start}
                        style={{textAlign: 'left'}}
                        className={classes.cell}>
                        {dayjs.utc(item.start, timeSpanString).format(time12HourFormat)}
                    </TableCell>
                    <TableCell
                        key={item.end}
                        style={{textAlign: 'left'}}
                        className={classes.cell}>
                        {dayjs.utc(item.end, timeSpanString).format(time12HourFormat)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                        <DemandInput item={item} onBlur={onChange}/>
                    </TableCell>
                </TableRow>
            })}
            {withEmptyRow
                ? <TableRow
                    key={dayjs().toISOString() + 1806}
                    style={{backgroundColor: (slots.length + 1) % 2 === 0 ? '#F2F3F7' : "#FFFFFF"}}
                    className={classes.row}>
                    <TableCell style={{height: 67}} colSpan={3}/>
            </TableRow>
                : null}
        </TableBody>
    </Table>
}

export default UnplannedDemandSlots;