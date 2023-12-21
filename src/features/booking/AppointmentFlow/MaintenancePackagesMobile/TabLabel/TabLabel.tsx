import React from "react";
import {usePackageMobileStyles} from "../../../../../commonStyles/usePackageMobileStyles";
import {Done} from "@material-ui/icons";

type TTabLabelProps = {
    text: string;
    isSelected: boolean;
}

export const TabLabel: React.FC<TTabLabelProps> = ({text, isSelected}) => {
    const classes = usePackageMobileStyles();
    return <div className={classes.iconWrapper}>{isSelected &&
        <Done className={classes.icon} htmlColor={'white'}/>} {text}</div>
}