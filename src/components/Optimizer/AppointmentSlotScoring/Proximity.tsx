import React, {useEffect, useMemo, useState} from "react";
import {AppointmentTable, ValueSlider} from "../AppointmentValue/UI";
import {Button, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadProximity} from "../../../store/reducers/slotScoring/actions";
import {RootState} from "../../../store/rootReducer";
import {EProximityType} from "../../../store/reducers/slotScoring/types";

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

export const Proximity = () => {
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [edit, setEdit] = useState<EProximityType|null>(null);
    const [form, setForm] = useState<TForm>(initialForm);

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
        setForm({
            [EProximityType.Closest]: closest ? {...closest} : {...blankSlider},
            [EProximityType.Earliest]: earliest ? {...earliest} : {...blankSlider}
        });
    }, [closest, earliest]);

    useEffect(() => {
        if (selectedSC)
            dispatch(loadProximity(selectedSC.id));
    }, [dispatch, selectedSC]);

    const handleEdit = (el: EProximityType) => () => {
        setEdit(el);
    }
    const handleCancel = () => {
        setForm({
            [EProximityType.Closest]: closest ? {...closest} : {...blankSlider},
            [EProximityType.Earliest]: earliest ? {...earliest} : {...blankSlider}
        });
        setEdit(null);
    }
    const handleSave = () => {

    }

    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    <TableCell>Proximity Search</TableCell>
                    <TableCell align="center">Optimization setting</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Closest available</TableCell>
                    <TableCell>
                        <ValueSlider
                            min={SliderRange.Min}
                            max={SliderRange.Max}
                            disabled={edit !== EProximityType.Closest}
                            marks={[
                                {value: SliderRange.Min, label: SliderRange.Min},
                                {value: SliderRange.Max, label: SliderRange.Max}
                            ]}
                            value={form[EProximityType.Closest].point}
                            valueLabelDisplay="on"
                        />
                    </TableCell>
                    <TableCell align="right">
                        {edit === EProximityType.Closest
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
                            onClick={handleEdit(EProximityType.Closest)}>
                            Edit
                        </Button>}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Earliest available</TableCell>
                    <TableCell>
                        <ValueSlider
                            min={SliderRange.Min}
                            max={SliderRange.Max}
                            disabled={edit !== EProximityType.Earliest}
                            marks={[
                                {value: SliderRange.Min, label: SliderRange.Min},
                                {value: SliderRange.Max, label: SliderRange.Max}
                            ]}
                            value={form[EProximityType.Earliest].point}
                            valueLabelDisplay="on"
                        />
                    </TableCell>
                    <TableCell align="right">
                        {edit === EProximityType.Earliest
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
                            onClick={handleEdit(EProximityType.Earliest)}>
                            Edit
                        </Button>}
                    </TableCell>
                </TableRow>
            </TableBody>
        </AppointmentTable>
    </div>
}