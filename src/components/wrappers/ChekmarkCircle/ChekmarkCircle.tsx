import React from "react";
import {CheckCircle} from "@mui/icons-material";

export const CheckmarkCircle: React.FC<{ val?: boolean }> = ({val}) => {
    return val ? <CheckCircle color="primary" /> : <span>-</span>;
}