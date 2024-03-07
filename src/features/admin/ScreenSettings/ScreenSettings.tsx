import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {loadEmailRequirement} from "../../../store/reducers/screenSettings/actions";
import {EScreenSettingsType, screenSettingsList, TOptContent} from "../../../store/reducers/screenSettings/types";
import {RootState} from "../../../store/rootReducer";
import {CenterSettingsPlate} from "../CenterSettings/CenterSettingsPlate/CenterSettingsPlate";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../hooks/useSelectedPod/useSelectedPod";
import {loadConsentsList} from "../../../store/reducers/screenSettings/actions";
import {useModal} from "../../../hooks/useModal/useModal";
import {EditEmailRequirementModal} from "./EditEmailRequirementModal/EditEmailRequirementModal";
import {EditCustomerConsentModal} from "./EditCustomerConsentModal/EditCustomerConsentModal";

export const ScreenSettings = () => {
    const {
        emailRequirement,
        isEmailRequirementLoading,
        consentsList,
        isConsentLoading
    } = useSelector((state: RootState) => state.screenSettingsBooking);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {selectedPod} = useSelectedPod()
    const {onOpen: onEmailEditOpen, isOpen: isEmailEditOpen, onClose: onEmailEditClose} = useModal();
    const {onOpen: onConsentOpen, isOpen: isConsentOpen, onClose: onConsentClose} = useModal();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadEmailRequirement(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadConsentsList(selectedSC.id, selectedPod?.id))
        }
    }, [selectedSC, selectedPod])

    const getEmailRequirementLabel = (): string => {
        let str = "No data";
        if (emailRequirement) {
            const {adminAndEmployeesEnabled, customerSelfServiceEnabled} = emailRequirement;
            if (adminAndEmployeesEnabled && customerSelfServiceEnabled) return "On";
            if (!adminAndEmployeesEnabled && !customerSelfServiceEnabled) return "Off";
            return "Mixed";
        }
        return str;
    }

    const getCustomerConsentValue = (): string => {
        const allConsentsAreOn = consentsList.length && consentsList.every(el => el.isEnabled)
        const someConsentsAreOn = consentsList.length &&
            consentsList.some(el => el.isEnabled)
            && consentsList.some(el => !el.isEnabled)
        return allConsentsAreOn ? "On" : someConsentsAreOn ? "[On / Off]" : "Off"
    }

    const getCount = (k: EScreenSettingsType): string|number => {
        switch (k) {
            case EScreenSettingsType.EmailRequirement:
                return getEmailRequirementLabel();
            case EScreenSettingsType.CustomerConsent:
                return getCustomerConsentValue();
            default:
                return "No data"
        }
    }

    const optContent: TOptContent = {
        [EScreenSettingsType.EmailRequirement]: {
            helperText: "Data validation configuration for email address on confirmation page",
            label: getEmailRequirementLabel(),
            title: "Email Requirement",
            isLoading: isEmailRequirementLoading,
        },
        [EScreenSettingsType.CustomerConsent]: {
            helperText: "Require customer consent for specific appointment requests",
            label: getCustomerConsentValue(),
            title: "Customer Consent",
            isLoading: isConsentLoading
        },
    }

    const getPlateEdit = (k: EScreenSettingsType): void => {
        switch (k) {
            case EScreenSettingsType.EmailRequirement:
                onEmailEditOpen();
                break;
            case EScreenSettingsType.CustomerConsent:
                onConsentOpen();
                break;
            default:
                return;
        }
    }

    return (
        <>
            <Grid container spacing={3}>
                {screenSettingsList.map(k => {
                    const plate = optContent[k];
                    return <CenterSettingsPlate
                        key={k}
                        onEdit={() => getPlateEdit(k)}
                        title={plate.title}
                        count={getCount(k)}
                        label={""}
                        prefix={plate.prefix}
                        suffix={plate.suffix}
                        helperText={plate.helperText}
                        isLoading={plate.isLoading}
                    />
                })}
            </Grid>
            <EditEmailRequirementModal open={isEmailEditOpen} onClose={onEmailEditClose}/>
            <EditCustomerConsentModal open={isConsentOpen} onClose={onConsentClose}/>
        </>
    );
};