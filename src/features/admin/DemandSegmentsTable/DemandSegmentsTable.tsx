import React, {useEffect, useState} from "react";
import {TableHead, TableBody, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {loadDemandSegments, setDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";
import {SC_UNDEFINED} from "../../../utils/constants";
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import {ISetDemandSegmentForm} from "../../../store/reducers/demandSegments/types";
import {DemandTable} from "../../../components/styled/DemandTable";
import {TableRow} from "../../../components/styled/TableRow";
import {EditingCell, TableCell} from "./styles";
import {SaveEditBlock} from "../../../components/buttons/SaveEditBlock/SaveEditBlock";
import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../hooks/useSelectedPod/useSelectedPod";

type TForm = number[][];

export const DemandSegmentsTable = () => {
    const [form, setForm] = useState<TForm>([]);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const {demandSegmentList: segments, listLoading: loading} = useSelector((state: RootState) => state.demandSegments);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadDemandSegments(selectedSC.id, selectedPod?.id));
        }
    }, [selectedSC, selectedPod]);

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
                <TableCell width={200}>Demand Segments</TableCell>
                <TableCell>Window 1</TableCell>
                <TableCell>Window 2</TableCell>
                <TableCell>Window 3</TableCell>
                <TableCell width={200} style={{textAlign: "right"}}>
                    <SaveEditBlock
                        onSave={handleSave}
                        disabled={!segments.length}
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
                                <EditingCell>
                                    {idx + 1}
                                </EditingCell>
                                {el.map((item, iIdx) => {
                                    return <EditingCell
                                        key={`item-${iIdx}`}
                                    >
                                        <TextField
                                            id={`item-${iIdx}`}
                                            value={item}
                                            style={{minWidth: 90}}
                                            type="number"
                                            endAdornment="%"
                                            inputProps={{
                                                min: 0,
                                                max: 100
                                            }}
                                            onChange={handleChange(idx, iIdx)}
                                        />
                                    </EditingCell>
                                })}
                                <EditingCell />
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