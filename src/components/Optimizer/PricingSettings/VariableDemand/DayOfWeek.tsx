import React, {useState} from 'react';
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {Box, Divider, Mark, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../../AppointmentAllocation/UI";
import {dayDemands, EDayDemand} from "../../../../store/reducers/pricingSettings/types";
import {EditButton} from "../../../UI/Button";
import {ValueSlider} from "../../AppointmentValue/UI";

enum ESliderRange {
    Min= 0.0,
    Max= 3.0,
    Default= 0.0,
    Step= 0.1
}
const sliderMarks: Mark[] = [
    {label: ESliderRange.Min, value: ESliderRange.Min},
    {label: ESliderRange.Max, value: ESliderRange.Max},
]
type TForm = {
    [k in EDayDemand]: number;
}
const initialForm: TForm = {
    [EDayDemand.Low]: ESliderRange.Default,
    [EDayDemand.High]: ESliderRange.Default,
}

export const DayOfWeek = () => {
    const [edit, setEdit] = useState<EDayDemand|null>(null);
    const [form, setForm] = useState<TForm>(initialForm);
    const handleEdit = (t: EDayDemand|null) => () => {
        setEdit(t);
        if (t === null) {
            // Clear form
            setForm({...initialForm});
        }
    }
    const handleSlide = (t: EDayDemand) => (e: any, value: number|number[]) => {
        setForm({...form, [t]: value as number});
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
                            <TableCell>
                                <Box ml={2} mr={2}>
                                    <ValueSlider
                                        min={ESliderRange.Min}
                                        max={ESliderRange.Max}
                                        disabled={edit !== d.id}
                                        valueLabelDisplay="on"
                                        step={ESliderRange.Step}
                                        defaultValue={ESliderRange.Default}
                                        value={form[d.id]}
                                        marks={sliderMarks}
                                        onChange={handleSlide(d.id)}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell align="right">
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