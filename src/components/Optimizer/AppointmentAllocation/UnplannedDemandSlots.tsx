import React, {Dispatch, SetStateAction} from "react";
import {IUnplannedDemandBySlot} from "../../../store/reducers/demandSegments/types";
import {makeStyles} from "@material-ui/core/styles";
import {Table, TableBody, TableHead} from "@material-ui/core";
import {TableCell, TableRow} from "./UI";
import moment from "moment";
import {timeSpanString, timeString} from "../../../config/constants";
import {sortSlots} from "./UnplannedDemandEditing";
import DemandInput from "./DemandInput";

type TTableProps = {
    setDemandSlots: Dispatch<SetStateAction<IUnplannedDemandBySlot[]>>;
    slots: IUnplannedDemandBySlot[];
}

const useStyles = makeStyles({
    headCell: {
        fontSize: 12,
        fontWeight: 700,
        color: "#9FA2B4",
        textTransform: 'uppercase',
        borderTop: '1px solid #D9D9D9',
        borderBottom: '1px solid #D9D9D9',
        padding: '18px 36px',
    },
    cell: {
        fontSize: 16
    },
    row: {
        borderRight: "1px solid #D9D9D9 !important"
    },
    rowTop: {
        borderRight: "1px solid #D9D9D9 !important",
        borderTop: "1px solid #D9D9D9 !important"
    },
})

const UnplannedDemandSlots: React.FC<TTableProps> = ({ slots, setDemandSlots }) => {
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
                return <TableRow key={moment().toISOString() + item.start} className={classes.row}>
                    <TableCell key={item.start} align="center" className={classes.cell}>{moment(item.start, timeSpanString).format(timeString)}</TableCell>
                    <TableCell key={item.end} align="center" className={classes.cell}>{moment(item.end, timeSpanString).format(timeString)}</TableCell>
                    <TableCell className={classes.cell} align="center">
                        <DemandInput item={item} onBlur={onChange}/>
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>
}

export default UnplannedDemandSlots;