import React from "react";
import {
    Box,
    CircularProgress,
    Switch,
    TableCell,
    TableRow,
} from "@mui/material";
import {ValueSlider} from "../../../../components/styled/ValueSlider";
import {IValueSettings} from "../../../../store/reducers/valueSettings/types";
import {SliderRange, TRow} from "../types";
import {Button, SliderCell} from "./styles";

type TRowProps = {
    rowData: TRow;
    isXS?: boolean;
    value: IValueSettings;
    loading: boolean;
    isNotSet: boolean;
    disabled: boolean;
    editing: boolean;
    onSwitch: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    onSlide: (e: Event, val: number | number[]) => void;
    onEdit: () => void;
    onTabChange: () => void
    onCancel: () => void;
    onSave: () => void;
}

export const ValueIndicatorsRow: React.FC<React.PropsWithChildren<React.PropsWithChildren<TRowProps>>> = props => {
    return <TableRow>
        {!props.isXS ? <TableCell>{props.rowData.title}</TableCell> : null}
        <SliderCell>
            {props.isXS ? <Box mb={1}>{props.rowData.title}</Box> : null}
            <ValueSlider
                min={SliderRange.Min}
                max={SliderRange.Max}
                onChange={props.onSlide}
                disabled={props.disabled}
                marks={[
                    {value: SliderRange.Min, label: SliderRange.Min},
                    {value: SliderRange.Max, label: SliderRange.Max}
                ]}
                valueLabelDisplay="on"
                value={props.value.point}
            />
        </SliderCell>
        <TableCell align="center">
            <Switch
                color="primary"
                disabled={props.isNotSet}
                onChange={props.onSwitch}
                checked={Boolean(props.value.state)}
            />
        </TableCell>
        <TableCell align={props.isXS ? "center" : "right"}>
            {props.isNotSet
                ? <Button color="primary" onClick={props.onTabChange}>
                    Adjust the value
                </Button>
                : !props.editing
                    ? <Button
                        color="primary"
                        onClick={props.onEdit}
                    >
                        Edit
                    </Button>
                    : props.loading ? <CircularProgress /> : <>
                        <Button
                            color="secondary"
                            onClick={props.onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={props.onSave}
                        >
                            Save
                        </Button>
                    </>
            }
        </TableCell>
    </TableRow>
}