import React, {useEffect, useState} from "react";
import {AppointmentTable, ValueSlider} from "../UI";
import {
    Button,
    Switch,
    TableBody,
    TableCell,
    TableCellProps,
    TableHead,
    TableRow
} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {loadValueSettings} from "../../../../store/reducers/valueSettings/actions";
import {useSCs} from "../../../../utils/hooks";
import {Indicators, IValueSettings} from "../../../../store/reducers/valueSettings/types";
import {noop} from "../../../../utils/utils";


enum SliderRange {
    Max= 10, Min= -10
}

type TForm = {
    [K in Indicators]: IValueSettings & {editing: boolean};
}
const blankRow: IValueSettings & {editing: boolean} = {
    point: 0,
    serviceCenterId: 0,
    editing: false,
    state: 0,
    type: Indicators.NewCustomer
}
const initialForm: TForm = Object.values(Indicators).reduce((acc, i) => {
    return {...acc, [i]: {...blankRow, type: i}};
}, {} as TForm);


type TData = {
    [K in Indicators]: string
}

type TColumn = {
    label: string;
    id: number;
    width: string;
    cellProps?: TableCellProps;
}

const data: TData = {
    [Indicators.NewCustomer]: "New customer",
    [Indicators.LostCustomer]: "Lost customer",
    [Indicators.UrgencyFlag]: "Urgency Flag",
    [Indicators.EndOfWarranty]: "End of Warranty",
    [Indicators.CustomerLifetimeValue]: "Customer Lifetime Value"
};
const columns: TColumn[] = [
    {label: "Value Lever", id: 0, width: "25%"},
    {label: "Optimization Settings", id: 1, width: "auto"},
    {label: "OFF/ON", id: 2, width: "10%"},
    {label: "", id: 3, width: "20%", cellProps: {align: "right"}}
]

export const ValueIndicators = () => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const [form, setForm] = useState<TForm>(initialForm);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadValueSettings(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

    const handleChange = (i: Indicators) => (_: any, val: number | number[]) => {
        setForm({...form, [i]: {...form[i], point: val as number} as IValueSettings});
    }
    const handleSwitch = (i: Indicators) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForm({...form, [i]: {...form[i], state: Number(checked)} as IValueSettings});
    }
    const handleEdit = (i: Indicators, checked: boolean) => () => {
        setForm({...form, [i]: {...form[i], editing: checked}});
    }
    const handleSave = (i: Indicators) => () => {
        handleEdit(i, false)();
    }

    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    {columns.map(col =>
                        <TableCell style={{width: col.width}} key={col.id}>{col.label}</TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.values(Indicators).map((idx: string|Indicators) => {
                    if (typeof idx === "string") return null;
                    return <TableRow key={idx}>
                        <TableCell>{data[idx]}</TableCell>
                        <TableCell>
                            <ValueSlider
                                min={SliderRange.Min}
                                max={SliderRange.Max}
                                onChange={
                                    form[idx].editing ?
                                    handleChange(idx) : noop
                                }
                                disabled={!form[idx].state}
                                marks={[
                                    {value: SliderRange.Min, label: SliderRange.Min},
                                    {value: SliderRange.Max, label: SliderRange.Max}
                                ]}
                                valueLabelDisplay="on"
                                value={form[idx].point}
                            />
                        </TableCell>
                        <TableCell>
                            <Switch
                                color="primary"
                                onChange={handleSwitch(idx)}
                                checked={Boolean(form[idx].state)}
                            />
                        </TableCell>
                        <TableCell align="right">
                            {!form[idx].editing
                                ? <Button
                                    color="primary"
                                    onClick={handleEdit(idx, true)}
                                >
                                    Edit
                                </Button>
                                : <>
                                    <Button
                                        onClick={handleEdit(idx, false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={handleSave(idx)}
                                    >
                                        Save
                                    </Button>
                                </>
                            }
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </AppointmentTable>
    </div>
}