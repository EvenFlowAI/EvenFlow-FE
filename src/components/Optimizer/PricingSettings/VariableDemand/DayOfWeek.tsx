import React, {useState} from 'react';
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {Divider, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../../AppointmentAllocation/UI";
import {dayDemands, EDayDemand} from "../../../../store/reducers/pricingSettings/types";
import {EditButton} from "../../../UI/Button";

export const DayOfWeek = () => {
    const [edit, setEdit] = useState<EDayDemand|null>(null);
    const handleEdit = (t: EDayDemand|null) => () => {
        setEdit(t);
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Day of week</PaperTitle>
        <Divider />
        <TableContainer>
            <DenseTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Value</TableCell>
                        <TableCell width="50%">Pricing Settings</TableCell>
                        <TableCell width="20%" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dayDemands.map(d => {
                        return <TableRow key={d.id}>
                            <TableCell>{d.label}</TableCell>
                            <TableCell />
                            <TableCell>
                                {(edit === d.id) ?
                                    <>
                                        <EditButton color="secondary" onClick={handleEdit(null)}>Cancel</EditButton>
                                        <EditButton color="primary">Save</EditButton>
                                    </>
                                    : <EditButton
                                        color="primary"
                                        onClick={handleEdit(d.id)}
                                    >Edit</EditButton>}
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </DenseTable>
        </TableContainer>
    </SquarePaper>
};