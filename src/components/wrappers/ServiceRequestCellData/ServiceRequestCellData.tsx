import React from "react";
import {Tooltip} from "@material-ui/core";

export const ServiceRequestCellData: React.FC<{
    data: string; override?: string, prefix?: string; suffix?: string;
}> = ({data, override, prefix, suffix}) => {
    return override ? <Tooltip placement="top" title={`Default value: ${prefix || ""}${data}${suffix || ""}`}>
        <strong style={{cursor: "pointer", userSelect: "none"}}>{prefix}{override}{suffix}</strong>
    </Tooltip> : <span>{prefix}{data}{suffix}</span>;
}