import React, {useEffect} from 'react';
import {Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {loadEmailRequirement} from "../../../store/reducers/screenSettings/actions";
import {screenSettingsList, TOptContent} from "../../../store/reducers/screenSettings/types";
import {RootState} from "../../../store/rootReducer";
import {EScreenSettingsType} from "../../../store/reducers/screenSettings/types";
import {CenterSettingsPlate} from "../CenterSettings/CenterSettingsPlate/CenterSettingsPlate";
import {TCallback} from "../../../types/types";
import {useSCs} from "../../../hooks/useSCs/useSCs";

type TProps = {
    onEmailEditOpen: TCallback;
}

export const ScreenSettings: React.FC<TProps> = ({onEmailEditOpen}) => {
    const {emailRequirement, isEmailRequirementLoading} = useSelector((state: RootState) => state.screenSettingsBooking);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadEmailRequirement(selectedSC.id))
        }
    }, [selectedSC])

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

        </>
    );
};