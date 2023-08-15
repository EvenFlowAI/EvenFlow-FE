import React from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {useTranslation} from "react-i18next";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

type TProps = {
    onBack: TCallback;
    onNext: TArgCallback<TScreen>;
};

export const VehicleData: React.FC<TProps> = ({onNext, onBack}) => {
    const {t} = useTranslation();
    const {currentConfig} = useSelector((state: RootState) => state.bookingFlowConfig);

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