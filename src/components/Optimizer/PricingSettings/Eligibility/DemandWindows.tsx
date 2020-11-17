import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {Divider} from "@material-ui/core";

const useStyles = makeStyles({

});

export const DemandWindows = () => {
    const classes = useStyles();
    return <SquarePaper variant="outlined">
        <PaperTitle>Demand windows Eligibility status</PaperTitle>
        <Divider />
        <TableContainer>
            Data
        </TableContainer>
    </SquarePaper>
};