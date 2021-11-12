import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {CloseOutlined} from "@material-ui/icons";

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

type TModelProps = {
    model: string;
    onDelete: (model: string) => void;
}

const Model = ({model, onDelete}: TModelProps) => {
    const classes = useStyles();
    return <div className={classes.wrapper}>{model}
        <CloseOutlined onClick={() => onDelete(model)} className={classes.icon}/></div>;
};

export default Model;