import React, {useCallback, useEffect, useMemo, useState} from "react";
import {TitleContainer} from "../../../components/UI/TitleContainer";
import {OptimizationWindowCard} from "../../../components/OptimizationWindowCard/OptimizationWindowCard";
import {Grid} from "@material-ui/core";
import {DemandSegments} from "../../../components/Modals/admin/DemandSegments/DemandSegments";
import {useModal, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {loadMaxPriceDateRange, loadOptimizationWindows} from "../../../store/reducers/optimizationWindows/actions";
import {
    EOptimizationWindowType,
    optimizationWindowsList,
} from "../../../store/reducers/optimizationWindows/types";
import {OptimizationModal} from "../../../features/OptimizationWindows/OptimizationModal/OptimizationModal";
import {AppointmentCutoffModal} from "../../../features/OptimizationWindows/AppointmentCutoffModal/AppointmentCutoffModal";
import moment from "moment";
import {optimizerRoot, timeSpanString} from "../../../config/constants";
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";
import {MaxPriceDateRangeModal} from "../../../features/OptimizationWindows/MaxPriceDateRangeModal/MaxPriceDateRangeModal";
import {TOptParam} from "./types";
import {blankWindowParam, optContent} from "./constants";

export const OptimizationWindowsPage = () => {
    const [selectedOpt, setSelectedOpt] = useState<EOptimizationWindowType>(EOptimizationWindowType.DemandSegments);
    const {isOpen: isDemandOpen, onClose: onDemandClose, onOpen: onDemandOpen} = useModal();
    const {isOpen: isCutoffOpen, onClose: onCutoffClose, onOpen: onCutoffOpen} = useModal();
    const {isOpen: isOptOpen, onClose: onOptClose, onOpen: onOptOpen} = useModal();
    const {isOpen: isMaxPriceOpen, onClose: onMaxPriceClose, onOpen: onMaxPriceOpen} = useModal();
    const optParams = useSelector((state: RootState) =>
        state.optimizationWindows.dataList
    );
    const {maxPriceDateRange} = useSelector((state: RootState) => state.optimizationWindows);
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
            case EOptimizationWindowType.MaxPriceDateRange:
                return onMaxPriceOpen;
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

    return <>
        <TitleContainer title="Optimization Windows" pad parent={optimizerRoot} />
        <Grid container spacing={3}>
            {optimizationWindowsList.map(k => {
                const plate = optContent[k];
                    return <Grid item xs={12} sm={6} md={4} key={plate.title}>
                        <OptimizationWindowCard
                            onEdit={getPlateEdit(k)}
                            title={plate.title}
                            count={
                                k === EOptimizationWindowType.AppointmentCutoff
                                    ? optMapped[k].value
                                        ? moment(optMapped[k].value, timeSpanString).format("h:mm")
                                        : "-"
                                    : k === EOptimizationWindowType.MaxPriceDateRange
                                        ? maxPriceDateRange
                                            ? maxPriceDateRange
                                            : "-"
                                        : optMapped[k].value
                            }
                            label={k === EOptimizationWindowType.AppointmentCutoff
                                ? optMapped[k].value
                                    ? moment(optMapped[k].value, timeSpanString).format("a")
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
                content={optContent[selectedOpt]}
                payload={optMapped[selectedOpt]}
                onClose={onOptClose}
            />
            <DemandSegments open={isDemandOpen} onClose={onDemandClose} />
            <AppointmentCutoffModal open={isCutoffOpen} onClose={onCutoffClose} />
            <MaxPriceDateRangeModal open={isMaxPriceOpen} onClose={onMaxPriceClose}/>
        </Grid>
    </>
}