import React, {useEffect} from 'react';
import {Button, Paper, TableBody, TableCell, TableHead, TableRow, withStyles} from "@material-ui/core";
import {AppointmentTable, ValueSlider} from "../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";
import {useModal, useSCs, useSelectedPod} from "../../../utils/hooks";
import {EditDemandSegments} from './EditDemandSegments';
import {useDispatch, useSelector} from "react-redux";
import {loadOptimizationSettings} from "../../../store/reducers/slotScoring/actions";
import {RootState} from "../../../store/rootReducer";
import {EOptimizationSettingValueType} from "../../../store/reducers/slotScoring/types";

enum SliderRange {
    Min = -10,
    Max = 10
}

const Slider = withStyles({
    root: {
        margin: "0 25px",
        width: "calc(100% - 50px)"
    },
    markLabel: {
        top: 5,
        left: "-12px !important",
        "& ~ .MuiSlider-mark ~ .MuiSlider-markLabel": {
            left: "unset !important",
            right: -25
        }
    },
})(ValueSlider);

const useStyles = makeStyles({
    table: {
        "& .MuiTableCell-head": {
            textAlign: "center"
        },
        "& .MuiTableCell-body": {
            textAlign: "center",
            padding: "10px !important",
            fontSize: 12
        }
    },
    segment: {
        fontWeight: "bold"
    },
    subtitleCell: {
        padding: "8px !important",
        fontSize: "12px !important",
        color: "#9FA2B4"
    },
    edit: {
        fontSize: 14,
        textTransform: "none",
        padding: 5,
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        right: 0
    },
    buttonCell: {
        position: "relative",
        paddingRight: "56px !important"
    }
});

export const DemandSegmentsDesirability = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const optSettings = useSelector((state: RootState) => state.slotScoring.optimizationSettings);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadOptimizationSettings(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod])

    const handleOpen = () => {
        onOpen();
    }
    const classes = useStyles();
    return <Paper variant="outlined" style={{borderRadius: 0}}>
        <AppointmentTable className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell className={classes.buttonCell} colSpan={2}>
                        Demand Segment
                        <Button className={classes.edit} onClick={handleOpen} color="primary">Edit</Button>
                    </TableCell>
                    <TableCell width={183} rowSpan={2}>Time Windows</TableCell>
                    <TableCell width={550} colSpan={2}>Optimization Settings</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.subtitleCell}>Segment Start</TableCell>
                    <TableCell className={classes.subtitleCell}>Segment End</TableCell>
                    <TableCell className={classes.subtitleCell}>Undesirable</TableCell>
                    <TableCell className={classes.subtitleCell}>Desirable</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {optSettings.map(seg => {
                    const row1 = seg.values.find(
                        v => v.type === EOptimizationSettingValueType.LessThanW3);
                    const row2 = seg.values.find(
                        v => v.type === EOptimizationSettingValueType.GreaterOrEqualW3);

                    return <React.Fragment key={seg.id}>
                            <TableRow key={`${seg.id}-1`}>
                                <TableCell rowSpan={2}>
                                    from <span className={classes.segment}>{seg.from}</span>
                                </TableCell>
                                <TableCell rowSpan={2}>
                                    to <span className={classes.segment}>{seg.to}</span>
                                </TableCell>
                                <TableCell>
                                    {"< W3"}
                                </TableCell>
                                <TableCell>
                                    {row1?.undesirablePoint}
                                </TableCell>
                                <TableCell>
                                    {row1?.desirablePoint}
                                </TableCell>
                            </TableRow>
                            <TableRow key={`${seg.id}-2`}>
                                <TableCell>
                                    {">= W3"}
                                </TableCell>
                                <TableCell>
                                    <Slider
                                        min={SliderRange.Min}
                                        max={SliderRange.Max}
                                        disabled={true}
                                        marks={[
                                            {value: SliderRange.Min, label: SliderRange.Min},
                                            {value: SliderRange.Max, label: SliderRange.Max}
                                        ]}
                                        value={row2?.undesirablePoint || 0}
                                        valueLabelDisplay="on"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Slider
                                        min={SliderRange.Min}
                                        max={SliderRange.Max}
                                        disabled={true}
                                        marks={[
                                            {value: SliderRange.Min, label: SliderRange.Min},
                                            {value: SliderRange.Max, label: SliderRange.Max}
                                        ]}
                                        value={row2?.desirablePoint || 0}
                                        valueLabelDisplay="on"
                                    />
                                </TableCell>
                            </TableRow>
                        </React.Fragment>;
                    }
                )}
            </TableBody>
        </AppointmentTable>
        <EditDemandSegments onClose={onClose} open={isOpen} />
    </Paper>
};