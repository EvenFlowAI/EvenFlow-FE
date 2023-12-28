import React, {useEffect, useMemo, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    Paper,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {EDesirabilityState, ETimeSlotType} from "../../../../store/reducers/slotScoring/types";
import {generateSlots, TSlot} from "../utils";
import {useDispatch, useSelector} from "react-redux";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {
    loadDesirability,
    loadRange,
    saveDesirability
} from "../../../../store/reducers/slotScoring/actions";
import {RootState} from "../../../../store/rootReducer";
import {CheckBoxOutlined} from "@material-ui/icons";
import {Caption} from "../../../../components/wrappers/Caption/Caption";
import moment from "moment";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {useStyles} from "./styles";
import {TForm} from "./types";
import {gaps} from "./constants";
import {ButtonRow} from "./ButtonRow/ButtonRow";
import {TitleRow} from "./TitleRow/TitileRow";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";

const initialForm = {
    timeSlotType: ETimeSlotType.ThirtyMinutes,
    items: []
};

export const AppointmentSlotsDesirability = () => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const [isEdit, setEdit] = useState<boolean>(false);
    const {slotRange, isLoading} = useSelector((state: RootState) => state.slotScoring);
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
            dispatch(loadDesirability(selectedSC.id, selectedPod?.id, (e) => showError(e)));
            dispatch(loadRange(selectedSC.id, selectedPod?.id))
        }
    }, [dispatch, selectedSC, selectedPod]);

    useEffect(() => {
        const t = desirabilityItems[0]
            ? desirabilityItems[0].timeSlotType
            : ETimeSlotType.ThirtyMinutes;
        setForm({
            timeSlotType: t,
            items: generateSlots(t, desirabilityItems, desirabilityItems[0]?.timeSlotType, slotRange?.start, slotRange?.end)
        });
    }, [desirabilityItems, slotRange]);

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
                items: generateSlots(g, desirabilityItems, desirabilityItems[0]?.timeSlotType, slotRange?.start, slotRange?.end, true)
            });
        }
    }

    const onSuccess = () => {
        showMessage("Saved");
        setEdit(false);
        setSaving(false);
        if (form.timeSlotType !== desirabilityItems[0].timeSlotType) showMessage("The Unplanned Demand Settings were reset", "warning")
    }

    const onError = (err:any) => {
        showError(err);
        setSaving(false);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(saveDesirability(
                    form.items.map(i => (
                        {
                            ...i,
                            index: i.idx,
                            start: moment(i.start).format('HH:mm:SS'),
                            end: moment(i.end).format('HH:mm:SS')
                        }
                        )),
                    form.timeSlotType, selectedSC.id, selectedPod?.id,
                    onSuccess,
                    (e) => onError(e)));
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
        {isLoading
            ? <Loading/>
            : slots1.length ? <Grid className={classes.gridContainer} container spacing={4} alignItems="stretch">
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
                : <Box p={2} textAlign="center">No items...</Box>
        }
        <Caption title="e.g. 30 min slots will show open slots at 8:00, 8:30, 9:00 etc" />
    </Paper>
}