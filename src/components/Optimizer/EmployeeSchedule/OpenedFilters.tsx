import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {filterLabels, IScheduleFilters} from "../../../store/reducers/schedules/types";
import {Chip} from "@material-ui/core";
import {setScheduleFilters} from "../../../store/reducers/schedules/actions";

export const OpenedFilters = () => {
    const filters = useSelector((state: RootState) => state.employeesSchedule.filters);
    const podList = useSelector((state: RootState) => state.pods.shortPodsList);
    const dispatch = useDispatch();
    const getFilterLabel = (k: string) => {
        const key = k as keyof IScheduleFilters;
        let v: string = "-";
        let l: string = filterLabels[key] || "";
        const fVal = filters[key];
        if (key === "podId") {
            v = podList.find(p => p.id === fVal)?.name || "-";
        } else if (key === "skillLevel") {
            v = `Level ${fVal}`;
        } else {
            v = String(fVal);
        }
        return `${l}: ${v}`;
    }
    const handleClear = (k: string) => () => {
        dispatch(setScheduleFilters({[k]: undefined}));
    }

    return (
        <div>
            {Object.entries(filters).map(([k, v]) => {
                if (v) {
                    return <Chip style={{margin: 4}} label={getFilterLabel(k)} onDelete={handleClear(k)} />
                } else {
                    return null;
                }
            })}
        </div>
    );
};