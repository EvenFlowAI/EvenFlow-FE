import React from "react";
import {ProgressStepper} from "../../ProgressStepper/ProgressStepper";

type TStepProps = {
    active: number;
    steps: number;
    currentLabel: string;
    nextLabel?: string;
}
export const MobileSteps: React.FC<React.PropsWithChildren<React.PropsWithChildren<TStepProps>>> = ({active, steps, currentLabel, nextLabel}) => {
    return <div>
        <ProgressStepper
            steps={steps}
            activeStep={active}
            label={currentLabel}
            nextLabel={nextLabel}
        />
    </div>;
}