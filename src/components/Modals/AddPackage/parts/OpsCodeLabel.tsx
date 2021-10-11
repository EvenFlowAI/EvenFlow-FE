import React from "react";
import {DeleteOutlined} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

type TOpsCode = {
    onDelete: (code: number) => void;
    code: number,
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 5,
    }
}))

const OpsCode: React.FC<TOpsCode> = ({ onDelete, code }) => {
    const classes = useStyles();
    return <div className={classes.wrapper}>{code}
    <DeleteOutlined onClick={() => onDelete(code)} className={classes.icon}/></div>
}

export default OpsCode;