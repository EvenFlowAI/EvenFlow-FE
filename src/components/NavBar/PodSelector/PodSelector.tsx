import React, {useMemo} from "react";
import {useSelectedPod} from "../../../utils/hooks";
import {MenuItem, Select} from "@material-ui/core";
import {RootState} from "../../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "../../FormControls/TextFieldStyled/TextField";
import {setSelectedPod} from "../../../store/reducers/pods/actions";
import {Routes} from "../../../config/routes";
import {matchPath, useLocation} from "react-router-dom";
import {useStyles} from "./styles";

const selectedRoutes: string[] = [
    Routes.Optimizer.AppointmentValue,
    Routes.Optimizer.AppointmentSlotScoring,
    Routes.Optimizer.AppointmentAllocation,
    Routes.Optimizer.OptimizationWindows
];

export const PodSelector = () => {
    const {selectedPod} = useSelectedPod();
    const [pods] = useSelector((state: RootState) => [
        state.pods.shortPodsList
    ]);
    const dispatch = useDispatch();
    const {pathname} = useLocation();

    const show = useMemo(() => {
        for (let route of selectedRoutes) {
            if (Boolean(matchPath(pathname, route)))
                return true;
        }
        return false;
    }, [pathname]);

    const handleSelectPod = (e: React.ChangeEvent<{value: unknown}>) => {
        const val = e.target.value as number;
        const selectedPod = pods.find(p => p.id === val);
        dispatch(setSelectedPod(selectedPod || null));
    }
    const classes = useStyles();

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