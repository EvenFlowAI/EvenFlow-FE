import React, {useEffect, useMemo} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {OptimizationPlate, TOptimizationPlateProps} from "./OptimizationPlate";
import {Grid} from "@material-ui/core";
import {DemandSegments} from "../../Modals/DemandSegments/DemandSegments";
import {useModal, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadDemandSegments} from "../../../store/reducers/demandSegments/actions";

export const OptimizationWindowsPage = () => {
    const {isOpen: isDemandOpen, onClose: onDemandClose, onOpen: onDemandOpen} = useModal();
    const [demandCount] = useSelector((state: RootState) => [
        state.demandSegments.demandSegmentList.length
    ]);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadDemandSegments(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod]);

    const data: TOptimizationPlateProps[] = useMemo(() => [
        {
            count: demandCount,
            helperText: "Set the number of demand value segments to group service requests of equal value",
            label: "Segments",
            title: "Demand Segments",
            onEdit: onDemandOpen
        },
    ], [onDemandOpen, demandCount])
    return <>
        <TitleContainer title="Optimization Windows" pad parent={optimizerRoot} />
        <Grid container spacing={3}>
            {data.map(plate =>
                <Grid item xs={4} key={plate.title}>
                    <OptimizationPlate
                        onEdit={plate.onEdit}
                        title={plate.title}
                        count={plate.count}
                        label={plate.label}
                        helperText={plate.helperText}
                    />
                </Grid>
            )}
            <DemandSegments open={isDemandOpen} onClose={onDemandClose} />
        </Grid>
    </>
}