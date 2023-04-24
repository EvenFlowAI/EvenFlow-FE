import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {DemandTable, SaveEditBlock, TableCell, TableRow} from "./UI";
import {TableBody, TableHead} from "@material-ui/core";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {SC_UNDEFINED} from "../../../config/constants";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {loadUnplannedDemand, setUnplannedDemand} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";
import {EDay, IUnplannedDemand} from "../../../store/reducers/demandSegments/types";
import {TextField} from "../../UI/TextField";

type TForm = number[];
const blankDemand: IUnplannedDemand = {
    day: EDay.Sunday,
    historicalWalkInScheduleBlocks: 0,
    optimizerSetting: 0,
    serviceCenterId: 0
}

const remapSegments = (sl: IUnplannedDemand[]): IUnplannedDemand[] => {
    return moment.weekdays().map((d, idx) => {
        return sl.find(s => s.day === idx as EDay) || {...blankDemand};
    })
}

type TUnplannedDemandProps = {
    isEdit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
}

export const UnplannedDemand: React.FC<TUnplannedDemandProps> = ({ setEdit, isEdit }) => {
    const [form, setForm] = useState<TForm>([]);
    const [isSaving, setSaving] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
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

    const handleCancel = () => {
        setForm(segments.map(s => s.optimizerSetting || 0));
        setEdit(false);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(setUnplannedDemand({
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id,
                    items: form.map((v, idx) => ({
                        day: idx as EDay,
                        optimizerSetting: v
                    }))
                }));
                setSaving(false);
                setEdit(false);
                showMessage("Saved");
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <div style={{overflowX: "auto"}}>
        <DemandTable>
            <TableHead>
                <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Historical Walk-in Schedule Blocks</TableCell>
                    <TableCell>Optimizer Setting</TableCell>
                    <TableCell width={200} style={{textAlign: "right"}}>
                        <SaveEditBlock
                            isLowerCase
                            onSave={handleSave}
                            onEdit={() => setEdit(true)}
                            onCancel={handleCancel}
                            isEdit={isEdit}
                            isSaving={isSaving}
                        />
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {moment.weekdays().map((d, idx) => {
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
                        <TableCell />
                    </TableRow>
                })}
            </TableBody>
        </DemandTable>
    </div>
}