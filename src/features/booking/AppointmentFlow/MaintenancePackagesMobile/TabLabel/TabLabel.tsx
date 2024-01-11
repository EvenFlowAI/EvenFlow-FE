import React from "react";
import {usePackageMobileStyles} from "../../../../../hooks/styling/usePackageMobileStyles";
import {Done} from "@mui/icons-material";

type TTabLabelProps = {
    text: string;
    isSelected: boolean;
}

export const TabLabel: React.FC<TTabLabelProps> = ({text, isSelected}) => {
    const classes = usePackageMobileStyles();
    return <div className={classes.iconWrapper}>{isSelected &&
        <Done className={classes.icon} htmlColor={'white'}/>} {text}</div>
}