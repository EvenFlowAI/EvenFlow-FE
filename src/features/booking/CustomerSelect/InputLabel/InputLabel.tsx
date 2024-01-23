import React from "react";
import {useCustomerSelectStyles} from "../../../../hooks/styling/useCustomerSelectStyles";

export const InputLabel: React.FC<React.PropsWithChildren<React.PropsWithChildren<{ label: string }>>> = ({label}) => {
    const returningClasses = useCustomerSelectStyles();
    return <div className={returningClasses.inputLabel}>{label}</div>
}