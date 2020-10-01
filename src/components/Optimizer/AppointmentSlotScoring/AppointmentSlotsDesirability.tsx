import React, {useEffect, useMemo, useState} from "react";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {Button, CircularProgress, Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {EDesirabilityState, ETimeSlotType} from "../../../store/reducers/slotScoring/types";
import {generateSlots, TSlot} from "./utils";
import {DesirabilityButton} from "../../UI/ConfigButton";
import {useDispatch, useSelector} from "react-redux";
import {SC_UNDEFINED} from "../../../config/constants";
import {loadDesirability, saveDesirability} from "../../../store/reducers/slotScoring/actions";
import {RootState} from "../../../store/rootReducer";

const useStyles = makeStyles(theme => ({
    paper: {
        marginBottom: 10,
        borderRadius: 0,
        padding: 16,
        position: "relative"
    },
    controlButtons: {
        position: "absolute",
        top: 0,
        right: 0
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
        borderRight: `1px solid ${theme.palette.divider}`
    },
    titleRow: {
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 12,
        color: theme.palette.text.disabled
    },
    title: {
        fontSize: 16,
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

const useStylesBR = makeStyles({
    dataRow: {
        marginTop: 6,
        alignItems: "center"
    },
    time: {
        fontWeight: "bold"
    },
    buttons: {
        textAlign: "right"
    }
});
const ButtonRow:React.FC<TRowProps> = ({slot, onClick}) => {
    const classes = useStylesBR();
    return <Grid className={classes.dataRow} container spacing={1}>
        <Grid item xs={3} className={classes.time}>
            {slot.start.format("HH:mm a")}
        </Grid>
        <Grid item xs={2} className={classes.time}>
            {slot.end.format("HH:mm a")}
        </Grid>
        <Grid item xs={7} className={classes.buttons}>
            <Buttons onClick={onClick} desirability={slot.desirability} />
        </Grid>
    </Grid>
}

const TitleRow = () => {
    const classes = useStyles();

    return <Grid container spacing={1}>
        <Grid className={classes.titleRow} item xs={3}>
            Slot starts
        </Grid>
        <Grid className={classes.titleRow} item xs={2}>
            Slot ends
        </Grid>
        <Grid item xs={7} />
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
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();

    const [desirabilityItems] = useSelector((state: RootState) => [
        state.slotScoring.desirability
    ]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadDesirability(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod]);

    useEffect(() => {
        const t = desirabilityItems[0]
            ? desirabilityItems[0].timeSlotType
            : ETimeSlotType.ThirtyMinutes;
        setForm({
            timeSlotType: t,
            items: generateSlots(t, desirabilityItems, desirabilityItems[0]?.timeSlotType)
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
                desirabilityItems[0]?.timeSlotType)
        });
        setEdit(false);
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
        <Grid className={classes.gridContainer} container spacing={4} alignItems="stretch">
            <Grid className={classes.row} item xs={6}>
                <TitleRow />
                {slots1.map((slot) =>
                    <ButtonRow slot={slot} key={slot.idx} onClick={handleClick(slot.idx)} />
                )}
            </Grid>
            <Grid item xs={6}>
                <TitleRow />
                {slots2.map((slot) =>
                    <ButtonRow slot={slot} key={slot.idx} onClick={handleClick(slot.idx)} />
                )}
            </Grid>
        </Grid>
    </Paper>
}