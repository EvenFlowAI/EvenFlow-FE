import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import {EOptimizationWindowType} from "../../../store/reducers/optimizationWindows/types";
import {
    OptimizationWindowCard
} from "../../../pages/admin/OptimizationWindows/OptimizationWindowCard/OptimizationWindowCard";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadOptimizationWindows} from "../../../store/reducers/optimizationWindows/actions";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../hooks/useSelectedPod/useSelectedPod";
import {ESearchWindowType, TWindowContent} from "./types";
import {OptimizationModal} from "../../../components/modals/admin/OptimizationModal/OptimizationModal";
import {useModal} from "../../../hooks/useModal/useModal";

export const windowsContent: TWindowContent = {
    [ESearchWindowType.FirstAvailable]: {
        helperText: "Set the optimization window for available time slots when first available date search is entered",
        label: "Days",
        title: "First Available Search",
    },
    [ESearchWindowType.SpecificDate]: {
        prefix: "+/- ",
        helperText: "Set the optimization window for available time slots when a specific date search is entered",
        label: "Days",
        title: "Specific Date Search",
    },
}

const SearchWindows = () => {
    const optParams = useSelector((state: RootState) => state.optimizationWindows.dataList);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const {isOpen: isFirstOpen, onOpen: onFirstOpen, onClose: onFirstClose} = useModal();
    const {isOpen: isSpecificOpen, onOpen: onSpecificOpen, onClose: onSpecificClose} = useModal();
    const firstAvailable = optParams.find(el => el.type === EOptimizationWindowType.FirstAvailable)
    const specificDate = optParams.find(el => el.type === EOptimizationWindowType.SpecificDate)

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadOptimizationWindows(selectedSC.id, selectedPod?.id));
        }
    }, [selectedSC, selectedPod])

    return <>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4} key={'First Available Search'}>
                <OptimizationWindowCard
                    onEdit={onFirstOpen}
                    title={windowsContent[EOptimizationWindowType.FirstAvailable].title}
                    count={firstAvailable ? firstAvailable.value : ''}
                    label={windowsContent[EOptimizationWindowType.FirstAvailable].label}
                    prefix={windowsContent[EOptimizationWindowType.FirstAvailable].prefix}
                    suffix={windowsContent[EOptimizationWindowType.FirstAvailable].suffix}
                    helperText={windowsContent[EOptimizationWindowType.FirstAvailable].helperText}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} key={'First Available Search'}>
                <OptimizationWindowCard
                    onEdit={onSpecificOpen}
                    title={windowsContent[EOptimizationWindowType.SpecificDate].title}
                    count={specificDate ? specificDate.value : ''}
                    label={windowsContent[EOptimizationWindowType.SpecificDate].label}
                    prefix={windowsContent[EOptimizationWindowType.SpecificDate].prefix}
                    suffix={windowsContent[EOptimizationWindowType.SpecificDate].suffix}
                    helperText={windowsContent[EOptimizationWindowType.SpecificDate].helperText}
                />
            </Grid>
        </Grid>
        <OptimizationModal
            open={isFirstOpen}
            windowContent={windowsContent[ESearchWindowType.FirstAvailable]}
            payload={firstAvailable}
            onClose={onFirstClose}
        />
        <OptimizationModal
            open={isSpecificOpen}
            windowContent={windowsContent[ESearchWindowType.SpecificDate]}
            payload={specificDate}
            onClose={onSpecificClose}
        />
        </>
};

export default SearchWindows;