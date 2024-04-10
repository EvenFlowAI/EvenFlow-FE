import React, {useEffect, useState} from "react";
import {CircularProgress, TableBody, TableRow,} from "@mui/material";
import {loadTimeWindow, setTimeWindow} from "../../../../store/reducers/demandSegments/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {StyledTable} from "../../../../components/styled/StyledTable";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";
import {InputOrValue} from "./TableInput";
import {Button, TableCell} from "./styles";
import {TForm} from "./types";
import {defaultForm, rows, theadStyle} from "./constants";
import {getData} from "./utils";

export const TimeWindowsTable = () => {
    const [form, setForm] = useState<TForm>(defaultForm);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const timeWindow = useSelector((state: RootState) => state.demandSegments.timeWindow);

    useEffect(() => {
        setForm(getData(timeWindow));
    }, [timeWindow]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadTimeWindow(selectedSC.id, selectedPod?.id));
        }
    }, [selectedSC, dispatch, selectedPod]);

    const handleCancel = () => {
        setForm(getData(timeWindow));
        setEdit(false);
    }
    const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        const nForm = {...form, [name]: Number(value)};
        switch(name) {
            case "start":
                nForm.duration1 = nForm.start;
                nForm.duration2 = nForm.stop - nForm.start;
                break;
            case "stop":
                nForm.duration2 = nForm.stop - nForm.start;
                break;
            case "duration1":
                nForm.start = nForm.duration1;
                break;
            case "duration2":
                nForm.stop = nForm.start + nForm.duration2;
                break;
            default:
                break;
        }
        setForm(nForm);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(setTimeWindow({
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id,
                    startInHours: form.start,
                    durationInHours: form.duration2
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

    return <StyledTable>
        <TableBody>
            <TableRow>
                <TableCell style={theadStyle}>Time windows</TableCell>
                <TableCell style={theadStyle}>Window 1</TableCell>
                <TableCell style={theadStyle}>Window 2</TableCell>
                <TableCell style={theadStyle}>Window 3</TableCell>
                <TableCell rowSpan={3} width={100}>
                    {!isEdit
                        ? <Button color="primary" onClick={() => setEdit(true)}>
                            Edit
                        </Button>
                        : !saving ? <>
                            <Button color="primary" onClick={handleSave}>
                                Save
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </>
                    : <CircularProgress />}
                </TableCell>
            </TableRow>
            {rows.map(row =>
                <TableRow key={row.label}>
                    <TableCell>{row.label}</TableCell>
                    {row.items.map((item, idx) =>
                        <TableCell key={idx}>{!item.name ? item.value :
                            <InputOrValue
                                name={item.name}
                                value={form[item.name]}
                                onChange={handleChange}
                                isEdit={isEdit}
                            />
                        }</TableCell>
                    )}
                </TableRow>
            )}
        </TableBody>
    </StyledTable>
}