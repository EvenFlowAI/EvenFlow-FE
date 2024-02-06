import React from "react";
import {CloseOutlined} from "@mui/icons-material";
import {IServiceRequest} from "../../../../../../store/reducers/serviceRequests/types";
import {useStyles} from "./styles";

type TOpsCodeProps = {
    onDelete: (serviceRequest: IServiceRequest) => void;
    serviceRequest: IServiceRequest,
}

const OpsCode: React.FC<React.PropsWithChildren<React.PropsWithChildren<TOpsCodeProps>>> = ({ onDelete, serviceRequest }) => {
    const { classes  } = useStyles();
    return <div className={classes.wrapper}>{serviceRequest.code}
    <CloseOutlined onClick={() => onDelete(serviceRequest)} className={classes.icon}/></div>
}

export default OpsCode;