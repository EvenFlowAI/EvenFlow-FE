import React from "react";
import {AppointmentTable, ValueSlider} from "../AppointmentValue/UI";
import {Button, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";

enum SliderRange {
    Min= 0,
    Max = 10,
    Default= 0
}

export const Proximity = () => {
    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    <TableCell>Proximity Search</TableCell>
                    <TableCell align="center">Optimization setting</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Closest available</TableCell>
                    <TableCell>
                        <ValueSlider
                            min={SliderRange.Min}
                            max={SliderRange.Max}
                            marks={[
                                {value: SliderRange.Min, label: SliderRange.Min},
                                {value: SliderRange.Max, label: SliderRange.Max}
                            ]}
                            defaultValue={SliderRange.Default}
                            valueLabelDisplay="on"
                        />
                    </TableCell>
                    <TableCell align="right">
                        <Button color="primary">
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Earliest available</TableCell>
                    <TableCell>
                        <ValueSlider
                            min={SliderRange.Min}
                            max={SliderRange.Max}
                            marks={[
                                {value: SliderRange.Min, label: SliderRange.Min},
                                {value: SliderRange.Max, label: SliderRange.Max}
                            ]}
                            defaultValue={SliderRange.Default}
                            valueLabelDisplay="on"
                        />
                    </TableCell>
                    <TableCell align="right">
                        <Button color="primary">
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </AppointmentTable>
    </div>
}