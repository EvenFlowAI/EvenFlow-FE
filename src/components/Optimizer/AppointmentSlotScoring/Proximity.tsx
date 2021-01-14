import React, {useEffect, useMemo, useState} from "react";
import {AppointmentTable, ValueSlider} from "../AppointmentValue/UI";
import {
    Box,
    Button,
    CircularProgress,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {createProximity, loadProximity} from "../../../store/reducers/slotScoring/actions";
import {RootState} from "../../../store/rootReducer";
import {EProximityType, IProximity} from "../../../store/reducers/slotScoring/types";
import {SOMETHING_WRONG} from "../../../config/constants";

enum SliderRange {
    Min= 0,
    Max = 10,
    Default= 0
}
type TProximity = {
    point: number;
}
type TForm = {
    [T in EProximityType]: TProximity;
}
const blankSlider: TProximity = {point: SliderRange.Default};
const initialForm: TForm = {
    [EProximityType.Closest]: {...blankSlider},
    [EProximityType.Earliest]: {...blankSlider},
}

type TRow = {
    id: EProximityType;
    label: string;
};

const rows: TRow[] = [
    {
        id: EProximityType.Closest,
        label: "Closest available"
    },
    {
        id: EProximityType.Earliest,
        label: "Earliest available"
    }
]

export const Proximity = () => {
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const [edit, setEdit] = useState<EProximityType|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(initialForm);
    const showMessage = useMessage();
    const showError = useException();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const [proximity] = useSelector((state: RootState) => [
        state.slotScoring.proximity
    ]);

    const [closest, earliest] = useMemo(() => {
        return [
            proximity.find(e => e.type === EProximityType.Closest),
            proximity.find(e => e.type === EProximityType.Earliest)
        ];
    }, [proximity]);

    useEffect(() => {
        if (selectedSC)
            dispatch(loadProximity(selectedSC.id, selectedPod?.id));
    }, [dispatch, selectedPod, selectedSC]);

    useEffect(() => {
        setForm({
            [EProximityType.Closest]: closest ? {...closest} : {...blankSlider},
            [EProximityType.Earliest]: earliest ? {...earliest} : {...blankSlider}
        });
    }, [closest, earliest]);

    const handleEdit = (el: EProximityType) => () => {
        setEdit(el);
    }
    const handleSlide = (_: any, val: number | number[]) => {
        if (edit !== null) {
            setForm({...form, [edit]: {point: val as number}});
        }
    }
    const handleCancel = () => {
        setForm({
            [EProximityType.Closest]: closest ? {...closest} : {...blankSlider},
            [EProximityType.Earliest]: earliest ? {...earliest} : {...blankSlider}
        });
        setEdit(null);
    }
    const handleSave = async () => {
        if (edit === null) {
            showError(SOMETHING_WRONG);
        } else {
            setLoading(true);
            const data: IProximity = {
                point: form[edit].point,
                serviceCenterId: selectedSC?.id,
                podId: selectedPod?.id,
                type: edit
            };
            try {
                await dispatch(createProximity(data));
                setLoading(false);
                setEdit(null);
                showMessage("Saved")
            } catch (e) {
                setLoading(false);
                handleCancel();
                showError(e);
            }
        }
    }

    const editButton = (t: EProximityType) => {
        return loading
            ? <CircularProgress color="primary"/>
            : edit === t
                ? <>
                    <Button onClick={handleCancel} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </>
                : <Button
                    disabled={edit !== null}
                    color="primary"
                    onClick={handleEdit(t)}>
                    Edit
                </Button>;
    }

    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    {!isXS ? <TableCell>Proximity Search</TableCell> : null}
                    <TableCell align="center">Optimization setting</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map(row =>
                    <TableRow key={row.id}>
                        {!isXS ? <TableCell>{row.label}</TableCell> : null}
                        <TableCell>
                            {isXS ? <span>{row.label}</span> : null}
                            <Box p={isXS ? 1 : 0}>
                                <ValueSlider
                                    min={SliderRange.Min}
                                    max={SliderRange.Max}
                                    onChange={handleSlide}
                                    disabled={edit !== row.id}
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={form[row.id].point}
                                    valueLabelDisplay="on"
                                />
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            {editButton(row.id)}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </AppointmentTable>
    </div>
}