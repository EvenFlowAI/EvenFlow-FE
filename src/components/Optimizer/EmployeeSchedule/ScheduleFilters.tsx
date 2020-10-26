import React from 'react';
import {Grid, MenuItem, Paper, Select} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IScheduleFilters} from "../../../store/reducers/schedules/types";
import {setScheduleFilters} from "../../../store/reducers/schedules/actions";

type TProps = {
}
export const ScheduleFilters: React.FC<TProps> = () => {
    const filters = useSelector((state: RootState) => state.employeesSchedule.filters);
    const podList = useSelector((state: RootState) => state.pods.shortPodsList);
    const dispatch = useDispatch();
    const handleSelect = (v: keyof IScheduleFilters) => (e: React.ChangeEvent<{value: unknown}>) => {
        dispatch(setScheduleFilters({[v]: e.target.value}));
    }
    const handleEmployeeFilter = ({target: {value}}: React.ChangeEvent<{value: unknown}>) => {
        if (value === 0) {
            dispatch(setScheduleFilters({role: "Advisor"}));
        } else if (Boolean(value)) {
            dispatch(setScheduleFilters({role: undefined, skillLevel: Number(value)}));
        } else {
            dispatch(setScheduleFilters({role: undefined, skillLevel: undefined}));
        }
    }
    return (
        <Paper variant="outlined" style={{
            borderRadius: 0, marginBottom: 18, padding: 18
        }}>
            <Grid container spacing={2} justify="flex-end">
                <Grid item>
                    <Select
                        fullWidth
                        onChange={handleSelect("podId")}
                        value={filters.podId || null}
                        input={
                            <TextField label="Pod" />
                        }
                    >
                        <MenuItem value={undefined}>-</MenuItem>
                        {podList.map(pod => {
                            return <MenuItem key={pod.id} value={pod.id}>{pod.name}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item>
                    <Select
                        fullWidth
                        onChange={handleEmployeeFilter}
                        value={filters.skillLevel ? filters.skillLevel : filters.role ? 0 : null}
                        input={<TextField label="Employee Position" />}
                    >
                        <MenuItem value={undefined}>-</MenuItem>
                        <MenuItem value={0}>Advisor</MenuItem>
                        {[1,2,3].map(n => {
                            return <MenuItem key={n} value={n}>{`Level ${n}`}</MenuItem>
                        })}
                    </Select>
                </Grid>
            </Grid>
        </Paper>
    );
};