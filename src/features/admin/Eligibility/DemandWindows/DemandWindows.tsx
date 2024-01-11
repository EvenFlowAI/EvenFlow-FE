import React, {useEffect, useMemo, useState} from 'react';
import {SquarePaper} from "../../../../components/styled/Paper";
import {PaperTitle, TableContainer} from "../../../../pages/admin/PricingSettings/UI";
import {Box, Divider, Switch, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {loadTimeWindows, setTimeWindows} from "../../../../store/reducers/pricingSettings/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EWindowType, TTimeWindow} from "../../../../store/reducers/pricingSettings/types";
import {Caption} from "../../../../components/wrappers/Caption/Caption";
import {TextLink} from "../../../../components/wrappers/TextLink/TextLink";
import {useStyles} from "./styles";
import {DenseTable} from "../../../../components/styled/DemandTable";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {Routes} from "../../../../routes/constants";

export const DemandWindows = () => {
    const {timeWindows} = useSelector((state: RootState) => state.pricingSettings);
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const showError = useException();
    const dispatch = useDispatch();
    const classes = useStyles();

    const mappedTW = useMemo(() => {
        return timeWindows.reduce((acc, item) => {
            acc[item.type] = item;
            return acc;
        }, {} as TTimeWindow);
    }, [timeWindows]);

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
                        You can edit the Demand Segment values on <TextLink to={Routes.CapacityManagement.AppointmentAllocation}>
                            Appointment Allocation
                        </TextLink> page
                    </span>}
                />
            </Box>
        </TableContainer>
    </SquarePaper>
};