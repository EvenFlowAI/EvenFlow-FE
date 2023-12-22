import React from "react";
import {CheckCircle} from "@material-ui/icons";

export const CheckmarkCircle: React.FC<{ val?: boolean }> = ({val}) => {
    return val ? <CheckCircle color="primary" /> : <span>-</span>;
}