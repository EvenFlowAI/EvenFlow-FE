import React, {useEffect, useMemo} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {Divider, Switch, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../../AppointmentAllocation/UI";
import {useSCs} from "../../../../utils/hooks";
import {loadTimeWindows} from "../../../../store/reducers/pricingSettings/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EWindowType, ITimeWindowEl} from "../../../../store/reducers/pricingSettings/types";

const useStyles = makeStyles({
    switchCell: {
        fontSize: "12px !important",
        padding: "2px 12px !important"
    }
});
type TTW = {
    [k in EWindowType]: ITimeWindowEl;
}
export const DemandWindows = () => {
    const {selectedSC} = useSCs();
    const timeWindows = useSelector((state: RootState) => {
        return state.pricingSettings.timeWindows;
    });
    const mappedTW = useMemo(() => {
        return timeWindows.reduce((acc, item) => {
            acc[item.type] = item;
            return acc;
        }, {} as TTW);
    }, [timeWindows]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadTimeWindows(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const classes = useStyles();
    return <SquarePaper variant="outlined">
        <PaperTitle>Demand windows Eligibility status</PaperTitle>
        <Divider />
        <TableContainer>
            <DenseTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Time Windows</TableCell>
                        <TableCell align="center">Window 1</TableCell>
                        <TableCell align="center">Window 2</TableCell>
                        <TableCell align="center">Window 3</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Start (hours)</TableCell>
                        <TableCell align="center">
                            {mappedTW[EWindowType.Window1]?.startInHours || 0}
                        </TableCell>
                        <TableCell align="center">
                            {mappedTW[EWindowType.Window2]?.startInHours || "-"}
                        </TableCell>
                        <TableCell align="center">
                            {mappedTW[EWindowType.Window3]?.startInHours || "-"}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Duration (hours)</TableCell>
                        <TableCell align="center">
                            {mappedTW[EWindowType.Window1]?.durationInHours || ""}
                        </TableCell>
                        <TableCell align="center">
                            {mappedTW[EWindowType.Window2]?.durationInHours || ""}
                        </TableCell>
                        <TableCell align="center" />
                    </TableRow>
                    <TableRow>
                        <TableCell>Eligibility Status</TableCell>
                        <TableCell className={classes.switchCell} align="center">
                            <strong>OFF</strong>
                            <Switch color="primary" />
                            <strong>ON</strong>
                        </TableCell>
                        <TableCell className={classes.switchCell} align="center">
                            <strong>OFF</strong>
                            <Switch color="primary" />
                            <strong>ON</strong>
                        </TableCell>
                        <TableCell className={classes.switchCell} align="center">
                            <strong>OFF</strong>
                            <Switch color="primary" />
                            <strong>ON</strong>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </DenseTable>
        </TableContainer>
    </SquarePaper>
};