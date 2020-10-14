import React, {useEffect, useState} from "react";
import {TableCell, TableHead, TableRow, TableBody, Button, CircularProgress} from "@material-ui/core";
import {AppointmentTable} from "../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadDemandSegments, setDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";
import {SC_UNDEFINED} from "../../../config/constants";
import {TextField} from "../../UI/TextField";
import {ISetDemandSegmentForm} from "../../../store/reducers/demandSegments/types";

const useStyles = makeStyles(theme => ({
    cell: {
        border: "none !important",
        padding: "12px 16px !important",
        textAlign: "center",
    },
    table: {
        border: `1px solid ${theme.palette.divider}`
    },
    row: {
        "&:nth-child(2n) .MuiTableCell-root": {
            backgroundColor: "#F2F3F7"
        }
    },
    headRow: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    button: {
        textTransform: "none",
        fontSize: 14
    }
}));

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

    const classes = useStyles();
    return <AppointmentTable className={classes.table}>
        <TableHead>
            <TableRow className={classes.headRow}>
                <TableCell className={classes.cell} width={200}>Demand segments</TableCell>
                <TableCell className={classes.cell}>Window 1</TableCell>
                <TableCell className={classes.cell}>Window 2</TableCell>
                <TableCell className={classes.cell}>Window 3</TableCell>
                <TableCell className={classes.cell} width={100}>
                    {!isEdit
                        ? <Button
                            onClick={() => setEdit(true)}
                            className={classes.button}
                            color='primary'>
                            Edit
                        </Button>
                        : isSaving
                            ? <CircularProgress />
                            : <>
                            <Button
                                onClick={handleSave}
                                color="primary"
                                className={classes.button}>
                                Save
                            </Button>
                            <Button
                                onClick={handleCancel}
                                color="secondary"
                                className={classes.button}>
                                Cancel
                            </Button>
                        </>
                    }
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {loading
                ? <TableRow>
                    <TableCell colSpan={5} className={classes.cell}>
                        <CircularProgress />
                    </TableCell>
                </TableRow>
                : !segments.length
                    ? <TableRow>
                        <TableCell colSpan={5} className={classes.cell}>No Segments Created</TableCell>
                    </TableRow>
                    : isEdit
                        ? form.map((el, idx) => {
                            return <TableRow key={idx} className={classes.row}>
                                <TableCell className={classes.cell}>
                                    {idx + 1}
                                </TableCell>
                                {el.map((item, iIdx) => {
                                    return <TableCell
                                        key={`item-${iIdx}`}
                                        className={classes.cell}
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
                                <TableCell className={classes.cell} />
                            </TableRow>
                        })
                        : segments.map((segment, idx) => {
                            return <TableRow key={segment.id} className={classes.row}>
                                <TableCell className={classes.cell}>
                                    {idx + 1}
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    {segment.window1Point} %
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    {segment.window2Point} %
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    {segment.window3Point} %
                                </TableCell>
                                <TableCell className={classes.cell} />
                            </TableRow>
                        })
            }
        </TableBody>
    </AppointmentTable>;
}