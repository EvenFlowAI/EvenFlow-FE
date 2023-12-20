import React from "react";
import {useCustomerSelectStyles} from "../../../../commonStyles/useCustomerSelectStyles";

export const InputLabel: React.FC<{ label: string }> = ({label}) => {
    const returningClasses = useCustomerSelectStyles();
    return <div className={returningClasses.inputLabel}>{label}</div>
}