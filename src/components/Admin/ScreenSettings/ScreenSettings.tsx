import React, {useEffect} from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {bookingFlowRoot} from "../../Optimizer/utils";
import {Grid} from "@material-ui/core";
import {useModal, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadEmailRequirement} from "../../../store/reducers/screenSettings/actions";
import {screenSettingsList, TOptContent} from "../../../store/reducers/screenSettings/types";
import {RootState} from "../../../store/rootReducer";
import {EScreenSettingsType} from "../../../store/reducers/screenSettings/types";
import {CenterSettingsPlate} from "../../Optimizer/CapacityServiceValet/CenterSettingsPlate";
import EditEmailRequirementDialog from "./EditEmailRequirementDialog";

const ScreenSettings = () => {
    const {emailRequirement, isEmailRequirementLoading} = useSelector((state: RootState) => state.screenSettingsBooking);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {onOpen: onEmailEditOpen, isOpen: isEmailEditOpen, onClose: onEmailEditClose} = useModal();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadEmailRequirement(selectedSC.id))
        }
    }, [selectedSC])

    const getEmailRequirementLabel = (): string => {
        let str = "No data";
        if (emailRequirement) {
            const {callCenterServiceAdvisorEnabled, customerSelfServiceEnabled} = emailRequirement;
            if (callCenterServiceAdvisorEnabled && customerSelfServiceEnabled) return "On";
            if (!callCenterServiceAdvisorEnabled && !customerSelfServiceEnabled) return "Off";
            return "Mixed";
        }
        return str;
    }

    const getCount = (k: EScreenSettingsType): string|number => {
        switch (k) {
            case EScreenSettingsType.EmailRequirement:
                return getEmailRequirementLabel();
            default:
                return "No data"
        }
    }

    const optContent: TOptContent = {
        [EScreenSettingsType.EmailRequirement]: {
            helperText: "Data validation configuration for email address on confirmation page",
            label: getEmailRequirementLabel(),
            title: "Email Requirement",
        },
    }

    const getPlateEdit = (k: EScreenSettingsType): void => {
        switch (k) {
            case EScreenSettingsType.EmailRequirement:
                onEmailEditOpen();
                break;
            default:
                return;
        }
    }

    return (
        <>
            <TitleContainer title="Screen Settings" pad parent={bookingFlowRoot} />
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
                        isLoading={isEmailRequirementLoading}
                    />
                })}
            </Grid>
            <EditEmailRequirementDialog open={isEmailEditOpen} onClose={onEmailEditClose}/>
        </>
    );
};

export default ScreenSettings;