import React, {useEffect, useState} from 'react';
import {SquarePaper} from "../../UI/Paper";
import {loadPricingCalculations} from "../../../store/reducers/pricingSettings/actions";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {useDispatch} from "react-redux";
import {PaperTitle, TableContainer} from "./UI";
import {Divider, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../AppointmentAllocation/UI";
import moment from "moment";

export const PricingOptimization = () => {
    const [sr, setSr] = useState<IAssignedServiceRequestShort|null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (sr) {
            dispatch(loadPricingCalculations(sr.id));
        }
    }, [sr, dispatch]);

    return <SquarePaper variant="outlined">
        <PaperTitle>Demand windows Eligibility status</PaperTitle>
        <Divider />
        <TableContainer>
            <DenseTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell width={"20%"} align="center">Low</TableCell>
                        <TableCell width={"20%"} align="center">Average</TableCell>
                        <TableCell width={"20%"} align="center">High</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {moment.weekdays().map((wd, idx) => {
                        return <TableRow key={wd}>
                            <TableCell>{wd}</TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">-</TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </DenseTable>
        </TableContainer>
    </SquarePaper>
};