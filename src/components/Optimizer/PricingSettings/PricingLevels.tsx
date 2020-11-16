import React from 'react';
import {Divider, Paper, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {DemandTable} from "../AppointmentAllocation/UI";
import {EditButton} from "../../UI/Button";
import {PriceLevelsDialog} from "./PriceLevelsDialog";
import {useModal} from "../../../utils/hooks";

const useStyles = makeStyles(theme => ({
    heading: {
        textTransform: "uppercase",
        fontWeight: "bold", fontSize: 16,
        margin: 0, padding: "16px 36px"
    },
    paper: {
        borderRadius: 0
    },
    tableWrapper: {
        padding: 16
    },
    inputCell: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.palette.primary.main
    },
    editCell: {
        display: "flex",
        width: "100%",
        height: "100%",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "space-between"
    }
}));

export const PricingLevels = () => {
    const {onClose, onOpen, isOpen} = useModal();

    const handleOpen = () => {
        onOpen();
    }

    const classes = useStyles();
    return <Paper className={classes.paper} variant="outlined">
        <h3 className={classes.heading}>Demand Windows Eligibility Status</h3>
        <Divider />
        <div className={classes.tableWrapper}>
            <DemandTable>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}>Price levels</TableCell>
                        <TableCell>Price percentage</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Discount</TableCell>
                        <TableCell align="center">from 0% to 100%</TableCell>
                        <TableCell className={classes.inputCell}>
                            <div className={classes.editCell}>
                                <span>90%</span>
                                <EditButton onClick={handleOpen} color="primary">
                                    Edit
                                </EditButton>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Discount</TableCell>
                        <TableCell align="center">fixed to 100%</TableCell>
                        <TableCell className={classes.inputCell}>100%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Discount</TableCell>
                        <TableCell align="center">from 100% to 200%</TableCell>
                        <TableCell className={classes.inputCell}>
                            <div className={classes.editCell}>
                                <span>120%</span>
                                <EditButton onClick={handleOpen} color="primary">
                                    Edit
                                </EditButton>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </DemandTable>
        </div>
        <PriceLevelsDialog open={isOpen} onClose={onClose} />
    </Paper>
};