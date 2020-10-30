import React, {useEffect, useState} from 'react';
import {
    Button,
    CircularProgress,
    Paper,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    withStyles
} from "@material-ui/core";
import {AppointmentTable, ValueSlider} from "../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useModal, useSCs, useSelectedPod} from "../../../utils/hooks";
import {EditDemandSegments} from './EditDemandSegments';
import {useDispatch, useSelector} from "react-redux";
import {loadOptimizationSettings, setSettingValues} from "../../../store/reducers/slotScoring/actions";
import {RootState} from "../../../store/rootReducer";
import {
    EOptimizationSettingValueType,
    IOptimizationSettingValue,
    IOptimizationSettingValueForm
} from "../../../store/reducers/slotScoring/types";
import {SC_UNDEFINED} from "../../../config/constants";

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
    editN: {
        fontSize: 14,
        textTransform: "none",
        padding: 5,
    },
    editWrapper: {
        position: "absolute",
        top: "50%",
        right: 0,
        transform: "translate(0, -50%)"
    },
    buttonCell: {
        position: "relative",
        paddingRight: "56px !important"
    }
});

type TForm = {
    undesirable: number;
    desirable: number;
    id: number;
}
const initialForm: TForm[] = [
    {undesirable: 0, desirable: 0, id: 0},
    {undesirable: 0, desirable: 0, id: 0},
    {undesirable: 0, desirable: 0, id: 0},
    {undesirable: 0, desirable: 0, id: 0},
    {undesirable: 0, desirable: 0, id: 0},
    {undesirable: 0, desirable: 0, id: 0},
]

export const DemandSegmentsDesirability = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const [form, setForm] = useState<TForm[]>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const optSettings = useSelector((state: RootState) => state.slotScoring.optimizationSettings);
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadOptimizationSettings(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod]);

    useEffect(() => {
        const nForm: TForm[] = [];
        for (let i = 0; i < 3; i++) {
            const row = optSettings[i];
            const r1 = row?.values.find(v => v.type === EOptimizationSettingValueType.LessThanW3);
            const r2 = row?.values.find(v => v.type === EOptimizationSettingValueType.GreaterOrEqualW3);
            nForm.push({
                undesirable: r1?.undesirablePoint || 0,
                desirable: r1?.desirablePoint || 0,
                id: r1?.optimizationSettingsId || row?.id || 0
            });
            nForm.push({
                undesirable: r2?.undesirablePoint || 0,
                desirable: r2?.desirablePoint || 0,
                id: r2?.optimizationSettingsId || row?.id || 0
            });
        }
        setForm(nForm);
    }, [optSettings, edit]);

    const handleOpen = () => {
        onOpen();
    }

    const handleChange = (idx: number, name: keyof TForm) => (e: any, val: number | number[]) => {
        const f = [...form];
        const r = {...form[idx]};
        r[name] = val as number;
        f[idx] = r;
        setForm(f);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                const items: IOptimizationSettingValue[] = [];
                for (let i = 0; i < 3; i++) {
                    const r1 = form[i*2];
                    const r2 = form[i*2+1]
                    items.push({
                        undesirablePoint: r1.undesirable,
                        desirablePoint: r1.desirable,
                        type: EOptimizationSettingValueType.LessThanW3,
                        optimizationSettingsId: r1.id
                    });
                    items.push({
                        undesirablePoint: r2.undesirable,
                        desirablePoint: r2.desirable,
                        type: EOptimizationSettingValueType.GreaterOrEqualW3,
                        optimizationSettingsId: r2.id
                    });
                }
                const data: IOptimizationSettingValueForm = {items};
                await dispatch(setSettingValues(data, selectedSC.id, selectedPod?.id));
                setEdit(false);
                setSaving(false);
                showMessage("Saved");
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
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
                    <TableCell width={550} colSpan={2} className={classes.buttonCell}>
                        Optimization Settings
                        {edit
                            ? saving ?
                                <div className={classes.editWrapper}><CircularProgress /></div>
                                : <div className={classes.editWrapper}>
                                <Button color="secondary"
                                        className={classes.editN}
                                        onClick={() => setEdit(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    className={classes.editN}
                                    onClick={handleSave}>
                                    Save
                                </Button>
                            </div>
                            : <Button
                                color="primary"
                                className={classes.edit}
                                onClick={() => setEdit(true)}>
                                Edit
                            </Button>
                        }
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.subtitleCell}>Segment Start</TableCell>
                    <TableCell className={classes.subtitleCell}>Segment End</TableCell>
                    <TableCell className={classes.subtitleCell}>Undesirable</TableCell>
                    <TableCell className={classes.subtitleCell}>Desirable</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {optSettings.map((seg, idx) =>
                    <React.Fragment key={seg.id}>
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
                                <Slider
                                    min={SliderRange.Min}
                                    max={SliderRange.Max}
                                    disabled={!edit}
                                    onChange={handleChange(idx * 2, "undesirable")}
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={form[idx*2].undesirable}
                                    valueLabelDisplay="on"
                                />
                            </TableCell>
                            <TableCell>
                                <Slider
                                    min={SliderRange.Min}
                                    max={SliderRange.Max}
                                    disabled={!edit}
                                    onChange={handleChange(idx * 2, "desirable")}
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={form[idx*2].desirable}
                                    valueLabelDisplay="on"
                                />
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
                                    disabled={!edit}
                                    onChange={handleChange(idx * 2 + 1, "undesirable")}
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={form[idx*2+1].undesirable}
                                    valueLabelDisplay="on"
                                />
                            </TableCell>
                            <TableCell>
                                <Slider
                                    min={SliderRange.Min}
                                    max={SliderRange.Max}
                                    disabled={!edit}
                                    onChange={handleChange(idx * 2 + 1, "desirable")}
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={form[idx*2+1].desirable}
                                    valueLabelDisplay="on"
                                />
                            </TableCell>
                        </TableRow>
                    </React.Fragment>
                )}
            </TableBody>
        </AppointmentTable>
        <EditDemandSegments onClose={onClose} open={isOpen} />
    </Paper>
};