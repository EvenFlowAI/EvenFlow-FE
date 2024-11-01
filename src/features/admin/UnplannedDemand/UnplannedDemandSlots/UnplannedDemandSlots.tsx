import React, {Dispatch, SetStateAction} from "react";
import {IUnplannedDemandBySlot} from "../../../../store/reducers/demandSegments/types";
import {Table, TableBody, TableHead} from "@mui/material";
import {timeSpanString, time12HourFormat} from "../../../../utils/constants";
import {sortSlots} from "../utils";
import DemandInput from "../../AppointmentAllocation/DemandInput";
import {UnplannedTableCell, useStyles} from "./styles";
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
            const prevItem = prev.find(el => {
                return el.id && item.id
                    ? el.id === item.id
                    : el.start === item.start && el.end === item.end
            })
            if (prevItem) {
                const updated = {...prevItem, amount: +value};
                return prev
                    .filter(el => {
                        return el.id && item.id
                            ? el.id !== item.id
                            : el.start !== item.start && el.end !== item.end
                    })
                    .concat(updated)
                    .sort(sortSlots)
            }
           return prev;
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
                    <UnplannedTableCell
                        key={item.start}
                        style={{textAlign: 'left', padding: '22px 16px'}}
                        className={classes.cell}>
                        {dayjs.utc(item.start, timeSpanString).format(time12HourFormat)}
                    </UnplannedTableCell>
                    <UnplannedTableCell
                        key={item.end}
                        style={{textAlign: 'left', padding: '22px 16px'}}
                        className={classes.cell}>
                        {dayjs.utc(item.end, timeSpanString).format(time12HourFormat)}
                    </UnplannedTableCell>
                    <UnplannedTableCell className={classes.cell}>
                        <DemandInput item={item} onBlur={onChange}/>
                    </UnplannedTableCell>
                </TableRow>
            })}
            {withEmptyRow
                ? <TableRow
                    key={dayjs().toISOString() + 1806}
                    style={{backgroundColor: (slots.length + 1) % 2 === 0 ? '#F2F3F7' : "#FFFFFF"}}
                    className={classes.row}>
                    <TableCell style={{height: 83}} colSpan={3}/>
            </TableRow>
                : null}
        </TableBody>
    </Table>
}

export default UnplannedDemandSlots;