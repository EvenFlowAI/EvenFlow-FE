import React, {useEffect, useState} from "react";
import {TableCell, TableHead, TableRow, TableBody, Button, CircularProgress} from "@material-ui/core";
import {AppointmentTable} from "../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";
import {SC_UNDEFINED} from "../../../config/constants";

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
        fontSize: 16
    }
}));

export const DemandSegments = () => {
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

    const handleCancel = () => {

    }

    const handleSave = () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {

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
                                onClick={handleCancel}
                                color="secondary"
                                className={classes.button}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                color="primary"
                                className={classes.button}>
                                Save
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