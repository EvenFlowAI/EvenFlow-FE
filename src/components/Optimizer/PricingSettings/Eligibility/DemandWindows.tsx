import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {Box, Divider, Switch, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../../AppointmentAllocation/UI";
import {useException, useSCs} from "../../../../utils/hooks";
import {loadTimeWindows, setTimeWindows} from "../../../../store/reducers/pricingSettings/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EWindowType, ITimeWindowEl} from "../../../../store/reducers/pricingSettings/types";
import {Caption} from "../../../UI/Caption";
import {TextLink} from "../../../UI/TextLink";
import {Routes} from "../../../../config/routes";

const useStyles = makeStyles(theme => ({
    switchCell: {
        fontSize: "12px !important",
        padding: "2px 12px !important"
    },
    tableWrapper: {
        overflowX: "auto",
        width: "100%",
        "& .MuiTableCell-root": {
            [theme.breakpoints.down("xs")]: {
                fontSize: "12px !important"
            }
        }
    },
    headerCell: {
        [theme.breakpoints.down("xs")]: {
            fontSize: "12px !important"
        }
    }
}));

type TTW = {
    [k in EWindowType]: ITimeWindowEl;
}
export const DemandWindows = () => {
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const showError = useException();
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

    const handleSwitch = (t: EWindowType) => async (e: any, checked: boolean) => {
        if (selectedSC) {
            try {
                setSaving(true);
                await dispatch(setTimeWindows({
                    serviceCenterId: selectedSC.id,
                    type: t,
                    ...mappedTW[t],
                    isEligibility: checked
                }));
            } catch (e) {
                showError(e);
            } finally {
                setSaving(false);
            }
        }
    }

    const classes = useStyles();
    return <SquarePaper variant="outlined">
        <PaperTitle>Demand windows Eligibility status</PaperTitle>
        <Divider />
        <TableContainer>
            <div className={classes.tableWrapper}>
                <DenseTable>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.headerCell}>Time Windows</TableCell>
                            <TableCell className={classes.headerCell} align="center">Window 1</TableCell>
                            <TableCell className={classes.headerCell} align="center">Window 2</TableCell>
                            <TableCell className={classes.headerCell} align="center">Window 3</TableCell>
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
                                {mappedTW[EWindowType.Window1]?.durationInHours || "-"}
                            </TableCell>
                            <TableCell align="center">
                                {mappedTW[EWindowType.Window2]?.durationInHours || "-"}
                            </TableCell>
                            <TableCell align="center"/>
                        </TableRow>
                        <TableRow>
                            <TableCell>Eligibility Status</TableCell>
                            <TableCell className={classes.switchCell} align="center">
                                <strong>OFF</strong>
                                <Switch
                                    disabled={saving}
                                    onChange={handleSwitch(EWindowType.Window1)}
                                    checked={Boolean(mappedTW[EWindowType.Window1]?.isEligibility)}
                                    color="primary"/>
                                <strong>ON</strong>
                            </TableCell>
                            <TableCell className={classes.switchCell} align="center">
                                <strong>OFF</strong>
                                <Switch
                                    disabled={saving}
                                    onChange={handleSwitch(EWindowType.Window2)}
                                    checked={Boolean(mappedTW[EWindowType.Window2]?.isEligibility)}
                                    color="primary"/>
                                <strong>ON</strong>
                            </TableCell>
                            <TableCell className={classes.switchCell} align="center">
                                <strong>OFF</strong>
                                <Switch
                                    disabled={saving}
                                    onChange={handleSwitch(EWindowType.Window3)}
                                    checked={Boolean(mappedTW[EWindowType.Window3]?.isEligibility)}
                                    color="primary"/>
                                <strong>ON</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </DenseTable>
            </div>
            <Box mt={2}>
                <Caption
                    title={<span>
                        You can edit the Demand segment values on <TextLink to={Routes.Optimizer.AppointmentAllocation}>
                            Appointment Allocation
                        </TextLink> page
                    </span>}
                />
            </Box>
        </TableContainer>
    </SquarePaper>
};