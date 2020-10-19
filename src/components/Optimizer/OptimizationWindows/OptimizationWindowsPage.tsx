import React, {useCallback, useEffect, useMemo} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {OptimizationPlate} from "./OptimizationPlate";
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

type TOptParam = {
    [k in EOptimizationWindowType]: IOptimizationWindow;
}
type TOptContent = {
    [k in EOptimizationWindowType]: {
        helperText: string;
        label: string;
        title: string;
        prefix?: string;
        suffix?: string;
    }
}

const optContent: TOptContent = {
    [EOptimizationWindowType.FirstAvailable]: {
        helperText: "Set the optimization window for available time slots when first available date search is entered",
        label: "Days",
        title: "First Available Search",
    },
    [EOptimizationWindowType.SpecificDate]: {
        prefix: "+/-",
        helperText: "Set the optimization window for available time slots when a specific date search is entered",
        label: "Days",
        title: "Specific Date Search",
    },
    [EOptimizationWindowType.DemandSegments]: {
        helperText: "Set the number of demand value segments to group service requests of equal value",
        label: "Segments",
        title: "Demand Segments",
    },
    [EOptimizationWindowType.OverbookingFactor]: {
        helperText: "Set the percent of appointments the center is willing to overbook beyond capacity.",
        suffix: "%",
        label: "percent per day",
        title: "Overbooking factor",
    },
    [EOptimizationWindowType.AppointmentsPerSlot]: {
        helperText: "Set the number of max scheduled appointments per appointment time slot",
        label: "appointments",
        title: "Appointments per slot",
    },
}


const blankWindowParam: IOptimizationWindow = {
    serviceCenterId: 0,
    type: EOptimizationWindowType.OverbookingFactor,
    value: 0
}
export const OptimizationWindowsPage = () => {
    const {isOpen: isDemandOpen, onClose: onDemandClose, onOpen: onDemandOpen} = useModal();
    const {isOpen: isOptOpen, onClose: onOptClose, onOpen: onOptOpen} = useModal();
    const optParams = useSelector((state: RootState) =>
        state.optimizationWindows.dataList
    );
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const optMapped: TOptParam = useMemo(() => {
        return optimizationWindowsList.reduce((acc, k) => {
            acc[k] = optParams.find(el => el.type === k) || {...blankWindowParam, type: k};
            return acc;
        }, {} as TOptParam)
    }, [optParams]);

    const handleEdit = useCallback((type: EOptimizationWindowType) => () => {
        // TODO: HandleSomeDataThrow
        onOptOpen();
    }, [onOptOpen]);

    useEffect(() => {
        if (selectedSC) {
            if (!isDemandOpen && !isOptOpen) {
                // Update after demand or other close
                dispatch(loadOptimizationWindows(selectedSC.id, selectedPod?.id));
            }
            dispatch(loadDemandSegments(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod, isDemandOpen, isOptOpen]);

    return <>
        <TitleContainer title="Optimization Windows" pad parent={optimizerRoot} />
        <Grid container spacing={3}>
            {optimizationWindowsList.map(k => {
                const plate = optContent[k];
                    return <Grid item xs={4} key={plate.title}>
                        <OptimizationPlate
                            onEdit={k === EOptimizationWindowType.DemandSegments
                                ? onDemandOpen : handleEdit(k)}
                            title={plate.title}
                            count={optMapped[k].value}
                            label={plate.label}
                            prefix={plate.prefix}
                            suffix={plate.suffix}
                            helperText={plate.helperText}
                        />
                    </Grid>;
                }
            )}
            <OptimizationDialog open={isOptOpen} onClose={onOptClose} />
            <DemandSegments open={isDemandOpen} onClose={onDemandClose} />
        </Grid>
    </>
}