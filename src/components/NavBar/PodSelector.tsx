import React, {useMemo} from "react";
import {useSelectedPod} from "../../utils/hooks";
import {MenuItem, Select} from "@material-ui/core";
import {RootState} from "../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "../UI/TextField";
import {setSelectedPod} from "../../store/reducers/pods/actions";
import {makeStyles} from "@material-ui/core/styles";
import {Routes} from "../../config/routes";
import { matchPath } from "react-router-dom";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles({
    label: {
        marginRight: 8,
        fontWeight: "bold",
        textTransform: "uppercase"
    }
});

export const PodSelector = () => {
    const {selectedPod} = useSelectedPod();
    const [pods] = useSelector((state: RootState) => [
        state.pods.shortPodsList
    ]);
    const dispatch = useDispatch();
    const {pathname} = useLocation();

    const show = useMemo(() => {
        if (matchPath(pathname, Routes.Optimizer.Base)) {
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