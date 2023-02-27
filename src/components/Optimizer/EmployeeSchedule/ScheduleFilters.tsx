import React from 'react';
import {Grid, MenuItem, Select} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IScheduleFilters} from "../../../store/reducers/schedules/types";
import {setScheduleFilters} from "../../../store/reducers/schedules/actions";

export const ScheduleFilters = () => {
    const filters = useSelector((state: RootState) => state.employeesSchedule.filters);
    const podList = useSelector((state: RootState) => state.pods.shortPodsList);
    const dispatch = useDispatch();
    const handleSelect = (v: keyof IScheduleFilters) => (e: React.ChangeEvent<{value: unknown}>) => {
        dispatch(setScheduleFilters({[v]: e.target.value}));
    }
    const handleEmployeeFilter = ({target: {value}}: React.ChangeEvent<{value: unknown}>) => {
        if (value === 0) {
            dispatch(setScheduleFilters({role: "Advisor", skillLevel: undefined}));
        } else if (Boolean(value)) {
            dispatch(setScheduleFilters({role: undefined, skillLevel: Number(value)}));
        } else {
            dispatch(setScheduleFilters({role: undefined, skillLevel: undefined}));
        }
    }
    return (
        <Grid container spacing={2} justify="flex-end" style={{marginRight: 20}}>
            <Grid item>
                <Select
                    fullWidth
                    onChange={handleSelect("podId")}
                    value={filters.podId || ''}
                    input={
                        <TextField label="Pod" />
                    }
                >
                    <MenuItem value={''}>-</MenuItem>
                    {podList.map(pod => {
                        return <MenuItem key={pod.id} value={pod.id}>{pod.name}</MenuItem>
                    })}
                </Select>
            </Grid>
            <Grid item>
                <Select
                    fullWidth
                    onChange={handleEmployeeFilter}
                    value={filters.skillLevel ? filters.skillLevel : filters.role ? 0 : ''}
                    input={<TextField label="Employee Position" />}
                >
                    <MenuItem value={''}>-</MenuItem>
                    <MenuItem value={0}>Advisor</MenuItem>
                    {[1,2,3].map(n => {
                        return <MenuItem key={n} value={n}>{`Level ${n}`}</MenuItem>
                    })}
                </Select>
            </Grid>
        </Grid>
    );
};