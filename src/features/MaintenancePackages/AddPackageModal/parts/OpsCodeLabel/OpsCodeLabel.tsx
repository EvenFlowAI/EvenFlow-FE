import React from "react";
import {CloseOutlined} from "@material-ui/icons";
import {IServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {useStyles} from "./styles";

type TOpsCodeProps = {
    onDelete: (serviceRequest: IServiceRequest) => void;
    serviceRequest: IServiceRequest,
}

const OpsCode: React.FC<TOpsCodeProps> = ({ onDelete, serviceRequest }) => {
    const classes = useStyles();
    return <div className={classes.wrapper}>{serviceRequest.code}
    <CloseOutlined onClick={() => onDelete(serviceRequest)} className={classes.icon}/></div>
}

export default OpsCode;