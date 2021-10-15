import React from "react";
import {CloseOutlined} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {IServiceRequest} from "../../../../store/reducers/serviceRequests/types";

type TOpsCode = {
    onDelete: (serviceRequest: IServiceRequest) => void;
    serviceRequest: IServiceRequest,
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'start',
        background: '#7898FF',
        color: 'white',
        borderRadius: 4,
        fontWeight: 'bold',
        margin: 4,
        padding: 4,
    },
    icon: {
        marginLeft: 5,
        fontSize: 16,
        background: 'white',
        color: '#7898FF',
        borderRadius: '50%',
        cursor: 'pointer',
    }
}))

const OpsCode: React.FC<TOpsCode> = ({ onDelete, serviceRequest }) => {
    const classes = useStyles();
    return <div className={classes.wrapper}>{serviceRequest.code}
    <CloseOutlined onClick={() => onDelete(serviceRequest)} className={classes.icon}/></div>
}

export default OpsCode;