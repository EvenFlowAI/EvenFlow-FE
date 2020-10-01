import React, {useEffect, useMemo, useState} from "react";
import {useSCs, useSelectedPod} from "../../../utils/hooks";
import {Button, Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {EDesirabilityState, ETimeSlotType} from "../../../store/reducers/slotScoring/types";
import {generateSlots, TSlot} from "./utils";
import {DesirabilityButton} from "../../UI/ConfigButton";

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
    idx: number;
    onClick: (t: EDesirabilityState) => () => void;
}
type TButtonProps = {
    idx: number;
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
const Buttons: React.FC<TButtonProps> = ({idx, onClick, desirability}) => {
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
const ButtonRow:React.FC<TRowProps> = ({slot, idx, onClick}) => {
    const classes = useStylesBR();
    return <Grid className={classes.dataRow} container spacing={1}>
        <Grid item xs={3} className={classes.time}>
            {slot.start.format("HH:mm a")}
        </Grid>
        <Grid item xs={2} className={classes.time}>
            {slot.end.format("HH:mm a")}
        </Grid>
        <Grid item xs={7} className={classes.buttons}>
            <Buttons idx={idx} onClick={onClick} desirability={slot.desirability} />
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
    const [isEdit, setEdit] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

    useEffect(() => {
        const t = ETimeSlotType.ThirtyMinutes;
        setForm({
            timeSlotType: t,
            items: generateSlots(t)
        });
    }, []);

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
        setForm({
            ...form,
            items: generateSlots(form.timeSlotType)
        });
        setEdit(false);
    }

    const handleSave = () => {
        setEdit(false);
    }

    const classes = useStyles();

    return <Paper className={classes.paper} variant="outlined">
        <h2 className={classes.title}>
            Please indicate the desirability of appointment slots
        </h2>
        <div className={classes.controlButtons}>
            {isEdit
                ? <>
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
                    <ButtonRow slot={slot} key={slot.idx} idx={slot.idx} onClick={handleClick(slot.idx)} />
                )}
            </Grid>
            <Grid item xs={6}>
                <TitleRow />
                {slots2.map((slot) =>
                    <ButtonRow slot={slot} key={slot.idx} idx={slot.idx} onClick={handleClick(slot.idx)} />
                )}
            </Grid>
        </Grid>
    </Paper>
}