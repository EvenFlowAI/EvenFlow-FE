import React from "react";
import {useCustomerSelectStyles} from "../../../../hooks/styling/useCustomerSelectStyles";

export const InputLabel: React.FC<React.PropsWithChildren<React.PropsWithChildren<{ label: string }>>> = ({label}) => {
    const { classes } = useCustomerSelectStyles();
    return <div className={classes.inputLabel}>{label}</div>
}