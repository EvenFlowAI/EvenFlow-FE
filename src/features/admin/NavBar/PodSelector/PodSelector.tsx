import React, {useMemo} from "react";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {RootState} from "../../../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {setSelectedPod} from "../../../../store/reducers/pods/actions";
import {matchPath, useLocation} from "react-router-dom";
import {useStyles} from "./styles";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";
import {Routes} from "../../../../routes/constants";

const selectedRoutes: string[] = [
    Routes.CapacityManagement.AppointmentValue,
    Routes.CapacityManagement.AppointmentSlotScoring,
    Routes.CapacityManagement.AppointmentAllocation,
    Routes.CapacityManagement.OptimizationWindows
];

export const PodSelector = () => {
    const {selectedPod} = useSelectedPod();
    const {shortPodsList: pods} = useSelector((state: RootState) => state.pods);
    const dispatch = useDispatch();
    const {pathname} = useLocation();

    const show = useMemo(() => {
        for (let route of selectedRoutes) {
            if (Boolean(matchPath(pathname, route)))
                return true;
        }
        return false;
    }, [pathname]);

    const handleSelectPod = (e: SelectChangeEvent<unknown>) => {
        const val = e.target.value as number;
        const selectedPod = pods.find(p => p.id === val);
        dispatch(setSelectedPod(selectedPod || null));
    }
    const { classes  } = useStyles();

    if (!show) return null;

    return <div>
        <span className={classes.label}>Changes for:</span>
        <Select
            onChange={handleSelectPod}
            value={selectedPod?.id || 0}
            input={<TextField />}
        >
            <MenuItem value={0}>Service Center</MenuItem>
            {pods.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
        </Select>
    </div>
}