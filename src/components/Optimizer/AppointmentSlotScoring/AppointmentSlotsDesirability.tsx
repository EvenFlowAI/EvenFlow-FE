import React, {useEffect, useMemo, useState} from "react";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    Paper,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {EDesirabilityState, ETimeSlotType} from "../../../store/reducers/slotScoring/types";
import {generateSlots, TSlot} from "./utils";
import {DesirabilityButton} from "../../UI/ConfigButton";
import {useDispatch, useSelector} from "react-redux";
import {SC_UNDEFINED, timeString} from "../../../config/constants";
import {
    loadDesirability,
    loadHorsOfOperations,
    saveDesirability
} from "../../../store/reducers/slotScoring/actions";
import {RootState} from "../../../store/rootReducer";
import {CheckBoxOutlined} from "@material-ui/icons";
import {Caption} from "../../UI/Caption";

const useStyles = makeStyles(theme => ({
    paper: {
        marginBottom: 20,
        borderRadius: 0,
        padding: 16,
        position: "relative"
    },
    controlButtons: {
        position: "absolute",
        top: 0,
        right: 0,
        [theme.breakpoints.down("xs")]: {
            display: "flex",
            flexDirection: "column-reverse"
        }
    },
    progress: {
        padding: 10,
    },
    editButton: {
        textTransform: "none",
        fontSize: 14
    },
    gridContainer: {
        margin: "0 -16px"
    },
    row: {
        borderRight: `1px solid ${theme.palette.divider}`,
        [theme.breakpoints.down("xs")]: {
            borderRight: "none"
        }
    },
    checkRow: {
        display: "flex",
        justifyContent: "space-around",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column"
        }
    },
    titleRow: {
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 12,
        color: theme.palette.text.disabled,
        [theme.breakpoints.down("xs")]: {
            fontSize: 11
        }
    },
    title: {
        fontSize: 16,
        paddingRight: 32,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        margin: "0 0 16px",
    },
}));
type TRowProps = {
    slot: TSlot;
    onClick: (t: EDesirabilityState) => () => void;
}
type TButtonProps = {
    onClick: (t: EDesirabilityState) => () => void;
    desirability: EDesirabilityState;
}

const getColor = (ds: EDesirabilityState, cds: EDesirabilityState): "primary" | "default" => {
    return ds === cds ? "primary" : "default";
}
type TButton = {label: string; type: EDesirabilityState};
const buttons: TButton[] = [
    {label: "Undesirable", type: EDesirabilityState.Undesirable},
    {label: "Neutral", type: EDesirabilityState.Neutral},
    {label: "Desirable", type: EDesirabilityState.Desirable},
]
const Buttons: React.FC<TButtonProps> = ({onClick, desirability}) => {
    return <>
        {buttons.map(b => {
            return <DesirabilityButton
                key={b.type}
                variant="contained"
                onClick={onClick(b.type)}
                color={getColor(desirability, b.type)}>
                {b.label}
            </DesirabilityButton>
        })}
    </>
}

const useStylesBR = makeStyles(theme => ({
    dataRow: {
        marginTop: 6,
        alignItems: "center"
    },
    time: {
        fontWeight: "bold",
        [theme.breakpoints.down("xs")]: {
            fontSize: 11
        }
    },
    buttons: {
        textAlign: "right",
        [theme.breakpoints.down("xs")]: {
            textAlign: "left",
            marginBottom: theme.spacing(1),
            display: "flex",
            flexFlow: "row nowrap",
            "&>button": {
                flexGrow: 1,
                flexBasis: 0
            }
        }
    }
}));
type TGap = {
    label: string;
    type: ETimeSlotType;
}
const gaps: TGap[] = [
    {label: "10-minutes Gap slots", type: ETimeSlotType.TenMinutes},
    {label: "15-minutes Gap slots", type: ETimeSlotType.FifteenMinutes},
    {label: "30-minutes Gap slots", type: ETimeSlotType.ThirtyMinutes}
];
const ButtonRow:React.FC<TRowProps> = ({slot, onClick}) => {
    const classes = useStylesBR();
    return <Grid className={classes.dataRow} container spacing={1}>
        <Grid item xs={6} sm={2} md={3} className={classes.time}>
            {slot.start.format(timeString)}
        </Grid>
        <Grid item xs={6} sm={2} md={2} className={classes.time}>
            {slot.end.format(timeString)}
        </Grid>
        <Grid item xs={12} sm={8} md={7} className={classes.buttons}>
            <Buttons onClick={onClick} desirability={slot.desirability} />
        </Grid>
    </Grid>
}

const TitleRow = () => {
    const classes = useStyles();

    return <Grid container spacing={1}>
        <Grid className={classes.titleRow} item xs={6} sm={2} md={3}>
            Slot starts
        </Grid>
        <Grid className={classes.titleRow} item xs={6} sm={2} md={2}>
            Slot ends
        </Grid>
        <Grid item xs={12} sm={8} md={7} />
    </Grid>
}

