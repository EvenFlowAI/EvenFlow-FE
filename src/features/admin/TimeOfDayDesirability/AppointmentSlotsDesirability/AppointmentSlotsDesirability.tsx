import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {Autocomplete, Box, Button, CircularProgress, Grid, Paper, useMediaQuery, useTheme} from "@mui/material";
import {EDesirabilityState, ETimeSlotType} from "../../../../store/reducers/slotScoring/types";
import {generateSlots, TSlot} from "../utils";
import {useDispatch, useSelector} from "react-redux";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {
    loadDesirability,
    loadRange,
    saveDesirability,
    setLoading
} from "../../../../store/reducers/slotScoring/actions";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {useStyles} from "./styles";
import {TForm} from "./types";
import {ButtonRow} from "./ButtonRow/ButtonRow";
import {TitleRow} from "./TitleRow/TitileRow";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";
import dayjs from "dayjs";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {getOptions} from "../../../../utils/utils";
import {TOption} from "../../../../utils/types";
import {days, initialForm} from "./constants";

export const AppointmentSlotsDesirability = () => {
    const {slotRange, isLoading, desirability: desirabilityItems} = useSelector((state: RootState) => state.slotScoring);
    const [form, setForm] = useState<TForm>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [dayOfWeek, setDayOfWeek] = useState<TOption|null>(null);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));
    const { classes  } = useStyles();
    const dayOfWeekOptions = getOptions(days).slice(1).concat({name: "Sunday", value: 0});

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadDesirability(selectedSC.id, dayOfWeek ? dayOfWeek.value : null, selectedPod?.id, (e) => showError(e)));
            dispatch(loadRange(selectedSC.id, dayOfWeek ? dayOfWeek.value : null, selectedPod?.id))
        }
    }, [dispatch, selectedSC, selectedPod, dayOfWeek]);

    useEffect(() => {
        setDayOfWeek(null)
    }, [selectedSC])

    useEffect(() => {
        const t = desirabilityItems[0]
            ? desirabilityItems[0].timeSlotType
            : ETimeSlotType.ThirtyMinutes;
        setForm({
            timeSlotType: t,
            items: generateSlots(t, desirabilityItems, desirabilityItems[0]?.timeSlotType, slotRange?.start, slotRange?.end)
        });
        setTimeout(() => dispatch(setLoading(false)), 100)
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
        const t = desirabilityItems[0]
            ? desirabilityItems[0].timeSlotType
            : ETimeSlotType.ThirtyMinutes;
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

    const onSuccess = () => {
        showMessage("Saved");
        setEdit(false);
        setSaving(false);
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
                            start: dayjs(i.start).format('HH:mm:ss'),
                            end: dayjs(i.end).format('HH:mm:ss')
                        }
                        )),
                    form.timeSlotType,
                    selectedSC.id,
                    dayOfWeek ? dayOfWeek.value : null,
                    selectedPod?.id,
                    onSuccess,
                    (e) => onError(e)));
            } catch (e) {
                showError(e);
                setSaving(false);
                handleEditCancel();
            }
        }
    }

    const onDayOfWeekChange = (e: ChangeEvent<{}>, value: TOption|null) => {
         setDayOfWeek(value)
    }

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
                    EDIT
                </Button>
            }
        </div>
        <Autocomplete
            options={dayOfWeekOptions}
            style={{ marginBottom: 20, width: 250 }}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            value={dayOfWeek}
            onChange={onDayOfWeekChange}
            renderInput={autocompleteRender({
                label: 'Day Of Week',
                placeholder: 'All days',
            })}
        />
        {isLoading || saving
            ? <Loading/>
            : slots1.length ? <Grid className={classes.gridContainer} container spacing={2} alignItems="stretch">
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
    </Paper>
}