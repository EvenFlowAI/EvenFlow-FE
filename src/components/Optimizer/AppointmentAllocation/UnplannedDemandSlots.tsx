import React, { Dispatch, SetStateAction } from "react";
import {
    IRemappedUnplannedDemandBySlot,
    IUnplannedDemandBySlot
} from "../../../store/reducers/demandSegments/types";
import {makeStyles} from "@material-ui/core/styles";
import {Table, TableBody, TableHead} from "@material-ui/core";
import {TableCell, TableRow} from "./UI";
import moment from "moment";
import {timeSpanString, timeString} from "../../../config/constants";
import {TextField} from "../../UI/TextField";
import {useException} from "../../../utils/hooks";

type TTableProps = {
    setDemandSlots: Dispatch<SetStateAction<IRemappedUnplannedDemandBySlot[]>>;
    slots: IRemappedUnplannedDemandBySlot[];
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
    inputWrapper: {
        width: 80,
        '& > input': {
            textAlign: "center"
        }
    }
})

const UnplannedDemandSlots: React.FC<TTableProps> = ({ slots, setDemandSlots }) => {
    const classes = useStyles();
    const showError = useException();

    const onInputChange = (item: IUnplannedDemandBySlot) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!Number.isInteger(+e.target.value)) {
            showError('"Unplanned Demand" must be a whole number');
        } else {
            setDemandSlots(prev => {
                let data = prev;
                const prevItem = prev.find(el => el.id === item.id)
                if (prevItem) {
                    const updated = {...prevItem, optimizerSetting: +e.target.value}
                    data = prev.filter(el => el.id !== item.id).concat(updated)
                }
                return data;
            })
        }
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
                        <TextField
                            value={item.optimizerSetting}
                            type="number"
                            inputProps={{
                                min: 0,
                            }}
                            onChange={onInputChange(item)}
                            className={classes.inputWrapper}/>
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>
}

export default UnplannedDemandSlots;