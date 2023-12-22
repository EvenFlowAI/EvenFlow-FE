import React from 'react';
import {CloseOutlined} from "@material-ui/icons";
import {useStyles} from "./styles";

type TModelProps = {
    name: string;
    onDelete: (model: string) => void;
}

export const Chip = ({name, onDelete}: TModelProps) => {
    const classes = useStyles();
    return <div className={classes.wrapper}>{name}
        <CloseOutlined onClick={() => onDelete(name)} className={classes.icon}/></div>;
};