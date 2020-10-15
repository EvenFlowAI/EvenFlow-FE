import React, {useEffect, useState} from "react";
import {TableHead, TableBody, CircularProgress} from "@material-ui/core";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadDemandSegments, setDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";
import {SC_UNDEFINED} from "../../../config/constants";
import {TextField} from "../../UI/TextField";
import {ISetDemandSegmentForm} from "../../../store/reducers/demandSegments/types";
import {DemandTable, TableRow, TableCell, SaveEditBlock} from "./UI";

type TForm = number[][];
export const DemandSegments = () => {
    const [form, setForm] = useState<TForm>([]);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const [segments, loading] = useSelector((state: RootState) => [
        state.demandSegments.demandSegmentList,
        state.demandSegments.listLoading
    ]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadDemandSegments(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod]);

    useEffect(() => {
        setForm(segments.map(s => [s.window1Point, s.window2Point, s.window3Point]));
    }, [segments]);

    const handleCancel = () => {
        setEdit(false);
        setForm(segments.map(s => [s.window1Point, s.window2Point, s.window3Point]));
    }

    const handleChange = (idx: number, iIdx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const nForm = [...form];
        nForm[idx] = [...nForm[idx]];
        nForm[idx][iIdx] = Number(e.target.value);
        setForm(nForm);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(setDemandSegments({
                    segments: form.map((el, idx) => {
                        return {
                            id: segments[idx]?.id || 0,
                            window1Point: el[0],
                            window2Point: el[1],
                            window3Point: el[2],
                        } as ISetDemandSegmentForm
                    }),
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id
                }))
                setSaving(false);
                setEdit(false);
                showMessage("Saved");
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <DemandTable>
        <TableHead>
            <TableRow>
                <TableCell width={200}>Demand segments</TableCell>
                <TableCell>Window 1</TableCell>
                <TableCell>Window 2</TableCell>
                <TableCell>Window 3</TableCell>
                <TableCell width={200} style={{textAlign: "right"}}>
                    <SaveEditBlock
                        onSave={handleSave}
                        onEdit={() => setEdit(true)}
                        onCancel={handleCancel}
                        isSaving={isSaving}
                        isEdit={isEdit}
                    />
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {loading
                ? <TableRow>
                    <TableCell colSpan={5}>
                        <CircularProgress />
                    </TableCell>
                </TableRow>
                : !segments.length
                    ? <TableRow>
                        <TableCell colSpan={5}>No Segments Created</TableCell>
                    </TableRow>
                    : isEdit
                        ? form.map((el, idx) => {
                            return <TableRow key={idx}>
                                <TableCell>
                                    {idx + 1}
                                </TableCell>
                                {el.map((item, iIdx) => {
                                    return <TableCell
                                        key={`item-${iIdx}`}
                                    >
                                        <TextField
                                            id={`item-${iIdx}`}
                                            value={item}
                                            type="number"
                                            endAdornment="%"
                                            inputProps={{
                                                min: 0,
                                                max: 100
                                            }}
                                            onChange={handleChange(idx, iIdx)}
                                        />
                                    </TableCell>
                                })}
                                <TableCell />
                            </TableRow>
                        })
                        : segments.map((segment, idx) => {
                            return <TableRow key={segment.id}>
                                <TableCell>
                                    {idx + 1}
                                </TableCell>
                                <TableCell>
                                    {segment.window1Point} %
                                </TableCell>
                                <TableCell>
                                    {segment.window2Point} %
                                </TableCell>
                                <TableCell>
                                    {segment.window3Point} %
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        })
            }
        </TableBody>
    </DemandTable>;
}