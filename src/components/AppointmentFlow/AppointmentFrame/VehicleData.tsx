import React from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {useTranslation} from "react-i18next";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";

type TProps = {
    onBack: TCallback;
    onNext: TArgCallback<TScreen>;
    currentConfig: TServiceTypeSettings|undefined;
};

export const VehicleData: React.FC<TProps> = ({onNext, onBack, currentConfig}) => {
    const {t} = useTranslation();
    const handleNext = () => {
        onNext(!currentConfig?.advisorSelection
            ? currentConfig?.appointmentSelection
                ? 'appointmentTiming'
                : "appointmentSelection"
            : 'consultantSelection')
    }
    return <StepWrapper>
        {t("Type vehicle data")}
        <Actions onBack={onBack} onNext={handleNext} />
    </StepWrapper>;
};