type TForm = {
    timeSlotType: ETimeSlotType;
    items: TSlot[];
};
const initialForm = {
    timeSlotType: ETimeSlotType.ThirtyMinutes,
    items: []
};
export const AppointmentSlotsDesirability = () => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const [isEdit, setEdit] = useState<boolean>(false);
    const {slotRange} = useSelector((state: RootState) => state.slotScoring);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const [desirabilityItems] = useSelector((state: RootState) => [
        state.slotScoring.desirability
    ]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadDesirability(selectedSC.id, selectedPod?.id));
            dispatch(loadHorsOfOperations(selectedSC.id));
        }
    }, [dispatch, selectedSC, selectedPod]);

    useEffect(() => {
        const t = desirabilityItems[0]
            ? desirabilityItems[0].timeSlotType
            : ETimeSlotType.ThirtyMinutes;
        if (slotRange) {

        }
        setForm({
            timeSlotType: t,
            items: generateSlots(t, desirabilityItems, desirabilityItems[0]?.timeSlotType, slotRange?.start, slotRange?.end)
        });
    }, [desirabilityItems]);

    const [slots1, slots2]: [TSlot[], TSlot[]] = useMemo(() => {
        const slots = [...form.items];
        const half = Math.floor(slots.length / 2);
        return [slots.slice(0, half), slots.slice(half)];
    }, [form]);

    const handleClick = (idx: number) => (t: EDesirabilityState) => () => {
        if (isEdit) {
            const items = [...form.items];
            items[idx] = {...items[idx], desirability: t};
            setForm({
                ...form,
                items
            });
        }
    };

    const handleEditCancel = () => {
        const t = desirabilityItems[0]?.timeSlotType || ETimeSlotType.ThirtyMinutes
        setForm({
            ...form,
            timeSlotType: t,
            items: generateSlots(t,
                desirabilityItems,
                desirabilityItems[0]?.timeSlotType,
                slotRange?.start,
                slotRange?.end
            )
        });
        setEdit(false);
    }

    const handleGapChange = (g: ETimeSlotType) => () => {
        if (isEdit) {
            setForm({
                timeSlotType: g,
                items: generateSlots(g, desirabilityItems, desirabilityItems[0]?.timeSlotType, slotRange?.start, slotRange?.end)
            });
        }
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(saveDesirability(
                    form.items.map(i => ({...i, index: i.idx})),
                    form.timeSlotType, selectedSC.id, selectedPod?.id
                ));
                showMessage("Saved");
                setEdit(false);
                setSaving(false);
            } catch (e) {
                showError(e);
                setSaving(false);
                handleEditCancel();
            }
        }
    }

    const classes = useStyles();

    return <Paper className={classes.paper} variant="outlined">
        <h2 className={classes.title}>
            Please indicate the desirability of appointment slots
        </h2>
        <div className={classes.controlButtons}>
            {isEdit
                ? saving ? <CircularProgress color="primary" className={classes.progress} />
                : <>
                    <Button
                        className={classes.editButton}
                        color="secondary"
                        onClick={handleEditCancel}>
                        Cancel
                    </Button>
                    <Button
                        className={classes.editButton}
                        color="primary"
                        onClick={handleSave}>
                        Save
                    </Button>
                </>
                : <Button
                    color="primary"
                    className={classes.editButton}
                    onClick={() => setEdit(true)}>
                    Edit
                </Button>
            }
        </div>
        <div className={classes.checkRow}>
            {gaps.map(g => {
                return <FormControlLabel
                    key={g.type}
                    label={g.label}
                    onChange={handleGapChange(g.type)}
                    control={
                        <Checkbox
                            color="primary"
                            checkedIcon={<CheckBoxOutlined />}
                            checked={form.timeSlotType === g.type} />
                    }
                />
            })}
        </div>
        <Grid className={classes.gridContainer} container spacing={4} alignItems="stretch">
            <Grid className={classes.row} item xs={12} sm={6}>
                <TitleRow />
                {slots1.map((slot) =>
                    <ButtonRow slot={slot} key={slot.idx} onClick={handleClick(slot.idx)} />
                )}
            </Grid>
            <Grid item xs={12} sm={6} style={{marginTop: isXS ? -theme.spacing(4) : undefined}}>
                {!isXS ? <TitleRow/> : null}
                {slots2.map((slot) =>
                    <ButtonRow slot={slot} key={slot.idx} onClick={handleClick(slot.idx)} />
                )}
            </Grid>
        </Grid>
        <Caption title="e.g. 30 min slots will show open slots at 8:00, 8:30, 9:00 etc" />
    </Paper>
}