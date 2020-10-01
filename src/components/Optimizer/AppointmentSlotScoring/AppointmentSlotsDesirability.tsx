import React, {useMemo} from "react";
import {useSCs, useSelectedPod} from "../../../utils/hooks";
import {Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {EDesirabilityState, ETimeSlotType} from "../../../store/reducers/slotScoring/types";
import {generateSlots, TSlot} from "./utils";
import {DesirabilityButton} from "../../UI/ConfigButton";

const useStyles = makeStyles(theme => ({
    paper: {
        marginBottom: 10,
        borderRadius: 0,
        padding: 10,
        position: "relative"
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
                color={getColor(desirability, b.type)}>
                {b.label}
            </DesirabilityButton>
        })}
    </>
}

const useStylesBR = makeStyles({
    time: {
        fontWeight: "bold"
    },
    buttons: {
        textAlign: "right"
    }
});
const ButtonRow:React.FC<TRowProps> = ({slot, idx, onClick}) => {
    const classes = useStylesBR();
    return <Grid container spacing={2}>
        <Grid item xs={3} className={classes.time}>
            {slot.start.format("HH:mm a")}
        </Grid>
        <Grid item xs={3} className={classes.time}>
            {slot.end.format("HH:mm a")}
        </Grid>
        <Grid item xs={6} className={classes.buttons}>
            <Buttons idx={idx} onClick={onClick} desirability={slot.desirability} />
        </Grid>
    </Grid>
}

const TitleRow = () => {
    const classes = useStyles();

    return <Grid container spacing={2}>
        <Grid className={classes.titleRow} item xs={3}>
            Slot starts
        </Grid>
        <Grid className={classes.titleRow} item xs={3}>
            Slot ends
        </Grid>
        <Grid item xs={6} />
    </Grid>
}

export const AppointmentSlotsDesirability = () => {
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();


    const [slots1, slots2]: [TSlot[], TSlot[]] = useMemo(() => {
        const slots = generateSlots(ETimeSlotType.ThirtyMinutes);
        const half = Math.floor(slots.length / 2);
        return [slots.slice(0, half), slots.slice(half)];
    }, []);

    const handleClick = (idx: number) => (t: EDesirabilityState) => () => {

    };

    const classes = useStyles();

    return <Paper className={classes.paper} variant="outlined">
        <h2 className={classes.title}>
            Please indicate the desirability of appointment slots
        </h2>
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