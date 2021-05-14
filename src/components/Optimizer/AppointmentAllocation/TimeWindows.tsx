import React, {useEffect, useState} from "react";
import {
    Button as Bt,
    CircularProgress,
    TableBody,
    TableCell as TC,
    TableRow,
    useMediaQuery, useTheme,
    withStyles
} from "@material-ui/core";
import {AppointmentTable} from "../AppointmentValue/UI";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {loadTimeWindow, setTimeWindow} from "../../../store/reducers/demandSegments/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ITimeWindow} from "../../../store/reducers/demandSegments/types";
import {SC_UNDEFINED} from "../../../config/constants";
import {TextField} from "../../UI/TextField";

const TableCell = withStyles({
    root: {
        padding: "12px 16px !important",
        textAlign: "center",
    }
})(TC);

const theadStyle = {
    fontWeight: "bold" as const, textTransform: "uppercase" as const
};

type TForm = {
    start: number;
    stop: number;
    duration1: number;
    duration2: number;
}
const defaultForm: TForm = {
    start: 0, stop: 0, duration1: 0, duration2: 0
}

const Button = withStyles({
    root: {
        fontSize: 16,
        textTransform: "none"
    }
})(Bt);
const getData = (d: ITimeWindow): TForm => {
    return {
        start: d.startInHours,
        stop: d.startInHours + d.durationInHours,
        duration1: d.startInHours,
        duration2: d.durationInHours
    };
}
const InputOrValue: React.FC<{
    name: string;
    value: number;
    onChange: React.ChangeEventHandler
    isEdit: boolean;
}> = ({name, value, isEdit, onChange}) => {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    if (!isEdit) return <span>{value ? String(value) : "0"}</span>;
    return <TextField
        name={name}
        value={value}
        type="number"
        style={{minWidth: 80}}
        inputProps={{
            min: 0
        }}
        endAdornment={!isXS ? "hour(s)" : undefined}
        onChange={onChange}
        id={name}
    />
}
type TItem = {
    name?: keyof TForm;
    value?: string;
};
type TRow = {
    label: string;
    items: TItem[];
}
const rows: TRow[] = [
    {
        label: "Start (hours)",
        items: [
            {value: "0"},
            {name: "start"},
            {name: "stop"}
        ]
    },
    {
        label: "Duration (hours)",
        items: [
            {name: "duration1"},
            {name: "duration2"},
            {value: ""}
        ]
    }
]

export const TimeWindows = () => {
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

    return <AppointmentTable>
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
    </AppointmentTable>
}