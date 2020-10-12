import React, {useEffect, useState} from "react";
import {Button as Bt, TableBody, TableCell as TC, TableRow, withStyles} from "@material-ui/core";
import {AppointmentTable} from "../AppointmentValue/UI";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {loadTimeWindow} from "../../../store/reducers/demandSegments/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ITimeWindow} from "../../../store/reducers/demandSegments/types";

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
export const TimeWindows = () => {
    const [form, setForm] = useState<TForm>(defaultForm);
    const [isEdit, setEdit] = useState<boolean>(false);
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

    const handleSave = async () => {

    }

    return <AppointmentTable>
        <TableBody>
            <TableRow>
                <TableCell style={theadStyle}>Time windows</TableCell>
                <TableCell style={theadStyle}>Window 1</TableCell>
                <TableCell style={theadStyle}>Window 2</TableCell>
                <TableCell style={theadStyle}>Window 3</TableCell>
                <TableCell rowSpan={3}>
                    {!isEdit
                        ? <Button color="primary" onClick={() => setEdit(true)}>
                            Edit
                        </Button>
                        : <>
                            <Button color="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </>}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Start (hours)</TableCell>
                <TableCell>0</TableCell>
                <TableCell>{form.start}</TableCell>
                <TableCell>{form.stop}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Duration (hours)</TableCell>
                <TableCell>{form.duration1}</TableCell>
                <TableCell>{form.duration2}</TableCell>
                <TableCell/>
            </TableRow>
        </TableBody>
    </AppointmentTable>
}