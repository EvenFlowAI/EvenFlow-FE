import React from 'react';
import {StepWrapper} from "./StepWrapper";
import {TActionProps} from "./types";
import {Actions} from "./Actions";
import {useTranslation} from "react-i18next";

type TProps = {

}&TActionProps;
export const VehicleData: React.FC<TProps> = ({onNext, onBack}) => {
    const {t} = useTranslation();
    return <StepWrapper>
        {t("Type vehicle data")}
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>;
};