import React, {useCallback, useEffect, useMemo, useState} from "react";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {OptimizationWindowCard} from "./OptimizationWindowCard/OptimizationWindowCard";
import {Grid} from "@mui/material";
import {DemandSegmentsModal} from "../../../features/admin/DemandSegmentsModal/DemandSegmentsModal";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {loadMaxPriceDateRange, loadOptimizationWindows} from "../../../store/reducers/optimizationWindows/actions";
import {
    EOptimizationWindowType,
    optimizationWindowsList, TOptContentData,
} from "../../../store/reducers/optimizationWindows/types";
import {OptimizationModal} from "../../../components/modals/admin/OptimizationModal/OptimizationModal";
import {AppointmentCutoffModal} from "../../../features/admin/OptimizationWindows/AppointmentCutoffModal/AppointmentCutoffModal";
import {capacityManagementRoot, timeSpanString} from "../../../utils/constants";
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";
import {TOptParam} from "./types";
import {blankWindowParam, optContent} from "./constants";
import {useModal} from "../../../hooks/useModal/useModal";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../hooks/useSelectedPod/useSelectedPod";
import dayjs from "dayjs";

export const OptimizationWindowsPage = () => {
    const [selectedOpt, setSelectedOpt] = useState<EOptimizationWindowType>(EOptimizationWindowType.DemandSegments);
    const {isOpen: isDemandOpen, onClose: onDemandClose, onOpen: onDemandOpen} = useModal();
    const {isOpen: isCutoffOpen, onClose: onCutoffClose, onOpen: onCutoffOpen} = useModal();
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
        setSelectedOpt(type);
        onOptOpen();
    }, [onOptOpen]);

    const getPlateEdit = (k: EOptimizationWindowType) => {
        switch (k) {
            case EOptimizationWindowType.DemandSegments:
                return onDemandOpen;
            case EOptimizationWindowType.AppointmentCutoff:
                return onCutoffOpen;
            default:
                return handleEdit(k);
        }
    }

    useEffect(() => {
        if (selectedSC) {
            if (!isDemandOpen) {
                // Update after demand close
                dispatch(loadOptimizationWindows(selectedSC.id, selectedPod?.id));
            }
            dispatch(loadDemandSegments(selectedSC.id, selectedPod?.id));
            dispatch(loadWorkingDays(selectedSC.id));
            dispatch(loadMaxPriceDateRange(selectedSC.id))
        }
    }, [dispatch, selectedSC, selectedPod, isDemandOpen]);

    const optContentData: TOptContentData = optContent[selectedOpt];

    return <>
        <TitleContainer title="Optimization Windows" pad parent={capacityManagementRoot} />
        <Grid container spacing={3}>
            {optimizationWindowsList
                .filter(el => el !== EOptimizationWindowType.FirstAvailable && el !== EOptimizationWindowType.SpecificDate)
                .map(k => {
                const plate = optContent[k];
                    return <Grid item xs={12} sm={6} md={4} key={plate.title}>
                        <OptimizationWindowCard
                            onEdit={getPlateEdit(k)}
                            title={plate.title}
                            count={
                                k === EOptimizationWindowType.AppointmentCutoff
                                    ? optMapped[k].value
                                        ? dayjs.utc(optMapped[k].value, timeSpanString).format("h:mm")
                                        : "-"
                                        : optMapped[k].value
                            }
                            label={k === EOptimizationWindowType.AppointmentCutoff
                                ? optMapped[k].value
                                    ? dayjs.utc(optMapped[k].value, timeSpanString).format("a")
                                    : "-"
                                : plate.label}
                            prefix={plate.prefix}
                            suffix={plate.suffix}
                            helperText={plate.helperText}
                        />
                    </Grid>;
                }
            )}
            <OptimizationModal
                open={isOptOpen}
                windowContent={optContentData}
                payload={optMapped[selectedOpt]}
                onClose={onOptClose}
            />
            <DemandSegmentsModal open={isDemandOpen} onClose={onDemandClose} />
            <AppointmentCutoffModal open={isCutoffOpen} onClose={onCutoffClose} />
        </Grid>
    </>
}