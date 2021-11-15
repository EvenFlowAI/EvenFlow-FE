import React, {useState} from 'react';
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle} from "../UI";
import {
    Box,
    Button,
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody, withStyles,
} from "@material-ui/core";
import {useModal} from "../../../../utils/hooks";
import {ValueSlider} from "../../AppointmentValue/UI";

enum SliderRange {
    Min = -10,
    Max = 10
}

const Slider = withStyles({
    root: {
        margin: "0 25px",
        width: "calc(100% - 50px)"
    },
    markLabel: {
        top: 5,
        left: "-12px !important",
        "& ~ .MuiSlider-mark ~ .MuiSlider-markLabel": {
            left: "unset !important",
            right: -25
        }
    },
})(ValueSlider);

type TOpsCode = {
    opsCode: string;
    low: number;
    high: number;
    id: number;
}

const mockTableData = [
    {
        opsCode: '1212434',
        low: -5,
        high: 5,
        id: 1,
    },
    {
        opsCode: '1212435',
        low: 0,
        high: 0,
        id: 2,
    },
    {
        opsCode: '1212436',
        low: -4,
        high: 7,
        id: 3,
    },
    {
        opsCode: '1212438',
        low: -8,
        high: 8,
        id: 4,
    }
]

const DayOfWeekOpsCode = () => {
    const { onOpen, onClose, isOpen } = useModal();
    // TODO change data
    const [opsCodes, setOpsCodes] = useState<TOpsCode[]>(mockTableData);

    const deleteOpsCode = (item: TOpsCode) => {
        // ToDo show modal and request
    }

    const handleChange = (id: number, type: "low" | "high") => (e: any, val: number | number[]) => {
        setOpsCodes(prev => {
            const item = prev.find(item => item.id === id);
            const filtered = prev.filter(item => item.id !== id);
            if (item) {
                const updated = {...item, [type]: val};
                return [...filtered, updated].sort((a, b) => a.id - b.id);
            }
            return prev;
        })
    }

    return <SquarePaper variant="outlined">
        <Box display="flex" mr={2} alignItems="center">
            <PaperTitle>Day of Week Ops Code</PaperTitle>
            <div className="grow" />
            <Button color="primary" onClick={onOpen} variant="contained">
                Add Ops Code
            </Button>
        </Box>
        <Box display="flex" mr={2} ml={2} alignItems="center">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Ops Code
                        </TableCell>
                        <TableCell>
                            Low
                        </TableCell>
                        <TableCell>
                            High
                        </TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {opsCodes.map(item => {
                        return <TableRow key={item.opsCode}>
                            <TableCell key={item.opsCode}>
                                {item.opsCode}
                            </TableCell>
                            <TableCell key="low">
                                <Slider
                                    min={SliderRange.Min}
                                    max={SliderRange.Max}
                                    onChange={handleChange(item.id, "low")}
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={item.low}
                                    valueLabelDisplay="on"
                                />
                            </TableCell>
                            <TableCell key="high">
                                <Slider
                                    min={SliderRange.Min}
                                    max={SliderRange.Max}
                                    onChange={handleChange(item.id, "high")}
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={item.low}
                                    valueLabelDisplay="on"
                                />
                            </TableCell>
                            <TableCell key="remove">
                                <Button variant="text" onClick={() => deleteOpsCode(item)} color="primary">Remove</Button>
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </Box>
    </SquarePaper>;
};

export default DayOfWeekOpsCode;