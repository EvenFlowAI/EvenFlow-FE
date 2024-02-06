import React, {useEffect, useMemo, useState} from "react";
import {TableBody, TableHead, Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {loadUnplannedDemand} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";
import {EDay, IUnplannedDemand} from "../../../store/reducers/demandSegments/types";
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import UnplannedDemandEditing from "./UnplannedDemandEditing/UnplannedDemandEditing";
import {remapSegments} from "./utils";
import {DemandTable} from "../../../components/styled/DemandTable";
import {TableRow} from "../../../components/styled/TableRow";
import {TableCell} from "../../../components/styled/TableCell";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../hooks/useSelectedPod/useSelectedPod";
import dayjs from "dayjs";

type TForm = number[];

export const UnplannedDemand = () => {
    const [form, setForm] = useState<TForm>([]);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [editingElement, setEditingElement] = useState<IUnplannedDemand|null>(null);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const unplannedSegments = useSelector((state: RootState) => state.demandSegments.unplannedDemands);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadUnplannedDemand(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod]);

    const segments: IUnplannedDemand[] = useMemo(() => {
        return remapSegments(unplannedSegments);
    }, [unplannedSegments]);

    useEffect(() => {
        setForm(segments.map(s => s.optimizerSetting || 0));
    }, [segments]);

    const handleChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const nForm = [...form];
        nForm[idx] = Number.isInteger(+e.target.value) ? Number(e.target.value) : Number(Number(e.target.value).toFixed(2));
        setForm(nForm);
    }

    const onEdit = async (d: number) => {
        const el = unplannedSegments.find(item => item.day === d as EDay);
        if (el) await setEditingElement(el);
        await setEdit(true);
    }

    return <div style={{overflowX: "auto"}}>
        {!isEdit ? <DemandTable>
            <TableHead>
                <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Historical Walk-in Schedule Blocks</TableCell>
                    <TableCell>Optimizer Setting</TableCell>
                    <TableCell width={200} style={{textAlign: "right"}}/>
                </TableRow>
            </TableHead>
            <TableBody>
                {dayjs.weekdays().map((d, idx) => {
                    return <TableRow key={d}>
                        <TableCell>
                            {d}
                        </TableCell>
                        <TableCell>
                            {segments[idx].historicalWalkInScheduleBlocks}
                        </TableCell>
                        <TableCell>
                            {!isEdit
                                ? (segments[idx].optimizerSetting || 0)
                                : <TextField
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    value={form[idx]}
                                    onChange={handleChange(idx)}
                                />
                            }
                        </TableCell>
                        <TableCell>
                            <Button variant="text" color="primary" onClick={() => onEdit(idx)}>Edit</Button>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </DemandTable>
            : <UnplannedDemandEditing setEdit={setEdit} isEdit={isEdit} editingElement={editingElement}/>}
    </div>
}