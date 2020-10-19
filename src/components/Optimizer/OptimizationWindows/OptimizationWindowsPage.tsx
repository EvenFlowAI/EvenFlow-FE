import React, {useCallback, useEffect, useMemo} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {OptimizationPlate, TOptimizationPlateProps} from "./OptimizationPlate";
import {Grid} from "@material-ui/core";
import {DemandSegments} from "../../Modals/DemandSegments/DemandSegments";
import {useModal, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {loadOptimizationWindows} from "../../../store/reducers/optimizationWindows/actions";
import {
    EOptimizationWindowType,
    IOptimizationWindow,
    optimizationWindowsList
} from "../../../store/reducers/optimizationWindows/types";
import {OptimizationDialog} from "./OptimizationWindowDialog";

const blankWindowParam: IOptimizationWindow = {
    serviceCenterId: 0,
    type: EOptimizationWindowType.OverbookingFactor,
    value: 0
}
export const OptimizationWindowsPage = () => {
    const {isOpen: isDemandOpen, onClose: onDemandClose, onOpen: onDemandOpen} = useModal();
    const {isOpen: isOptOpen, onClose: onOptClose, onOpen: onOptOpen} = useModal();
    const [demandCount, optParams] = useSelector((state: RootState) => [
        state.demandSegments.demandSegmentList.length,
        state.optimizationWindows.dataList
    ]);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const [
        firstAvailable,
        specificDate,
        ,
        overbookingFactor,
        appointmentsPerSlot
    ] = useMemo(() => {
        return optimizationWindowsList.map(k => {
            return optParams.find(el => el.type === k) || {...blankWindowParam, type: k};
        })
    }, [optParams]);

    const handleEdit = useCallback((type: EOptimizationWindowType) => () => {
        // TODO: HandleSomeDataThrow
        onOptOpen();
    }, [onOptOpen]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadDemandSegments(selectedSC.id, selectedPod?.id));
            dispatch(loadOptimizationWindows(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod]);

    const data: TOptimizationPlateProps[] = useMemo(() => [
        {
            count: firstAvailable.value,
            helperText: "Set the optimization window for available time slots when first available date search is entered",
            label: "Days",
            title: "First Available Search",
            onEdit: handleEdit(EOptimizationWindowType.FirstAvailable)
        },
        {
            count: specificDate.value,
            prefix: "+/-",
            helperText: "Set the optimization window for available time slots when a specific date search is entered",
            label: "Days",
            title: "Specific Date Search",
            onEdit: handleEdit(EOptimizationWindowType.SpecificDate)
        },
        {
            count: demandCount,
            helperText: "Set the number of demand value segments to group service requests of equal value",
            label: "Segments",
            title: "Demand Segments",
            onEdit: onDemandOpen
        },
        {
            count: overbookingFactor.value,
            helperText: "Set the percent of appointments the center is willing to overbook beyond capacity.",
            suffix: "%",
            label: "percent per day",
            title: "Overbooking factor",
            onEdit: handleEdit(EOptimizationWindowType.OverbookingFactor)
        },
        {
            count: appointmentsPerSlot.value,
            helperText: "Set the number of max scheduled appointments per appointment time slot",
            label: "appointments",
            title: "Appointments per slot",
            onEdit: handleEdit(EOptimizationWindowType.AppointmentsPerSlot)
        },
    ], [
        handleEdit,
        onDemandOpen,
        demandCount,
        firstAvailable,
        specificDate,
        overbookingFactor,
        appointmentsPerSlot
    ]);

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
                        prefix={plate.prefix}
                        suffix={plate.suffix}
                        helperText={plate.helperText}
                    />
                </Grid>
            )}
            <OptimizationDialog open={isOptOpen} onClose={onOptClose} />
            <DemandSegments open={isDemandOpen} onClose={onDemandClose} />
        </Grid>
    </>
}